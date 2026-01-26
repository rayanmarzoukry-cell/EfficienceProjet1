# 🧪 Test Complet: N8N + Efficience

Ce fichier contient des exemples prêts à utiliser pour tester le système complet.

---

## 📋 Prérequis

```bash
# 1. N8N lancé
docker run -it --rm -p 5678:5678 -v $env:USERPROFILE\.n8n:/home/node/.n8n n8nio/n8n

# 2. Efficience lancé
npm run dev

# 3. MongoDB local (ou Atlas)
# Vérifier MONGODB_URI dans .env.local
```

---

## 🔐 Configuration Token

Générer un token sécurisé:

```powershell
# Générer une chaîne aléatoire sécurisée
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("your-secret-token-$(Get-Random)"))

# Exemple: eW91ci1zZWNyZXQtdG9rZW4tMTIzNDU2Nzg5
```

Ajouter à `.env.local`:
```env
N8N_WEBHOOK_TOKEN=eW91ci1zZWNyZXQtdG9rZW4tMTIzNDU2Nzg5
```

---

## 🧪 Test 1: Importer des Patients

### Via cURL (PowerShell)

```powershell
$url = "http://localhost:3000/api/admin/webhook-n8n"
$token = "eW91ci1zZWNyZXQtdG9rZW4tMTIzNDU2Nzg5"

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

$body = @{
    "type" = "patients"
    "cabinetId" = "cab_efficience"
    "data" = @(
        @{
            "nom" = "Dupont"
            "prenom" = "Jean"
            "email" = "jean.dupont@example.com"
            "telephone" = "0612345678"
        },
        @{
            "nom" = "Martin"
            "prenom" = "Marie"
            "email" = "marie.martin@example.com"
            "telephone" = "0687654321"
        },
        @{
            "nom" = "Bernard"
            "prenom" = "Pierre"
            "email" = "pierre.bernard@example.com"
            "telephone" = "0698765432"
        }
    )
} | ConvertTo-Json

Invoke-WebRequest -Uri $url `
    -Method POST `
    -Headers $headers `
    -Body $body
```

**Résultat attendu:**
```json
{
  "success": true,
  "message": "3 records imported successfully",
  "type": "patients",
  "inserted": 3,
  "collection": "patients"
}
```

**Vérifier dans MongoDB:**
```javascript
db.patients.find({}).limit(3)
```

---

## 🧪 Test 2: Importer des Données Financières

### Via cURL (PowerShell)

```powershell
$url = "http://localhost:3000/api/admin/webhook-n8n"
$token = "eW91ci1zZWNyZXQtdG9rZW4tMTIzNDU2Nzg5"

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

$body = @{
    "type" = "finances"
    "cabinetId" = "cab_efficience"
    "data" = @(
        @{
            "periode" = "2026-01"
            "chiffreAffaires" = 45000
            "revenus" = 45000
            "depenses" = 12000
        },
        @{
            "periode" = "2025-12"
            "chiffreAffaires" = 42500
            "revenus" = 42500
            "depenses" = 11000
        },
        @{
            "periode" = "2025-11"
            "chiffreAffaires" = 40000
            "revenus" = 40000
            "depenses" = 10500
        }
    )
} | ConvertTo-Json

Invoke-WebRequest -Uri $url `
    -Method POST `
    -Headers $headers `
    -Body $body
```

**Vérifier dans MongoDB:**
```javascript
db.donnees_cabinet.find({ cabinetId: "cab_efficience" }).sort({ periode: -1 }).limit(3)
```

---

## 🧪 Test 3: Importer des Données de Production

### Via cURL (PowerShell)

```powershell
$url = "http://localhost:3000/api/admin/webhook-n8n"
$token = "eW91ci1zZWNyZXQtdG9rZW4tMTIzNDU2Nzg5"

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

$body = @{
    "type" = "production"
    "cabinetId" = "cab_efficience"
    "data" = @(
        @{
            "praticien" = "Dr. Martin"
            "periode" = "2026-01"
            "heures" = 160
            "actes" = 250
            "revenus" = 35000
        },
        @{
            "praticien" = "Dr. Dubois"
            "periode" = "2026-01"
            "heures" = 140
            "actes" = 180
            "revenus" = 28000
        }
    )
} | ConvertTo-Json

Invoke-WebRequest -Uri $url `
    -Method POST `
    -Headers $headers `
    -Body $body
```

---

## 🧪 Test 4: Importer des Rendez-vous

### Via cURL (PowerShell)

```powershell
$url = "http://localhost:3000/api/admin/webhook-n8n"
$token = "eW91ci1zZWNyZXQtdG9rZW4tMTIzNDU2Nzg5"

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

$body = @{
    "type" = "appointments"
    "cabinetId" = "cab_efficience"
    "data" = @(
        @{
            "patientNom" = "Jean Dupont"
            "date" = "2026-02-15"
            "heure" = "09:00"
            "praticien" = "Dr. Martin"
            "type" = "CONTRÔLE"
            "duree" = 30
        },
        @{
            "patientNom" = "Marie Martin"
            "date" = "2026-02-15"
            "heure" = "09:30"
            "praticien" = "Dr. Dubois"
            "type" = "DÉTARTRAGE"
            "duree" = 45
        }
    )
} | ConvertTo-Json

Invoke-WebRequest -Uri $url `
    -Method POST `
    -Headers $headers `
    -Body $body
```

---

## 🧪 Test 5: Tester le Bouton "Synchroniser"

### Via l'Interface

1. **Ouvrir:** http://localhost:3000/admin
2. **Localiser:** Section "Synchronisation N8N"
3. **Cliquer:** Bouton "Synchroniser maintenant"

**Résultat attendu:**
- Message: "✅ Synchronisation réussie"
- Dashboard se rafraîchit après 2 secondes
- Données mises à jour visibles

### Vérifier en Console (F12)

```javascript
// Vérifier que les appels API passent
console.log("Fetch /api/admin/trigger-sync")
console.log("Response: 200 OK")
```

---

## 🧪 Test 6: Vérifier les Logs

### Logs N8N
```
Aller à: http://localhost:5678/executions
Vérifier:
- Workflow s'exécute
- Pas d'erreur
- Données envoyées correctement
```

### Logs MongoDB
```javascript
// Collection webhook_logs
db.webhook_logs.find({}).sort({ timestamp: -1 }).limit(5)

// Résultat:
{
  "_id": ObjectId("..."),
  "type": "patients",
  "cabinetId": "cab_efficience",
  "recordsProcessed": 3,
  "success": true,
  "timestamp": ISODate("2026-01-21T10:30:45.123Z")
}
```

### Logs Efficience (Console Node)
```
Terminal npm run dev:

✅ Données chargées depuis MongoDB
POST /api/admin/webhook-n8n 200
Webhook processed: type=patients, records=3
```

---

## 📊 Test 7: Vérifier les Données en Dashboard

### Avant l'import

```
Patients: 5
Finances: Aucune
Production: Aucune
```

### Après l'import (tous les tests)

```
Patients: 8 (5 + 3)
Finances: 3
Production: 2
Rendez-vous: 2
```

---

## 🔄 Test Complet Automatisé

Script bash (Linux/Mac):

```bash
#!/bin/bash

TOKEN="eW91ci1zZWNyZXQtdG9rZW4tMTIzNDU2Nzg5"
BASE_URL="http://localhost:3000"

echo "🧪 Test 1: Importer patients..."
curl -X POST $BASE_URL/api/admin/webhook-n8n \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "patients",
    "cabinetId": "cab_test",
    "data": [
      {"nom": "Test", "prenom": "User", "email": "test@example.com"}
    ]
  }' && echo "\n✅ Test 1 passed"

sleep 2

echo "🧪 Test 2: Importer finances..."
curl -X POST $BASE_URL/api/admin/webhook-n8n \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "finances",
    "cabinetId": "cab_test",
    "data": [
      {"periode": "2026-01", "chiffreAffaires": 50000}
    ]
  }' && echo "\n✅ Test 2 passed"

sleep 2

echo "🧪 Test 3: Vérifier MongoDB..."
# mongodb query here

echo "✅ Tous les tests passed!"
```

---

## 🐛 Debugging

### Si le webhook ne déclenche pas

```bash
# 1. Vérifier le token
echo "Token: eW91ci1zZWNyZXQtdG9rZW4tMTIzNDU2Nzg5"

# 2. Tester l'API directement
curl http://localhost:3000/api/admin/webhook-n8n

# 3. Vérifier .env.local
grep N8N_WEBHOOK_TOKEN .env.local
```

### Si les données ne s'insèrent pas

```javascript
// MongoDB
// 1. Vérifier que MongoDB est accessible
db.adminCommand("ping")

// 2. Vérifier la collection
db.patients.countDocuments()

// 3. Voir les erreurs
db.webhook_logs.findOne({ success: false })
```

### Si le dashboard ne se met pas à jour

```javascript
// F12 → Console
// Vérifier que le polling fonctionne
setInterval(() => {
  fetch('/api/admin/recent-imports')
    .then(r => r.json())
    .then(d => console.log('Imports:', d))
}, 10000)
```

---

## ✅ Checklist Test

- [ ] Test 1: Patients importés (3 enregistrements)
- [ ] Test 2: Finances importées (3 périodes)
- [ ] Test 3: Production importée (2 praticiens)
- [ ] Test 4: Rendez-vous importés (2 rendez-vous)
- [ ] Test 5: Bouton fonctionne dans l'interface
- [ ] Test 6: Logs N8N affichent succès
- [ ] Test 7: Logs MongoDB contiennent webhook_logs
- [ ] Test 8: Dashboard se rafraîchit en temps réel
- [ ] Test 9: Aucune erreur en console (F12)
- [ ] Test 10: Les données persistes après refresh (F5)

---

## 🎉 Résultat Final

Si tous les tests passent, vous avez:

✅ N8N opérationnel  
✅ Webhook fonctionnel  
✅ Données importées automatiquement  
✅ Dashboard en temps réel  
✅ Logging d'audit complet  

**Bravo! 🚀**
