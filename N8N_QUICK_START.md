# ⚡ QUICK START: N8N + Efficience en 10 minutes

Suivez ce guide pour avoir le système opérationnel rapidement.

---

## 📋 Prérequis

- ✅ Node.js (v18+)
- ✅ Docker (optionnel, pour N8N)
- ✅ MongoDB (Atlas ou local)
- ✅ VS Code terminal

---

## 🟢 ÉTAPE 1: Configuration (2 min)

### 1.1 Ouvrir `.env.local`

```
c:\efficience-app-offic - Copie\.env.local
```

### 1.2 Ajouter les 3 lignes N8N

```env
N8N_WEBHOOK_TOKEN=my-secret-token-12345
N8N_TRIGGER_WEBHOOK_URL=http://localhost:5678/webhook/efficience-sync
N8N_CALLBACK_WEBHOOK_URL=http://localhost:3000/api/admin/webhook-n8n
```

**Sauvegarder (Ctrl+S)**

---

## 🟢 ÉTAPE 2: Démarrer N8N (1 min)

### Option A: Docker (Recommandé)

```powershell
docker run -it --rm -p 5678:5678 -v $env:USERPROFILE\.n8n:/home/node/.n8n n8nio/n8n
```

### Option B: NPM

```bash
npm install -g n8n
n8n start
```

**Attendre le message:** `Welcome to n8n!`

**Accédez à:** http://localhost:5678

---

## 🟢 ÉTAPE 3: Créer Workflow N8N (5 min)

### 3.1 Créer workflow

1. Aller à http://localhost:5678
2. Cliquer "New Workflow"
3. Nommer: `Efficience_Import`
4. Cliquer "Create"

### 3.2 Ajouter Node 1: Webhook

```
Click "Add Node" → Webhook
Configuration:
- Method: POST
- Path: /efficience-sync
- Response: { "status": "processing" }

Copier l'URL générée:
http://localhost:5678/webhook/efficience-sync
```

### 3.3 Ajouter Node 2: Code

```
Click "Add Node" → Code

Coller ce code:
```

```javascript
const { type, data } = items[0].json;

if (!Array.isArray(data)) {
  throw new Error('Data must be an array');
}

const requiredFields = {
  'patients': ['nom', 'prenom', 'email'],
  'finances': ['cabinetId', 'periode', 'chiffreAffaires'],
  'production': ['cabinetId', 'praticien', 'periode'],
  'appointments': ['patientNom', 'date', 'heure']
};

const required = requiredFields[type] || [];
const validatedData = data.filter(row => 
  required.every(field => field in row && row[field])
);

return [{
  json: {
    type,
    data: validatedData,
    validCount: validatedData.length,
    totalReceived: data.length
  }
}];
```

### 3.4 Ajouter Node 3: HTTP Request

```
Click "Add Node" → HTTP Request

Configuration:
- Method: POST
- URL: http://localhost:3000/api/admin/webhook-n8n

Headers tab:
- Content-Type: application/json
- Authorization: Bearer my-secret-token-12345

Body tab (toggle "Body as JSON"):
{
  "type": "{{ $json.type }}",
  "cabinetId": "cab_efficience",
  "data": "{{ $json.data }}",
  "action": "n8n-import"
}
```

### 3.5 Activer Workflow

Cliquer "Activate" (en haut à droite)

**Status:** Workflow activé ✅

---

## 🟢 ÉTAPE 4: Démarrer Efficience (1 min)

### Terminal 2:

```powershell
cd "c:\efficience-app-offic - Copie"
npm run dev
```

**Attendre:** `Ready in X.XXs`

**Accédez à:** http://localhost:3000

---

## 🟢 ÉTAPE 5: Test Rapide (1 min)

### Via Interface

1. Aller à http://localhost:3000/admin
2. Chercher "Synchronisation N8N"
3. Cliquer "Synchroniser maintenant"
4. Voir message ✅ "Synchronisation réussie"

### Via Postman/cURL

```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer my-secret-token-12345"
}

$body = @{
    "type" = "patients"
    "cabinetId" = "cab_test"
    "data" = @(
        @{"nom" = "Test"; "prenom" = "User"; "email" = "test@example.com"}
    )
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/admin/webhook-n8n" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

**Résultat attendu:**
```json
{
  "success": true,
  "message": "1 records imported successfully"
}
```

---

## ✅ Résultat Final

Si tout est bon:

✅ N8N workflow actif  
✅ Efficience dashboard visible  
✅ Bouton "Synchroniser" fonctionne  
✅ Données importées dans MongoDB  
✅ Dashboard se met à jour en temps réel  

---

## 🎯 Prochain Étape

Pour plus de détails, consulter:

1. [N8N_RESUME_FINAL.md](N8N_RESUME_FINAL.md) - Vue d'ensemble
2. [N8N_SETUP_EFFICIENCE_COMPLETE.md](N8N_SETUP_EFFICIENCE_COMPLETE.md) - Configuration complète
3. [N8N_TEST_COMPLET.md](N8N_TEST_COMPLET.md) - Tests avancés

---

## 🐛 Quick Debug

| Problème | Solution |
|----------|----------|
| "Connection refused" | N8N pas lancé? Vérifier `docker ps` |
| "401 Unauthorized" | Token incorrect dans `.env.local` |
| "Cannot POST" | Vérifier URL dans HTTP Request node |
| Aucune donnée | Vérifier MongoDB: `db.patients.count()` |

---

## 📱 Pour les Prochaines Fois

Relancer:

```powershell
# Terminal 1: N8N
docker run -it --rm -p 5678:5678 -v $env:USERPROFILE\.n8n:/home/node/.n8n n8nio/n8n

# Terminal 2: Efficience
cd "c:\efficience-app-offic - Copie"
npm run dev

# Workflow déjà activé? Juste cliquer "Synchroniser"
```

---

**C'est bon! 🚀 Vous êtes prêt à utiliser le système!**
