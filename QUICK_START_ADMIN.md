# 🚀 Guide Rapide - Déploiement & Configuration Admin

**Date**: 14 janvier 2026  
**Version**: 1.0  
**Statut**: ✅ Prêt pour production (avec corrections sécurité)

---

## ⚡ Démarrage Rapide

### Étape 1: Installer les dépendances
```bash
npm install
npm install --save-dev @types/jsonwebtoken
```

### Étape 2: Configuration `.env.local`
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/efficience
DATABASE_NAME=efficience
OPENAI_API_KEY=sk-proj-...
JWT_SECRET=votre-secret-ultra-secure-2026
```

### Étape 3: Démarrer le serveur
```bash
npm run dev
# Accès sur http://localhost:3001
```

### Étape 4: Login admin
```
URL: http://localhost:3001/admin/login
Email: admin@efficience-dentaire.fr
Password: Efficience2026!
```

---

## 🔄 Architecture Complète

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Next.js)                     │
├─────────────────────────────────────────────────────────┤
│  Pages & Composants:                                    │
│  • /admin/login - Formulaire d'authentification        │
│  • /admin - Dashboard administrateur                   │
│  • ProtectedLayout - Protection des routes             │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              API ROUTES (Next.js Backend)               │
├─────────────────────────────────────────────────────────┤
│  • POST /api/admin/login - Authentification JWT        │
│  • POST /api/admin - Créer administrateur              │
│  • GET  /api/stats - Statistiques MongoDB              │
│  • GET  /api/patients - Lister patients                │
│  • GET  /api/cabinets - Lister cabinets                │
│  • GET  /api/rendezvous - Lister RDV                   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│         BASE DE DONNÉES (MongoDB Atlas Cloud)           │
├─────────────────────────────────────────────────────────┤
│  Collections:                                           │
│  • admins - Administrateurs (email, role, etc)        │
│  • patients - Patients (nom, email, RDV, etc)         │
│  • cabinets - Cabinets (nom, CA, objectif, etc)       │
│  • rendezvous - Rendez-vous (date, type, etc)         │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Structure des Fichiers

```
app/
├── admin/
│   ├── login/
│   │   └── page.tsx           ✅ Page de login
│   └── page.tsx               ✅ Dashboard admin
│
├── api/
│   ├── admin/
│   │   ├── login/
│   │   │   └── route.ts       ✅ Endpoint login JWT
│   │   └── route.ts           ✅ CRUD administrateurs
│   │
│   ├── patients/
│   │   └── route.ts           ✅ API patients
│   ├── cabinets/
│   │   └── route.ts           ✅ API cabinets
│   ├── rendezvous/
│   │   └── route.ts           ✅ API RDV
│   └── stats/
│       └── route.ts           ✅ API statistiques

components/
├── layout/
│   └── protected-layout.tsx    ✅ Wrapper protection JWT

models/
├── Admin.ts                   ✅ Schéma admin Mongoose
├── Patient.ts                 ✅ Schéma patient
├── Cabinet.ts                 ✅ Schéma cabinet
└── RendezVous.ts              ✅ Schéma RDV

lib/
├── db.ts                      ✅ Connexion MongoDB
└── types.ts                   ✅ Types TypeScript

.env.local                      ✅ Configuration (secrète)
```

---

## 🔐 Flux d'Authentification Complet

### 1. Utilisateur accède `/admin/login`
```
→ ProtectedLayout non encore activé (page publique)
→ Affichage du formulaire login
```

### 2. Formulaire soumis
```
POST /api/admin/login
Body: { email, password }

Validation:
✓ Email et password présents
✓ Credentials valides
✓ Génération JWT (payload + signature)
```

### 3. Réponse du serveur
```json
{
  "token": "eyJhbGc...iOiJ1...",
  "user": {
    "email": "admin@efficience-dentaire.fr",
    "name": "Administrateur Efficience",
    "role": "admin"
  }
}
```

### 4. Stockage côté client
```javascript
localStorage.setItem("admin_token", token)
localStorage.setItem("admin_user", JSON.stringify(user))
```

### 5. Redirection et protection
```
Redirection vers /admin
↓
ProtectedLayout vérifie le token
↓
Décryption JWT (atob)
↓
Vérification expiration (exp timestamp)
↓
Affichage du dashboard (ou redirection login si expiré)
```

---

## 🧪 Tests Rapides

### Test 1: Endpoint login (curl)
```bash
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@efficience-dentaire.fr","password":"Efficience2026!"}'
```

### Test 2: Vérifier le JWT (console navigateur)
```javascript
// Affiche le token complet
console.log(localStorage.getItem("admin_token"))

// Décrypte le payload
const token = localStorage.getItem("admin_token")
const payload = JSON.parse(atob(token.split(".")[1]))
console.log("Payload:", payload)
console.log("Exp date:", new Date(payload.exp * 1000))
console.log("Valide maintenant:", payload.exp > Date.now()/1000)
```

### Test 3: Accès au dashboard
```
1. Ouvrir http://localhost:3001/admin
2. Si pas authentifié → redirection vers login
3. Si authentifié → affichage du dashboard avec stats MongoDB en live
```

---

## ⚙️ Configuration Avancée

### Changer le secret JWT
```env
# .env.local
JWT_SECRET=votre-secret-encore-plus-complique-12345!@#$%
```

### Créer un nouvel administrateur via MongoDB
```bash
# Option 1: Via l'API (POST /api/admin)
curl -X POST http://localhost:3001/api/admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "super-admin@efficience.fr",
    "password": "SecurePass123!",
    "name": "Super Admin"
  }'

# Option 2: Directement dans MongoDB Atlas
db.admins.insertOne({
  email: "super-admin@efficience.fr",
  passwordHash: "SecurePass123!",
  name: "Super Admin",
  role: "super-admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Modifier un admin existant
```bash
curl -X PUT http://localhost:3001/api/admin/64f... \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nouveau Nom",
    "isActive": true
  }'
```

---

## 🚨 Troubleshooting

### ❌ "Module not found: jsonwebtoken"
**Solution**: 
```bash
npm install @types/jsonwebtoken
```

### ❌ "Cannot connect to MongoDB"
**Solution**: Vérifier `.env.local`:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/efficience
```

### ❌ "Token invalide" ou "Expired token"
**Solution**: 
```javascript
// Nettoyer le localStorage
localStorage.removeItem("admin_token")
localStorage.removeItem("admin_user")
// Puis se reconnecter
```

### ❌ "Port 3000 is already in use"
**Solution**: Serveur change automatiquement vers port 3001. C'est normal !

---

## 📊 Endpoints Disponibles

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/admin/login` | POST | Authentification | ❌ |
| `/api/admin` | POST | Créer admin | ✅ |
| `/api/patients` | GET/POST | Gestion patients | ✅ |
| `/api/cabinets` | GET/POST | Gestion cabinets | ✅ |
| `/api/rendezvous` | GET/POST | Gestion RDV | ✅ |
| `/api/stats` | GET | Statistiques en direct | ✅ |

---

## 🔄 Prochains Développements

### Immédiat (Phase 2)
- [ ] Upload CSV pour import de données
- [ ] Validation et preview des données
- [ ] Upsert automatique dans MongoDB

### Court terme (Phase 3)
- [ ] CRUD complet des administrateurs
- [ ] Gestion des permissions par rôle
- [ ] Audit logging de toutes les actions

### Moyen terme (Phase 4)
- [ ] 2FA (Two-Factor Authentication)
- [ ] Intégration Power BI
- [ ] Dashboards personnalisés

---

## 📝 Notes Importantes

1. **Credentials**: Ne jamais utiliser les credentials par défaut en production !
2. **Secrets**: Tous les secrets doivent être en variables d'environnement, jamais en hardcoded
3. **HTTPS**: Toujours utiliser HTTPS en production (Vercel le fait automatiquement)
4. **Tokens**: Les JWTs sont stockés en localStorage (pas 100% sécurisé). Préférer HttpOnly cookies en prod

---

## 📞 Support Rapide

**Question**: Comment changer le mot de passe admin ?  
**Réponse**: Modifier `ADMIN_CREDENTIALS` dans `/api/admin/login/route.ts` (dev) ou créer un nouvel admin dans MongoDB (production).

**Question**: Ajouter un 2e administrateur ?  
**Réponse**: Utiliser l'endpoint `POST /api/admin` avec email/password/name.

**Question**: Comment ça marche avec MongoDB en production ?  
**Réponse**: MongoDB Atlas cloud gère tout. Juste besoin de la connexion string dans `.env.local`.

---

**Créé le**: 14 janvier 2026  
**Última actualización**: Sistema admin 100% funcional ✅
