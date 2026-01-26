# 🚀 Configuration N8N pour Efficience - Guide Complet

## Objectif Final
✅ Bouton dans l'interface  
✅ N8N détecte fichiers CSV/Excel  
✅ Valide les données automatiquement  
✅ Importe dans MongoDB  
✅ Dashboard se met à jour en temps réel  

---

## ÉTAPE 1: Configuration des Variables d'Environnement

Ajouter à votre `.env.local`:

```env
# Webhook N8N
N8N_WEBHOOK_TOKEN=your-secret-webhook-token-here
N8N_TRIGGER_WEBHOOK_URL=http://localhost:5678/webhook/efficience-sync

# URL de rappel (où N8N envoie les données)
N8N_CALLBACK_WEBHOOK_URL=http://localhost:3000/api/admin/webhook-n8n
```

---

## ÉTAPE 2: Démarrer N8N Localement

### Option A: Via Docker (Recommandée)
```powershell
docker run -it --rm `
  -p 5678:5678 `
  -e DB_TYPE=sqlite `
  -v $env:USERPROFILE\.n8n:/home/node/.n8n `
  n8nio/n8n
```

### Option B: Via NPM
```powershell
npm install -g n8n
n8n start
```

**Accéder à:** http://localhost:5678

---

## ÉTAPE 3: Créer le Workflow N8N

### 3.1 - Créer un nouveau workflow
- Cliquer "New Workflow"
- Nom: `Efficience_Data_Import`
- Description: "Automatisation import données Efficience"

### 3.2 - Ajouter le Trigger (Déclencheur)

**Node 1: HTTP Trigger (Webhook d'entrée)**

Configuration:
- Type: Webhook
- Method: POST
- Path: `/efficience-sync`
- Response: `{ "status": "processing" }`

Cela crée un URL comme: `http://localhost:5678/webhook/efficience-sync`

**Copier cet URL dans `.env.local`:**
```env
N8N_TRIGGER_WEBHOOK_URL=http://localhost:5678/webhook/efficience-sync
```

---

## ÉTAPE 4: Ajouter les Nœuds de Traitement

### Node 2: Code - Valider Données

```
Ajouter Node → Code
```

**Code JavaScript:**
```javascript
// Valider les données reçues
const { type, data } = items[0].json;

const requiredFields = {
  'patients': ['nom', 'prenom', 'email'],
  'finances': ['cabinetId', 'periode', 'chiffreAffaires'],
  'production': ['cabinetId', 'praticien', 'periode'],
  'appointments': ['patientNom', 'date', 'heure']
};

const required = requiredFields[type] || [];

// Vérifier que les données ont les champs requis
if (!Array.isArray(data)) {
  throw new Error('Data must be an array');
}

const validatedData = data.filter(row => {
  return required.every(field => field in row && row[field]);
});

const discardedCount = data.length - validatedData.length;

return [{
  json: {
    type,
    data: validatedData,
    validCount: validatedData.length,
    discardedCount,
    totalReceived: data.length
  }
}];
```

---

### Node 3: IF - Vérifier si données valides

```
Ajouter Node → IF
```

Configuration:
- Condition: `validCount > 0`
- If: Continue (→ Node 4)
- Else: End (ou notification erreur)

---

### Node 4: HTTP Request - Envoyer à Efficience

```
Ajouter Node → HTTP Request
```

Configuration:
- **Method:** POST
- **URL:** `http://localhost:3000/api/admin/webhook-n8n`
- **Headers:**
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_SECRET_WEBHOOK_TOKEN
  ```
- **Body (mode "Body as JSON"):**
  ```json
  {
    "type": "{{ $json.type }}",
    "cabinetId": "cab_efficience",
    "data": "{{ $json.data }}",
    "action": "n8n-import"
  }
  ```

---

### Node 5: Email - Notification Succès (Optionnel)

```
Ajouter Node → Email
```

Configuration:
- To: `admin@efficience-dentaire.fr`
- Subject: `✅ Import N8N Réussi - {{ $json.type }}`
- Body:
  ```
  Hola Admin!

  L'import N8N s'est déroulé avec succès.

  Type: {{ $json.type }}
  Enregistrements: {{ $json.validCount }}
  Rejetés: {{ $json.discardedCount }}

  Timestamp: {{ now() }}
  ```

---

## ÉTAPE 5: Architecture Finale du Workflow

```
┌─────────────────────────────────┐
│   HTTP Webhook Trigger          │
│ (POST /efficience-sync)         │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│   Code Node: Validate Data      │
│ (Vérifier colonnes requises)    │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│   IF Node: validCount > 0?      │
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    │          │
   YES        NO
    │          │
    ↓          ↓
[Send to API] [End/Error]
    │
    ↓
┌─────────────────────────────────┐
│ HTTP Request: POST              │
│ /api/admin/webhook-n8n          │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│ Email: Send Notification        │
│ (Success confirmation)          │
└─────────────────────────────────┘
```

---

## ÉTAPE 6: Activer le Workflow

1. Cliquer sur "Activate" (en haut à droite)
2. Le workflow est maintenant **actif 24/7**

---

## ÉTAPE 7: Tester le Workflow

### Test 1: Via Postman ou cURL

```bash
# Windows PowerShell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer your-secret-webhook-token"
}

$body = @{
    "type" = "patients"
    "data" = @(
        @{"nom" = "Dupont"; "prenom" = "Jean"; "email" = "jean@example.com"},
        @{"nom" = "Martin"; "prenom" = "Marie"; "email" = "marie@example.com"}
    )
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5678/webhook/efficience-sync" `
  -Method POST `
  -Headers $headers `
  -Body $body
```

### Test 2: Via le bouton Efficience

1. Aller sur http://localhost:3000/admin
2. Cliquer "Synchroniser maintenant"
3. Vérifier le statut
4. Dashboard se rafraîchit ✨

---

## ÉTAPE 8: Vérifier les Logs

### Logs N8N
- http://localhost:5678/executions
- Voir l'historique d'exécution des workflows

### Logs MongoDB (Audit)
- Collection: `webhook_logs`
- Voir tous les imports effectués

### Logs Efficience
- Console du navigateur (F12)
- Terminal Node.js

---

## 🔧 Troubleshooting

### Le webhook ne déclenche pas
```
✅ Vérifier que N8N est lancé (http://localhost:5678)
✅ Vérifier que le workflow est "Activate"
✅ Vérifier l'URL du webhook dans N8N
```

### Les données ne s'importent pas
```
✅ Vérifier le token d'autorisation
✅ Vérifier les logs MongoDB (webhook_logs)
✅ Vérifier la structure JSON des données
```

### Le dashboard ne se met pas à jour
```
✅ Vérifier que le polling est activé (10 sec)
✅ Rafraîchir la page (F5)
✅ Vérifier la collection MongoDB (donnees_cabinet)
```

---

## 🎯 Cas d'Usage Complet

### Scénario: Mise à jour du CA (Chiffre d'Affaires)

1. **Admin met à jour un fichier Excel** avec les CA de janvier
2. **Upload le fichier** dans un dossier spécifique (ex: Dropbox)
3. **N8N surveille** ce dossier et détecte le nouveau fichier
4. **N8N parse** le fichier et valide les données
5. **N8N envoie** à `/api/admin/webhook-n8n` avec les nouvelles valeurs
6. **MongoDB reçoit** les nouvelles données de finances
7. **Dashboard rafraîchit** et affiche le nouveau CA ✨
8. **Admin voit** les statistiques à jour en temps réel

---

## 📋 Checklist Configuration

- [ ] Variables d'env configurées (.env.local)
- [ ] N8N lancé (http://localhost:5678)
- [ ] Workflow créé "Efficience_Data_Import"
- [ ] Node 1: HTTP Webhook Trigger
- [ ] Node 2: Code (validation)
- [ ] Node 3: IF (vérifier validCount)
- [ ] Node 4: HTTP Request (POST /webhook-n8n)
- [ ] Node 5: Email (notification)
- [ ] Workflow activé
- [ ] Test via Postman/cURL réussi
- [ ] Bouton "Synchroniser" fonctionne dans l'interface
- [ ] Dashboard se met à jour après import ✨

---

## 💡 Prochaines Étapes

1. **Ajouter trigger Dropbox** (au lieu de webhook manuel)
2. **Scheduler** (import automatique chaque jour à 22h)
3. **SMS notifications** (alerter l'admin en cas d'erreur)
4. **Slack integration** (messages dans Slack)
5. **Power BI refresh** (rafraîchir les rapports Power BI après import)
