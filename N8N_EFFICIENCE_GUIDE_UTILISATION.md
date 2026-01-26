# 📊 Guide Complet: Synchronisation N8N + Efficience

## 🎯 Objectif Final

Vous avez maintenant un **système complet d'automatisation**:

1. ✅ **Bouton "Synchroniser"** dans l'interface admin
2. ✅ **N8N détecte** et valide les fichiers CSV/Excel
3. ✅ **MongoDB reçoit** les données automatiquement
4. ✅ **Dashboard affiche** les changements en temps réel
5. ✅ **Audit logging** de chaque import

---

## 📁 Fichiers Créés

### 1. APIs Backend
- **`app/api/admin/webhook-n8n/route.ts`** - Reçoit les données de N8N
- **`app/api/admin/trigger-sync/route.ts`** - Déclenche la synchronisation
- **`app/api/admin/recent-imports/route.ts`** - Récupère les imports récents

### 2. Composants React
- **`components/admin/n8n-sync-button.tsx`** - Bouton de synchronisation
- **`components/admin/realtime-updates.tsx`** - Affiche les mises à jour en temps réel

### 3. Pages Mises à Jour
- **`app/admin/page.tsx`** - Ajout du bouton de sync
- **`app/dashboard/page.tsx`** - Affichage des mises à jour en temps réel

### 4. Documentation
- **`N8N_SETUP_EFFICIENCE_COMPLETE.md`** - Guide configuration N8N complète

---

## 🚀 Mise en Place

### Étape 1: Démarrer N8N

```powershell
# Option A: Docker
docker run -it --rm `
  -p 5678:5678 `
  -e DB_TYPE=sqlite `
  -v $env:USERPROFILE\.n8n:/home/node/.n8n `
  n8nio/n8n

# Option B: NPM
npm install -g n8n
n8n start
```

Accédez à: http://localhost:5678

### Étape 2: Configurer les Variables d'Environnement

```env
# .env.local

# Token webhook (générer un token sécurisé)
N8N_WEBHOOK_TOKEN=your-super-secret-token-12345

# URL de déclenchement N8N
N8N_TRIGGER_WEBHOOK_URL=http://localhost:5678/webhook/efficience-sync

# URL de callback (où N8N envoie les données)
N8N_CALLBACK_WEBHOOK_URL=http://localhost:3000/api/admin/webhook-n8n
```

### Étape 3: Créer le Workflow N8N

Suivez le guide complet: [N8N_SETUP_EFFICIENCE_COMPLETE.md](N8N_SETUP_EFFICIENCE_COMPLETE.md)

**Résumé rapide:**
1. Webhook Trigger (reçoit les données)
2. Code Node (valide les données)
3. IF Node (vérifie si valides)
4. HTTP Request (envoie à Efficience)
5. Email (notification)

### Étape 4: Démarrer Efficience

```bash
npm run dev
```

---

## 🔄 Flux de Données Complet

```
UTILISATEUR              INTERFACE EFFICIENCE      N8N              MONGODB
    │                           │                  │                  │
    │ Clique "Synchroniser"     │                  │                  │
    ├──────────────────────────→│                  │                  │
    │                           │ POST             │                  │
    │                           │ /trigger-sync    │                  │
    │                           ├─────────────────→│                  │
    │                           │                  │ Déclenche        │
    │                           │                  │ workflow         │
    │                           │                  │                  │
    │                           │    POST          │                  │
    │                           │    /webhook-n8n  │                  │
    │                           │←─────────────────┤                  │
    │                           │    (données      │                  │
    │                           │    validées)     │                  │
    │                           │                  │                  │
    │                           │ insertMany()     │                  │
    │                           ├─────────────────────────────────────→│
    │                           │                  │                  │
    │    Notification           │                  │                  │
    │    "✅ Succès!"           │←─────────────────────────────────────┤
    │←──────────────────────────┤                  │                  │
    │                           │                  │                  │
    │ Rafraîchit               │                  │                  │
    │ après 2s                 │                  │                  │
    │ → Données à jour ✨       │                  │                  │
```

---

## 💻 Utilisation

### Via l'Interface Admin

1. **Aller à:** http://localhost:3000/admin
2. **Cliquer:** "Synchroniser maintenant"
3. **Attendre:** Message de confirmation
4. **Constater:** Dashboard se met à jour automatiquement ✨

### Via Postman/cURL

```powershell
# Test direct du webhook
$body = @{
    "type" = "patients"
    "cabinetId" = "cab_efficience"
    "data" = @(
        @{"nom" = "Dupont"; "prenom" = "Jean"; "email" = "jean@example.com"},
        @{"nom" = "Martin"; "prenom" = "Marie"; "email" = "marie@example.com"}
    )
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer your-secret-token"
}

Invoke-WebRequest -Uri "http://localhost:3000/api/admin/webhook-n8n" `
  -Method POST `
  -Headers $headers `
  -Body $body
```

---

## 📊 Types de Données Supportées

### 1. Patients
```json
{
  "type": "patients",
  "data": [
    {
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean@example.com",
      "telephone": "0612345678"
    }
  ]
}
```

### 2. Finances (Chiffre d'Affaires)
```json
{
  "type": "finances",
  "data": [
    {
      "cabinetId": "cab_001",
      "periode": "2026-01",
      "chiffreAffaires": 45000,
      "revenus": 45000,
      "depenses": 12000
    }
  ]
}
```

### 3. Production (Heures, Actes)
```json
{
  "type": "production",
  "data": [
    {
      "cabinetId": "cab_001",
      "praticien": "Dr. Martin",
      "periode": "2026-01",
      "heures": 160,
      "actes": 250,
      "revenus": 35000
    }
  ]
}
```

### 4. Rendez-vous
```json
{
  "type": "appointments",
  "data": [
    {
      "cabinetId": "cab_001",
      "patientNom": "Jean Dupont",
      "date": "2026-01-25",
      "heure": "09:00",
      "praticien": "Dr. Martin",
      "type": "CONTRÔLE"
    }
  ]
}
```

---

## 🔍 Vérifier que ça Marche

### 1. Logs N8N
Aller à: http://localhost:5678/executions

Vérifier:
- ✅ Workflow s'exécute sans erreur
- ✅ Node HTTP Request reçoit réponse 200
- ✅ Données sont envoyées correctement

### 2. Logs MongoDB

```javascript
// Dans MongoDB Compass
db.webhook_logs.find({}).sort({ timestamp: -1 }).limit(10)
```

Vérifier:
- ✅ Collection `webhook_logs` a les nouveaux imports
- ✅ `success: true`
- ✅ Nombre de records corrects

### 3. Logs Efficience

```bash
# Terminal Node.js
npm run dev
```

Vérifier dans les logs:
- ✅ API webhook reçoit les données
- ✅ MongoDB insert réussit
- ✅ Pas d'erreur de validation

---

## 🎨 Interface Admin Mise à Jour

Le page admin (`/admin`) contient maintenant:

### Bouton "Synchroniser"
- Titre: "Synchronisation N8N"
- Action: Déclenche le webhook
- Affiche le statut (en cours, succès, erreur)
- Rafraîchit après 2 secondes

### Historique Temps Réel
- Affiche les 5 derniers imports
- Timestamp de chaque import
- Type de données (patients, finances, etc)
- Nombre de records

---

## ⚙️ Configuration Avancée

### Ajouter un Trigger Dropbox (Optionnel)

Dans N8N, au lieu du webhook manuel:

```
Node 1: Dropbox Trigger
├─ Watch for files in folder
├─ Path: /Efficience/imports
├─ Pattern: *.csv, *.xlsx
└─ Polling: 5 minutes

Node 2: Spreadsheet (lire fichier)
Node 3: Code (parser + valider)
...
```

### Ajouter une Notification Slack

```
Node 5: Slack
├─ Channel: #efficience-imports
├─ Message: "✅ {{ $json.validCount }} records importés"
```

### Ajouter un Scheduler

```
N8N: Add a regular scheduled time
├─ Daily à 22h00
├─ Rafraîchit les données
├─ Envoie rapport par email
```

---

## 🚨 Troubleshooting

### Problème: Webhook ne déclenche pas

**Solution:**
```bash
# 1. Vérifier que N8N est actif
curl http://localhost:5678/

# 2. Vérifier que le workflow est "Activate"
# Aller à http://localhost:5678

# 3. Vérifier l'URL du webhook
# Dans N8N: Node 1 → Webhook → Copy URL
```

### Problème: Données ne s'importent pas

**Solution:**
```bash
# 1. Vérifier le token d'auth
echo "N8N_WEBHOOK_TOKEN=your-token"

# 2. Vérifier la réponse de l'API
curl -X POST http://localhost:3000/api/admin/webhook-n8n \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"type":"patients","data":[]}'

# 3. Vérifier MongoDB
db.patients.countDocuments()
```

### Problème: Dashboard ne se met pas à jour

**Solution:**
```bash
# 1. Rafraîchir la page (F5)
# 2. Ouvrir Console (F12) → voir erreurs
# 3. Vérifier polling toutes les 10 secondes
# 4. Vérifier que /api/admin/recent-imports répond
```

---

## 📈 Prochaines Étapes

1. **Ajouter plus de sources de données**
   - Google Sheets
   - FTP Server
   - OneDrive

2. **Mettre en place les Schedulers**
   - Import quotidien à 22h
   - Rapport hebdo par email

3. **Intégrer Power BI**
   - Refresh automatique après import
   - Notifications Slack

4. **Sécuriser en production**
   - HTTPS obligatoire
   - JWT tokens longs
   - Rate limiting

---

## ✅ Checklist Finale

- [ ] N8N lancé et accessible (http://localhost:5678)
- [ ] Variables d'env configurées (.env.local)
- [ ] Workflow N8N créé et activé
- [ ] Bouton "Synchroniser" visible dans /admin
- [ ] Test via interface: cliquer → message succès
- [ ] Test via cURL: données importées
- [ ] MongoDB logs vérifiés (webhook_logs)
- [ ] Dashboard se rafraîchit automatiquement
- [ ] 5 collections dans MongoDB (patients, finances, etc)

---

## 🎓 Résumé Pour l'Admin

**Avant (Manuel):**
```
1. Télécharger fichier Excel
2. Aller sur /admin/import
3. Upload CSV
4. Cliquer "Importer"
5. Attendre confirmation
6. Rafraîchir dashboard manuellement
```

**Après (Automatisé):**
```
1. Cliquer bouton "Synchroniser"
2. Attendre 2 secondes
3. ✨ Dashboard à jour automatiquement
```

---

**Questions ?** Consultez le guide complet: [N8N_SETUP_EFFICIENCE_COMPLETE.md](N8N_SETUP_EFFICIENCE_COMPLETE.md)
