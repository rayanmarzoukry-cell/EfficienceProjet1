# 🔗 URLs & Endpoints Rapides

## 🌐 URLs Principales

### 🔐 Authentification
```
http://localhost:3002/admin/login
├─ Email: admin@efficience-dentaire.fr
├─ Mot de passe: Efficience2026!
└─ Token TTL: 24 heures
```

### 📊 Dashboard Admin (Nouveau)
```
http://localhost:3002/admin
├─ Onglet 1: Accueil (Overview)
├─ Onglet 2: Importation (Import) ✨
├─ Onglet 3: Audit (Audit Log) ✨
└─ Onglet 4: Analyses (Analytics) ✨
```

### 📱 Dashboard Utilisateur
```
http://localhost:3002/dashboard
├─ Statistiques patients
├─ Graphiques des rendez-vous
└─ Métriques de performance
```

### 📝 Inscription
```
http://localhost:3002/register
├─ Créer un nouveau compte
└─ Mock auth ou MongoDB
```

### 🏠 Accueil
```
http://localhost:3002
└─ Page d'accueil (redirection vers /register)
```

---

## 🔌 API Endpoints

### Admin Endpoints (Protégés par JWT)

#### 📥 Import API
```
POST /api/admin/import

Headers:
├─ Content-Type: multipart/form-data
├─ Authorization: Bearer [JWT_TOKEN]
└─ Accept: application/json

Body:
├─ file: File (CSV)
├─ resourceType: string (patients|cabinets|rendezvous)
└─ adminEmail: string

Response (200 OK):
{
  "success": true,
  "successCount": 5,
  "errorCount": 0,
  "errors": [],
  "summary": "5 patients importés avec succès"
}

Response (400 Bad Request):
{
  "error": "Description de l'erreur"
}

Response (500 Internal Error):
{
  "error": "Erreur serveur..."
}
```

#### 📋 Audit API - GET
```
GET /api/admin/audit

Headers:
├─ Authorization: Bearer [JWT_TOKEN]
└─ Accept: application/json

Query Parameters:
├─ limit: Number (default: 50) - Nombre de logs
├─ action: String (optional) - Filtrer par action
└─ adminEmail: String (optional) - Filtrer par admin

Response (200 OK):
{
  "logs": [
    {
      "_id": "...",
      "adminEmail": "admin@efficience-dentaire.fr",
      "action": "import_data",
      "resource": "patients",
      "status": "success",
      "recordsAffected": 5,
      "fileInfo": {
        "fileName": "test-import.csv",
        "fileSize": 456,
        "rows": 5
      },
      "ipAddress": "192.168.100.126",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2026-01-14T10:45:23.000Z"
    }
  ],
  "total": 1,
  "limit": 50
}
```

#### 📋 Audit API - POST
```
POST /api/admin/audit

Headers:
├─ Content-Type: application/json
├─ Authorization: Bearer [JWT_TOKEN]
└─ Accept: application/json

Body:
{
  "adminEmail": "admin@efficience-dentaire.fr",
  "action": "import_data",
  "resource": "patients",
  "status": "success",
  "recordsAffected": 5,
  "details": {...},
  "fileInfo": {
    "fileName": "test.csv",
    "fileSize": 456,
    "rows": 5
  }
}

Response (201 Created):
{
  "success": true,
  "auditId": "..."
}
```

---

## 📦 Données Endpoints (Existants)

```
GET /api/patients
├─ Récupère tous les patients
└─ Response: Array de patients

GET /api/cabinets
├─ Récupère tous les cabinets
└─ Response: Array de cabinets

GET /api/rendezvous
├─ Récupère tous les rendez-vous
└─ Response: Array de rendezvous
```

---

## 🔑 Headers Requis

### Tous les endpoints `/api/admin/*`
```
Authorization: Bearer [JWT_TOKEN]
Content-Type: application/json (sauf pour upload)
Accept: application/json
```

### Obtenir un JWT Token
```
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@efficience-dentaire.fr",
  "password": "Efficience2026!"
}

Response:
{
  "token": "eyJhbGc..."
}
```

---

## 🧪 Test avec cURL

### Exemple 1: Récupérer les logs
```bash
curl -X GET "http://localhost:3002/api/admin/audit?limit=10" \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -H "Accept: application/json"
```

### Exemple 2: Créer un audit entry
```bash
curl -X POST "http://localhost:3002/api/admin/audit" \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "adminEmail": "admin@efficience-dentaire.fr",
    "action": "import_data",
    "resource": "patients",
    "status": "success",
    "recordsAffected": 5
  }'
```

### Exemple 3: Importer un fichier CSV
```bash
curl -X POST "http://localhost:3002/api/admin/import" \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -F "file=@test-import.csv" \
  -F "resourceType=patients" \
  -F "adminEmail=admin@efficience-dentaire.fr"
```

---

## 📁 Fichiers de Test

### Test Data
```
/test-import.csv
├─ 5 patients de test
├─ Format: name,email,phone,dateRDV,type,status,cabinetId
└─ Prêt pour l'importation
```

### Mock Data
```
/data/patients_list.json
/data/planning.ts
/data/production.ts
/data/rendezvous.ts
```

---

## 🗄️ MongoDB Collections

### Collections Disponibles
```
efficience.patients
├─ Contient les patients
└─ Indexed: email

efficience.cabinets
├─ Contient les cabinets
└─ Indexed: nom

efficience.rendezvous
├─ Contient les rendez-vous
└─ Indexed: patientId, cabinetId

efficience.audit_logs ✨ NEW
├─ Contient le journal d'audit
├─ Indexed: (adminEmail, timestamp)
└─ Indexed: (action, timestamp)

efficience.admins
├─ Contient les administrateurs
└─ Indexed: email
```

---

## 🔐 Authentification Flow

### 1. Login
```
POST /api/admin/login
{
  "email": "admin@efficience-dentaire.fr",
  "password": "Efficience2026!"
}
↓
Response: { "token": "eyJhbGc..." }
↓
Store in localStorage: "adminToken"
```

### 2. Use Token
```
Every request to /api/admin/*:
Header: Authorization: Bearer [token]
↓
Server verifies JWT
↓
Token valid → Process request
Token invalid → Return 401 Unauthorized
```

### 3. Token Expiration
```
Token TTL: 24 hours
After 24h: Token expires
Action: User must login again
```

---

## 🚨 Error Codes

```
200 OK
├─ Request successful
└─ Response: Data or confirmation

201 Created
├─ Resource created successfully
└─ Response: Created resource data

400 Bad Request
├─ Invalid input or format
└─ Response: Error message describing issue

401 Unauthorized
├─ Missing or invalid JWT token
└─ Response: "Unauthorized"

403 Forbidden
├─ Token valid but not authorized
└─ Response: "Forbidden"

404 Not Found
├─ Endpoint doesn't exist
└─ Response: "Not Found"

500 Internal Server Error
├─ Server error occurred
└─ Response: Error message
```

---

## 📊 Statut Check

### Health Check (Non implémenté)
```
GET /api/health
Response: { "status": "ok", "database": "connected" }
```

### Admin Status (Dans le dashboard)
```
Accueil tab:
├─ État du serveur: 🟢 EN LIGNE
├─ Base de données: 🟢 CONNECTÉE
└─ Dernière mise à jour: [timestamp]
```

---

## 🔔 Notifications & Events

### Import Notification
```
Après un import réussi:
├─ UI: Affiche "X enregistrements importés"
├─ Audit: Crée automatiquement un log
└─ Database: Ajoute les données
```

### Error Notification
```
En cas d'erreur:
├─ UI: Affiche le message d'erreur détaillé
├─ Audit: Crée un log avec status "error"
├─ Database: Rejette les données invalides
└─ Console: Logs serveur détaillés
```

---

## 🎯 Workflow Rapide

### Pour un administrateur

```
1. Se connecter
   POST /api/admin/login
   ↓
2. Obtenir le token
   {"token": "..."}
   ↓
3. Accéder au dashboard
   http://localhost:3002/admin
   ↓
4. Importer des données
   POST /api/admin/import (avec token)
   ↓
5. Vérifier l'audit
   GET /api/admin/audit (avec token)
   ↓
6. Voir les résultats
   Dashboard analytics & audit log
```

---

## 📚 Documentation par Feature

### Import Feature
```
Documentation: ADMIN_FEATURES_GUIDE.md → Importer des données
Code: components/admin/admin-import.tsx
API: app/api/admin/import/route.ts
Test: test-import.csv
```

### Audit Feature
```
Documentation: ADMIN_FEATURES_GUIDE.md → Journal d'Audit
Code: components/admin/audit-log.tsx
API: app/api/admin/audit/route.ts
Model: models/AuditLog.ts
```

### Analytics Feature
```
Documentation: ADMIN_FEATURES_GUIDE.md → Analyses Power BI
Code: components/admin/admin-analytics.tsx
Setup: 6 étapes dans l'onglet Analyses
Config: MongoDB connection details
```

---

## 🔗 Quick Links Summary

| Page | URL | Purpose |
|------|-----|---------|
| Admin Login | http://localhost:3002/admin/login | Authentification |
| Admin Dashboard | http://localhost:3002/admin | Interface principale |
| User Dashboard | http://localhost:3002/dashboard | Statistiques utilisateur |
| Register | http://localhost:3002/register | Inscription |
| Home | http://localhost:3002 | Accueil (redirect) |

---

## 🎊 Status

```
✅ Tous les endpoints actifs
✅ JWT authentication fonctionnel
✅ MongoDB connections établies
✅ Audit logging opérationnel
✅ Import feature prête
✅ Analytics setup ready
```

---

**Dernière mise à jour**: 2026-01-14  
**Version**: 1.0  
**Status**: ✅ **OPERATIONAL**
