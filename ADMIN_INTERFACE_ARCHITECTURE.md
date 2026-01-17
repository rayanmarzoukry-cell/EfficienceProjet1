# Architecture Admin vs User - Efficience Analytics

## 🎯 Résumé Exécutif

L'application **Efficience Analytics** a une architecture à **deux interfaces complètement différentes** :

| Aspect | USER (Cabinet Dentaire) | ADMIN (Administrateur Plateforme) |
|--------|------------------------|-------------------------------|
| **Rôle** | Gère son cabinet dentaire | Gère toute la plateforme |
| **Authentification** | Email + mot de passe | Email + mot de passe (rôle admin) |
| **Dashboard** | Statistiques du cabinet personnel | KPIs système, utilisateurs, cabinets |
| **Données visibles** | Ses propres patients & finances | Tous les cabinets, tous les patients |
| **Actions possibles** | Analyse, rapports, gestion patients | Gérer utilisateurs, importer données, configuration |
| **Accès URL** | `/dashboard/*`, `/patients/*`, `/rapports/*` | `/admin/dashboard/*` |

---

## 📁 Architecture Fichiers

### **INTERFACE USER (Cabinet)**

```
app/
├── dashboard/
│   └── page.tsx                 ← Dashboard personnel du cabinet
├── patients/
│   ├── page.tsx                 ← Liste patients
│   └── [id]/page.tsx            ← Détail patient
├── rapports/
│   └── page.tsx                 ← Rapports financiers
├── consultations/
│   └── page.tsx                 ← Gestion consultations
├── analyses/
│   └── page.tsx                 ← Analyses cabinet
└── settings/
    └── page.tsx                 ← Paramètres personnels

components/
├── sidebar.tsx                  ← Navigation USER (bleu)
└── ui/
    ├── card.tsx
    ├── button.tsx
    └── ...autres composants
```

### **INTERFACE ADMIN (Plateforme)**

```
app/admin/
├── dashboard/
│   └── page.tsx                 ← Dashboard administrateur
├── users/
│   ├── page.tsx                 ← Gestion utilisateurs (CRUD)
│   └── [id]/
│       ├── edit/page.tsx        ← Éditer utilisateur
│       └── delete/page.tsx      ← Supprimer utilisateur
├── cabinets/
│   ├── page.tsx                 ← Lister & gérer tous les cabinets
│   └── [id]/page.tsx            ← Détails cabinet
├── import/
│   └── page.tsx                 ← Importer fichiers (N8N integration)
├── configuration/
│   └── page.tsx                 ← Paramètres système
└── system/
    └── page.tsx                 ← Logs, monitoring, santé système

components/
├── admin-sidebar.tsx            ← Navigation ADMIN (rouge)
└── ...autres composants admin
```

---

## 🔐 Authentification & Rôles

### **Utilisateurs dans MongoDB:**

```json
{
  "_id": ObjectId("..."),
  "email": "user@efficience-dentaire.fr",
  "name": "Jean Dupont",
  "password": "$2b$10$...bcrypt_hash...",  // JAMAIS stocké en clair
  "role": "user",                          // "user" ou "admin"
  "cabinet": "Cabinet Dentaire A",         // Pour les users
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "lastLogin": "2024-01-20T14:45:00Z"
}
```

### **Deux utilisateurs de démo:**

```
📧 admin@efficience-dentaire.fr
🔑 admin123
✨ Rôle: ADMIN → Accès /admin/*

📧 user@efficience-dentaire.fr
🔑 user123
✨ Rôle: USER → Accès /dashboard/*
```

---

## 🎨 Différences Visuelles

### **Sidebar USER (Bleu - Themes primaire)**
```
Dashboard général
  Analyses
    Gestion clients
      Rapports
        Consultations
          PATIENTS
            RÉGLAGES
```
**Couleur primaire:** #3b82f6 (Bleu)
**Icône:** Utilisateur
**Contexte:** Gestion du cabinet personnel

### **Sidebar ADMIN (Rouge - Thème danger)**
```
🛡️ Dashboard Admin
   Gestion Utilisateurs
   Gestion Cabinets
   Import Fichiers (+ N8N)
   Configuration
   Système & Logs
```
**Couleur primaire:** #dc2626 (Rouge)
**Icône:** Shield
**Contexte:** Gestion de la plateforme entière

---

## 📊 Flux d'Authentification

```mermaid
[Utilisateur]
    ↓
[Page /login]
    ↓
[Saisi Email + Password]
    ↓
[POST /api/auth/login]
    ├─→ [Valide format email]
    ├─→ [Cherche utilisateur dans MongoDB]
    ├─→ [Compare password via bcrypt]
    └─→ Si ERREUR: "Identifiants invalides"
    ↓
[Génère JWT Token (30 jours)]
    ↓
[Stocke token en localStorage]
    ├─→ auth_token
    └─→ user_role ("admin" ou "user")
    ↓
[Redirection basée sur le rôle]
    ├─→ Si role="admin" → /admin/dashboard
    ├─→ Si role="user" → /dashboard
    └─→ Refresh token à chaque rechargement
    ↓
[Page chargée avec AdminSidebar ou UserSidebar]
```

---

## 🔄 Flux de Routing

### **Protection des Routes (middleware.ts)**

```typescript
// Routes protégées - Nécessitent auth_token
/dashboard/*        ← USER seulement
/admin/*           ← ADMIN seulement (à implémenter)
/patients/*        ← USER seulement
/rapports/*        ← USER seulement
/consultations/*   ← USER seulement
/analyses/*        ← USER seulement
/settings/*        ← USER seulement

// Routes publiques - Sans authentification
/login
/register
/
```

### **Redirection intelligente:**

```tsx
// Cas 1: Utilisateur non authentifié
/dashboard → /login

// Cas 2: Admin accède /dashboard (user route)
Redirection vers /admin/dashboard

// Cas 3: User accède /admin/* (admin route)
Redirection vers /dashboard avec erreur
```

---

## 📈 Données Visibles

### **USER voit:**
```
✅ Son propre cabinet
✅ Ses propres patients
✅ Ses propres rapports
✅ Ses statistiques uniquement
❌ Les autres cabinets
❌ Les autres utilisateurs
❌ Configuration système
```

### **ADMIN voit:**
```
✅ Tous les cabinets
✅ Tous les patients
✅ Tous les utilisateurs
✅ Tous les rapports
✅ Configuration système
✅ Logs et monitoring
✅ Statistiques globales
```

---

## 🚀 Pages Existantes vs À Créer

### **Pages USER (Existantes/En cours):**
- ✅ `/dashboard/page.tsx` - Dashboard personnel
- ✅ `/patients/page.tsx` - Gestion patients
- ✅ `/rapports/page.tsx` - Rapports financiers
- ✅ `/consultations/page.tsx` - Consultations
- ✅ `/analyses/page.tsx` - Analyses cabinet
- ✅ `/settings/page.tsx` - Paramètres

### **Pages ADMIN (Nouvelles - À créer):**
- ✅ `/admin/dashboard/page.tsx` - Dashboard admin (CRÉÉ)
- ✅ `/admin/cabinets/page.tsx` - Gestion cabinets (CRÉÉ)
- ✅ `/admin/import/page.tsx` - Import fichiers + N8N (CRÉÉ)
- ⏳ `/admin/users/page.tsx` - Gestion utilisateurs (API existe)
- ⏳ `/admin/configuration/page.tsx` - Configuration système
- ⏳ `/admin/system/page.tsx` - Logs et monitoring

---

## 🔌 Intégration N8N (Automatisation)

### **Objectif:**
Automatiser l'import de fichiers CSV/Excel sans intervention manuelle

### **Flux N8N:**
```
[Fichier dans Dropbox/Drive/FTP]
    ↓
[N8N surveille le dossier]
    ↓
[Nouveau fichier détecté]
    ↓
[N8N parse le fichier CSV/Excel]
    ↓
[N8N valide les colonnes requises]
    ↓
[N8N appelle le webhook Efficience]
    POST /api/admin/import
    {
      "type": "patients|finances|production",
      "data": [...rows...]
    }
    ↓
[Backend insère dans MongoDB]
    ↓
[N8N reçoit confirmation de succès]
    ↓
[Fichier archivé ou supprimé]
```

### **Webhook Endpoint:**
```
POST /api/admin/import
Content-Type: application/json

{
  "type": "patients",
  "cabinetId": "cabinet_001",
  "data": [
    {"nom": "Dupont", "prenom": "Jean", "email": "jean@example.com"},
    {"nom": "Martin", "prenom": "Marie", "email": "marie@example.com"}
  ]
}

Response:
{
  "success": true,
  "imported": 2,
  "errors": 0,
  "message": "2 patients importés avec succès"
}
```

### **Configuration N8N Exemple:**
```json
{
  "nodes": [
    {
      "name": "Surveiller dossier",
      "type": "dropbox",
      "folder": "/Efficience/imports",
      "pattern": "*.csv|*.xlsx"
    },
    {
      "name": "Parser fichier",
      "type": "spreadsheet",
      "action": "readFile"
    },
    {
      "name": "Webhook Efficience",
      "type": "http",
      "method": "POST",
      "url": "https://efficience.app/api/admin/import",
      "auth": "Bearer <WEBHOOK_TOKEN>"
    }
  ]
}
```

---

## 🛡️ Sécurité

### **Mesures implémentées:**

1. **Passwords:**
   - ✅ Hash bcrypt (10 rounds)
   - ✅ Jamais stocké en clair
   - ✅ Validation forte (min 6 chars)

2. **Tokens:**
   - ✅ JWT avec expiration 30 jours
   - ✅ Stocké en localStorage
   - ✅ Validation sur chaque requête

3. **Routes:**
   - ✅ Middleware pour protection
   - ✅ Vérification du rôle
   - ✅ Redirection non-autorisés

4. **API:**
   - ✅ Endpoints protégés
   - ✅ Validation input
   - ✅ Rate limiting (à ajouter)

### **À ajouter:**
- ⏳ HTTPS seulement
- ⏳ CSRF protection
- ⏳ Rate limiting par IP
- ⏳ Audit logs pour actions admin
- ⏳ MFA (2FA) optionnel

---

## 📝 Procédure Création Admin

### **Via l'interface:**

1. Accéder `/setup`
2. Créer premier admin
3. Admin peut créer d'autres users via `/admin/users`

### **Via MongoDB directly:**
```javascript
db.users.insertOne({
  email: "nouveau@admin.fr",
  name: "Nouveau Admin",
  password: "$2b$10$...bcrypt_hash...",
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

---

## 🎯 Prochaines Étapes

### **Phase 1 (Actuellement):**
- ✅ Interfaces admin/user séparées
- ✅ Dashboard admin avec stats
- ✅ Gestion cabinets admin
- ✅ Page import + explication N8N

### **Phase 2 (À faire):**
- ⏳ Page gestion utilisateurs avec API existante
- ⏳ Page configuration système
- ⏳ Page logs & monitoring
- ⏳ Mettre en place webhook /api/admin/import

### **Phase 3 (Future):**
- ⏳ Configuration N8N en production
- ⏳ Tests automatisés import
- ⏳ MFA et sécurité avancée
- ⏳ Analytics système détaillées

---

## 📚 Fichiers de Référence

| Fichier | Rôle |
|---------|------|
| `app/login/page.tsx` | Authentification |
| `app/api/auth/login/route.ts` | Validation identifiants |
| `lib/auth-utils.ts` | Fonctions bcrypt/JWT |
| `middleware.ts` | Protection routes |
| `context/AppContext.tsx` | État global (à mettre à jour) |
| `components/sidebar.tsx` | Navigation USER |
| `components/admin-sidebar.tsx` | Navigation ADMIN |
| `app/admin/dashboard/page.tsx` | Dashboard admin |
| `app/admin/cabinets/page.tsx` | Gestion cabinets |
| `app/admin/import/page.tsx` | Import + N8N |

---

## 🎓 Résumé pour le Developer

> **L'utilisateur voit son petit monde (son cabinet)**
> 
> **L'admin voit le monde entier (toute la plateforme)**

C'est une architecture classique SaaS multi-tenant où:
- Les **users** sont des gérants de cabinet
- L'**admin** est le gérant de la plateforme
- Les données sont isolées par cabinet sauf pour l'admin

Tous les composants sont prêts. Le `middleware.ts` permet la protection des routes, les sidebars sont séparées, et les pages admin existent. Il suffit de vérifier que le rôle est bien utilisé lors du login.
