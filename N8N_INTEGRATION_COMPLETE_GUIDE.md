# 🔌 N8N Integration Guide - Efficience Analytics

## Qu'est-ce que N8N?

**N8N** = No-code/low-code automation platform

C'est un outil qui permet de **créer des flux d'automatisation** sans écrire de code, en utilisant une interface visuelle.

**Analogie:** Si Zapier est un restaurant avec menu limité, N8N est un chef qui peut créer n'importe quel plat.

---

## Pourquoi N8N pour Efficience?

### Problème actuel:
```
Admin → Va sur /admin/import
     → Upload fichier CSV
     → Clique "Importer"
     → Données insérées
     
⏱️ Processus manuel 
😴 Prend du temps
❌ Répétitif
```

### Solution N8N:
```
Fichier dans Dropbox
     ↓ (N8N surveille)
Nouveau fichier détecté
     ↓ (N8N automatique)
Fichier parsingé
     ↓
Données validées
     ↓
N8N appelle webhook Efficience
     ↓
Données insérées en DB
     ↓
Admin reçoit notification
     
✨ Complètement automatisé
⚡ Instantané
✅ Zéro intervention
```

---

## Flux N8N Proposé

### Architecture:

```
┌──────────────────────────────────────────────────────────────┐
│                      SYSTÈME N8N                             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  [1. Source de Fichiers]                                     │
│      ├─ Dropbox                                              │
│      ├─ Google Drive                                         │
│      ├─ Serveur FTP                                          │
│      └─ OneDrive                                             │
│           │                                                  │
│           ↓ (N8N surveille dossier)                          │
│                                                               │
│  [2. Détecter Nouveau Fichier]                              │
│      ├─ Detecte *.csv                                        │
│      ├─ Detecte *.xlsx                                       │
│      └─ Ignore autres formats                                │
│           │                                                  │
│           ↓                                                   │
│                                                               │
│  [3. Parser Fichier]                                        │
│      ├─ Lire CSV avec délimiteur (,)                        │
│      ├─ Lire Excel avec sheet name                          │
│      ├─ Extraire header (colonnes)                          │
│      └─ Extraire rows (données)                             │
│           │                                                  │
│           ↓                                                   │
│                                                               │
│  [4. Valider Données]                                       │
│      ├─ Vérifier colonnes requises                          │
│      ├─ Vérifier types de données                           │
│      ├─ Vérifier formats (email, etc)                       │
│      └─ Rejeter rows invalides                              │
│           │                                                  │
│           ↓                                                   │
│                                                               │
│  [5. Appeler Webhook Efficience]                            │
│      ├─ POST /api/admin/import                              │
│      ├─ Headers: Content-Type, Auth                         │
│      └─ Body: { type, cabinetId, data }                     │
│           │                                                  │
│           ↓                                                   │
│           EFFICIENCE BACKEND (MongoDB)                       │
│           │                                                  │
│           ↓                                                   │
│                                                               │
│  [6. Gérer Réponse]                                         │
│      ├─ Si succès → Archiver fichier                        │
│      ├─ Si erreur → Envoyer email admin                     │
│      └─ Logger résultat                                     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Configuration N8N Étape par Étape

### Étape 1: Installer N8N

```bash
# Option A: Docker (recommandé)
docker run -it --rm \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Accéder à: http://localhost:5678

# Option B: npm
npm install -g n8n
n8n start
```

### Étape 2: Créer un Workflow

1. Aller à `http://localhost:5678`
2. Cliquer "New Workflow"
3. Donner un nom: "Efficience File Import"

### Étape 3: Ajouter le Trigger (Déclencheur)

```
Ajouter Node → Dropbox (ou Google Drive, FTP, etc)
├─ Sélectionner "Watch for new files"
├─ Folder path: "/Efficience/imports" (à créer)
├─ File pattern: "*.csv,*.xlsx"
└─ Polling interval: 1 minute
```

### Étape 4: Ajouter Parser

```
Ajouter Node → Spreadsheet
├─ Action: "Read"
├─ Format: Auto-detect
└─ Output mode: "Rows as objects"
```

### Étape 5: Ajouter Validateur

```
Ajouter Node → Code
├─ Coller validation logic:

const requiredColumns = {
  'patients': ['id', 'nom', 'prenom', 'email', 'telephone'],
  'finances': ['id', 'cabinetId', 'mois', 'revenus', 'depenses'],
  'production': ['id', 'cabinetId', 'praticien', 'mois', 'heures']
};

// Vérifier les colonnes
// Filtrer les rows invalides
```

### Étape 6: Ajouter Webhook HTTP

```
Ajouter Node → HTTP Request
├─ Method: POST
├─ URL: https://efficience.app/api/admin/import
├─ Headers:
│  ├─ Content-Type: application/json
│  └─ Authorization: Bearer YOUR_WEBHOOK_TOKEN
├─ Body:
│  {
│    "type": "patients",
│    "cabinetId": "cab_001",
│    "data": [
│      { "id": 1, "nom": "Dupont", ... },
│      { "id": 2, "nom": "Martin", ... }
│    ]
│  }
└─ Response handling: Handle errors
```

### Étape 7: Ajouter Gestion Erreurs

```
Ajouter Node → Email (si erreur)
├─ To: admin@efficience-dentaire.fr
├─ Subject: "❌ Import N8N Failed"
├─ Body: Détails de l'erreur
└─ Condition: On failure only
```

### Étape 8: Ajouter Archivage

```
Ajouter Node → Dropbox
├─ Action: "Move file"
├─ From: /Efficience/imports/file.csv
├─ To: /Efficience/imports/archived/file_2024-01-20.csv
└─ Condition: On success only
```

### Étape 9: Ajouter Notification

```
Ajouter Node → Email (si succès)
├─ To: admin@efficience-dentaire.fr
├─ Subject: "✅ Import réussi"
├─ Body: N records importés
└─ Condition: On success only
```

### Étape 10: Activer le Workflow

```
Cliquer "Activate"
N8N surveille maintenant le dossier 24/7
```

---

## Flux Visuel N8N

```
        START
          │
          ↓
    [DROPBOX TRIGGER]
    (Surveille /imports)
          │
          ↓ (Nouveau fichier CSV/Excel)
          │
    [PARSE SPREADSHEET]
    (Lire les données)
          │
          ↓
    [VALIDATE DATA]
    (Vérifier colonnes)
          │
     ┌────┴────┐
     │          │
    ✅ OK     ❌ ERREUR
     │          │
     ↓          ↓
  [HTTP POST] [EMAIL ERROR]
  /api/admin/  (Admin notifié)
   import      │
     │         └─→ STOP
     │
     ↓
  [EFFICIENCE API]
  (MongoDB insert)
     │
     ├─→ ✅ SUCCESS
     │   ├─ [ARCHIVE FILE]
     │   └─ [EMAIL SUCCESS]
     │
     └─→ ❌ ERROR
         └─ [EMAIL ERROR]
```

---

## Webhook Endpoint - Spécifications

### URL
```
POST https://efficience.app/api/admin/import
```

### Headers
```
Content-Type: application/json
Authorization: Bearer YOUR_WEBHOOK_SECRET_TOKEN
X-Webhook-Source: n8n
```

### Request Body (Example)

#### Patients:
```json
{
  "type": "patients",
  "cabinetId": "cabinet_001",
  "data": [
    {
      "id": "p_001",
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean@example.com",
      "telephone": "0123456789",
      "dateCreation": "2024-01-15"
    },
    {
      "id": "p_002",
      "nom": "Martin",
      "prenom": "Marie",
      "email": "marie@example.com",
      "telephone": "0987654321",
      "dateCreation": "2024-01-16"
    }
  ]
}
```

#### Finances:
```json
{
  "type": "finances",
  "cabinetId": "cabinet_001",
  "data": [
    {
      "id": "f_001",
      "cabinetId": "cabinet_001",
      "mois": "2024-01",
      "revenus": 8500,
      "depenses": 3200,
      "benefice": 5300
    }
  ]
}
```

#### Production:
```json
{
  "type": "production",
  "cabinetId": "cabinet_001",
  "data": [
    {
      "id": "prod_001",
      "cabinetId": "cabinet_001",
      "praticien": "Dr. Dupont",
      "mois": "2024-01",
      "heures": 160,
      "nombreRdv": 45,
      "ca": 8500
    }
  ]
}
```

### Response (Success)
```json
{
  "success": true,
  "imported": 2,
  "errors": 0,
  "skipped": 0,
  "message": "2 patients importés avec succès",
  "timestamp": "2024-01-20T15:30:00Z",
  "importId": "imp_abc123"
}
```

### Response (Error)
```json
{
  "success": false,
  "imported": 0,
  "errors": 2,
  "skipped": 0,
  "message": "Colonnes requises manquantes: telephone, dateCreation",
  "invalidRows": [
    {
      "rowNumber": 2,
      "data": {...},
      "error": "Email invalide"
    }
  ],
  "timestamp": "2024-01-20T15:30:00Z"
}
```

---

## Formats Fichiers Supportés

### CSV Format
```
id,nom,prenom,email,telephone,dateCreation
p_001,Dupont,Jean,jean@example.com,0123456789,2024-01-15
p_002,Martin,Marie,marie@example.com,0987654321,2024-01-16
```

### Excel Format
```
| id    | nom   | prenom | email            | telephone   | dateCreation |
|-------|-------|--------|------------------|-------------|--------------|
| p_001 | Dupont| Jean   | jean@example.com | 0123456789  | 2024-01-15   |
| p_002 | Martin| Marie  | marie@example.com| 0987654321  | 2024-01-16   |
```

---

## Sécurité Webhook

### Générer Secret Token
```bash
# Node.js
const crypto = require('crypto');
const token = crypto.randomBytes(32).toString('hex');
console.log(token);
// Output: abc123def456ghi789jkl...

# Stocker en: .env.local
WEBHOOK_SECRET_TOKEN=abc123def456ghi789jkl...
```

### Vérifier Signature (Optional)
```typescript
// Dans /api/admin/import/route.ts
import crypto from 'crypto';

const signature = req.headers['x-webhook-signature'];
const body = JSON.stringify(req.body);
const expectedSignature = crypto
  .createHmac('sha256', process.env.WEBHOOK_SECRET_TOKEN)
  .update(body)
  .digest('hex');

if (signature !== expectedSignature) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### N8N Configuration
```
Dans l'étape HTTP Request:
├─ Headers → Add custom header
├─ Name: X-Webhook-Signature
├─ Value: sha256(body, secret)
```

---

## Monitoring & Alertes

### N8N Dashboard:
```
Cliquer sur Workflow → "Execution history"
├─ Voir tous les imports
├─ Voir statuts (success/error)
├─ Voir timestamps
├─ Voir logs détaillés
└─ Télécharger logs
```

### Efficience Admin:
```
Aller à /admin/system
├─ Voir logs d'importation
├─ Voir source (N8N vs Manual upload)
├─ Voir nombre records
├─ Voir durée
└─ Voir erreurs
```

### Alertes Email:
```
N8N envoie email si:
├─ Erreur de connexion au webhook
├─ Données invalides
├─ Timeout
└─ Réponse 500 du serveur
```

---

## Troubleshooting

### Problème 1: Webhook timeout
**Cause:** Efficience API trop lent ou offline
**Solution:**
- Augmenter timeout N8N (default 30s → 60s)
- Vérifier santé serveur Efficience
- Vérifier base de données MongoDB

### Problème 2: Colonnes non reconnues
**Cause:** Noms colonnes différents dans fichier
**Solution:**
- Utiliser templates fournis
- Renommer colonnes avant import
- Ajouter mapping dans N8N

### Problème 3: Fichiers ne sont pas détectés
**Cause:** N8N ne surveil pas le bon dossier
**Solution:**
- Vérifier chemin dossier Dropbox/Drive
- Vérifier permissions N8N
- Vérifier polling interval (1 minute min)
- Check logs N8N pour erreurs

### Problème 4: Données doublonnées
**Cause:** Même fichier importé 2 fois
**Solution:**
- Ajouter logique détection doublons dans API
- Ajouter vérification en N8N (hash du fichier)
- Archive automatique après succès

---

## Cas d'Usage

### Cas 1: Import Patients Mensuels
```
Admin reçoit liste patients nouveau cabinet
    ↓
Upload fichier CSV dans Dropbox
    ↓
N8N détecte automatiquement
    ↓
Parse et valide
    ↓
Importe dans Efficience
    ↓
Admin reçoit notification ✅
    ↓
Patients visibles dans /admin/cabinets
```

### Cas 2: Synchronisation Finances
```
Comptable exporte finances d'une autre app (Excel)
    ↓
Upload dans dossier FTP
    ↓
N8N surveille et détecte
    ↓
Transforme format si besoin
    ↓
Appelle webhook avec données finances
    ↓
MongoDB mis à jour
    ↓
Dashboard admin affiche immédiatement
```

### Cas 3: Production Hebdo
```
Chaque vendredi, gestionnaire exporte données production
    ↓
Place fichier dans Google Drive (dossier N8N)
    ↓
N8N tâche programmée (weekly) récupère
    ↓
Import dans Efficience
    ↓
Analytics mises à jour
    ↓
Rapports générés automatiquement
```

---

## Alternatives à Considérer

### Zapier:
- ✅ Très simple
- ❌ Limité (500+ actions but pas tout)
- ❌ Coûteux à grande échelle

### Make (Integromat):
- ✅ Bon équilibre simplicité/puissance
- ✅ Moins cher que Zapier
- ❌ Moins flexible que N8N

### N8N:
- ✅ Très flexible
- ✅ Open-source (self-hosted)
- ✅ Pas de limites
- ❌ Courbe d'apprentissage

**Recommandation:** N8N pour Efficience (open-source, scalable, pas de limites)

---

## Prochaines Étapes

1. ✅ Créer endpoint `/api/admin/import` (TODO)
2. ✅ Générer webhook secret token
3. ✅ Installer N8N localement ou cloud
4. ✅ Créer workflow comme décrit
5. ✅ Tester avec fichier sample
6. ✅ Vérifier logs
7. ✅ Déployer en production

---

## Resources

- **N8N Docs:** https://docs.n8n.io/
- **N8N Community:** https://community.n8n.io/
- **Webhook Docs:** https://docs.n8n.io/nodes/n8n-nodes-base.httpRequest/

---

**N8N est l'outil parfait pour automatiser l'import et ne jamais toucher manuellement à nouveau!** 🚀
