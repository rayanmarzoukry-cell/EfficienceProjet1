# Guide d'Intégration Admin - Efficience Analytics

## 📋 Vue d'ensemble

Ce guide explique comment utiliser le système complet d'authentification admin et de gestion des utilisateurs intégré à Efficience Analytics.

### ✅ Fonctionnalités Implémentées

1. **Authentification Admin Sécurisée**
   - Login/logout avec JWT
   - Tokens HTTP-only cookies
   - Hashage bcryptjs des mots de passe
   - Validation des emails et mots de passe

2. **Gestion Complète des Utilisateurs**
   - Créer de nouveaux utilisateurs
   - Modifier les utilisateurs (statut, rôle, cabinet)
   - Supprimer les utilisateurs
   - Réinitialiser les mots de passe

3. **Sécurité**
   - Mots de passe temporaires générés aléatoirement
   - Hashage avec salt (10 rounds)
   - Authentification avec JWT
   - Middleware de vérification d'accès
   - Protection contre la suppression du dernier admin

4. **Interface Intuitive**
   - Dashboard admin moderne
   - Tableau de bord avec recherche
   - Modales pour créer/réinitialiser mots de passe
   - Messages d'erreur et de succès

---

## 🚀 Installation et Configuration

### 1. Variables d'Environnement

Créez ou modifiez le fichier `.env.local` à la racine du projet:

```env
# Admin Authentication
NEXT_PUBLIC_ADMIN_PATH=/admin/login
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
INIT_SECRET_KEY=your-init-secret-key-change-this

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/efficience
DATABASE_NAME=efficience

# OpenAI (optionnel)
OPENAI_API_KEY=sk-proj-your-key-here

# Environment
NODE_ENV=development
```

**⚠️ IMPORTANT:**
- Générez des clés secrètes fortes pour `JWT_SECRET` et `INIT_SECRET_KEY`
- Ne commitez JAMAIS le fichier `.env.local` dans git
- Changez les valeurs en production

### 2. Installation des Dépendances

Les dépendances sont déjà dans `package.json`:

```bash
npm install
# ou
pnpm install
```

Vérifiez que `bcryptjs` et `jsonwebtoken` sont installés:
```bash
npm list bcryptjs jsonwebtoken
```

### 3. Démarrage du Serveur

```bash
npm run dev
# Le serveur démarre sur http://localhost:3000
```

---

## 🔐 Initialisation du Premier Admin

### Option 1: Script PowerShell (Windows)

```powershell
# Depuis le dossier du projet
.\scripts\init-admin.ps1
```

### Option 2: Script Bash (Linux/Mac)

```bash
# Depuis le dossier du projet
chmod +x scripts/init-admin.sh
./scripts/init-admin.sh
```

### Option 3: Script Python

```bash
# Installer requests si ce n'est pas déjà fait
pip install requests

# Exécuter le script
python scripts/init-admin.py
```

### Option 4: cURL (Manuel)

```bash
curl -X POST http://localhost:3000/api/admin/init \
  -H "Content-Type: application/json" \
  -H "x-init-key: your-init-secret-key-change-this" \
  -d '{
    "email": "admin@efficience-dentaire.fr",
    "name": "Admin Efficience",
    "password": "SecurePassword123!"
  }'
```

---

## 🎯 Utilisation

### Page de Login Admin

**URL:** `http://localhost:3000/admin/login`

- Interface moderne et sécurisée
- Email et mot de passe requis (min 8 caractères)
- Gestion des erreurs complète
- Lien vers la connexion utilisateur

### Dashboard Admin

**URL:** `http://localhost:3000/admin/dashboard` (après connexion)

#### Actions Disponibles:

1. **Créer un Utilisateur**
   - Clic sur "Nouvel utilisateur"
   - Remplir: Nom, Email, Rôle (Admin/Utilisateur), Cabinet (optionnel)
   - Un mot de passe temporaire est généré automatiquement
   - À envoyer à l'utilisateur de manière sécurisée

2. **Modifier un Utilisateur**
   - Clic sur la ligne de l'utilisateur
   - Modification du statut (Actif/Inactif)
   - Modification du rôle si nécessaire

3. **Réinitialiser le Mot de Passe**
   - Clic sur l'icône "Réinitialiser" (↻)
   - Génère un nouveau mot de passe temporaire
   - À envoyer à l'utilisateur

4. **Désactiver/Activer un Utilisateur**
   - Clic sur le bouton Statut
   - Utilisateur inactif ne peut pas se connecter

5. **Supprimer un Utilisateur**
   - Clic sur l'icône "Supprimer" (🗑️)
   - Confirmation requise
   - Le dernier admin ne peut pas être supprimé

6. **Rechercher des Utilisateurs**
   - Barre de recherche en haut
   - Recherche par email ou nom en temps réel

---

## 📡 API Endpoints

### Authentication

**POST** `/api/admin/login`
```json
Request:
{
  "email": "admin@efficience-dentaire.fr",
  "password": "SecurePassword123!"
}

Response:
{
  "success": true,
  "message": "Authentification réussie",
  "admin": {
    "id": "...",
    "email": "admin@efficience-dentaire.fr",
    "name": "Admin",
    "role": "admin"
  }
}
```

**POST** `/api/admin/logout`
```
Efface le cookie admin_token
```

**GET** `/api/admin/verify`
```
Vérifie le token du cookie et retourne l'admin connecté
```

### User Management

**GET** `/api/admin/users`
```
Liste tous les utilisateurs (requiert authentification admin)
```

**POST** `/api/admin/users`
```json
Request:
{
  "email": "user@example.com",
  "name": "Jean Dupont",
  "role": "user",
  "cabinet": "Cabinet A"
}

Response:
{
  "success": true,
  "user": {...},
  "temporaryPassword": "ABC123def456!@#"
}
```

**GET** `/api/admin/users/[id]`
```
Récupère les détails d'un utilisateur
```

**PUT** `/api/admin/users/[id]`
```json
Modifie un utilisateur (email, name, role, cabinet, isActive, password)
```

**DELETE** `/api/admin/users/[id]`
```
Supprime un utilisateur
```

**POST** `/api/admin/reset-password`
```json
Request:
{
  "userId": "..."
}

Response:
{
  "success": true,
  "message": "Mot de passe réinitialisé",
  "temporaryPassword": "ABC123def456!@#"
}
```

### Initialization

**POST** `/api/admin/init`
```
Crée le premier administrateur (une seule fois)
Header: x-init-key (clé secrète)
```

---

## 🔒 Sécurité - Bonnes Pratiques

### ✅ À Faire

- ✅ Générez des clés secrètes fortes (min 32 caractères)
- ✅ Utilisez HTTPS en production
- ✅ Conservez les mots de passe temporaires en sécurité
- ✅ Changez régulièrement les clés secrètes
- ✅ Limitez l'accès admin par IP en production
- ✅ Utilisez des mots de passe forts pour l'admin initial

### ❌ À Éviter

- ❌ Ne mettez jamais `.env.local` dans git
- ❌ N'exposez pas les mots de passe temporaires
- ❌ Ne sharerez pas le `INIT_SECRET_KEY`
- ❌ Ne changez pas les mots de passe en plain text
- ❌ N'accordez pas les permissions admin à la légère

---

## 📁 Structure des Fichiers

```
app/
├── admin/
│   ├── login/
│   │   └── page.tsx          # Page de connexion admin
│   └── dashboard/
│       └── page.tsx          # Dashboard de gestion des utilisateurs
├── api/
│   └── admin/
│       ├── login/
│       │   └── route.ts      # API de connexion
│       ├── logout/
│       │   └── route.ts      # API de déconnexion
│       ├── verify/
│       │   └── route.ts      # API de vérification
│       ├── users/
│       │   ├── route.ts      # GET (liste) + POST (créer)
│       │   └── [id]/
│       │       └── route.ts  # GET, PUT, DELETE
│       ├── reset-password/
│       │   └── route.ts      # Réinitialiser mot de passe
│       └── init/
│           └── route.ts      # Initialiser premier admin
│
hooks/
└── use-admin-auth.ts         # Hook d'authentification admin

lib/
├── admin-auth.ts             # Fonctions crypto et JWT
├── db-admin.ts               # Connexion MongoDB

scripts/
├── init-admin.sh             # Script Bash
├── init-admin.ps1            # Script PowerShell
└── init-admin.py             # Script Python
```

---

## 🐛 Troubleshooting

### "Non authentifié" ou redirect vers login

- ✅ Vérifiez que le JWT_SECRET est le même en development
- ✅ Vérifiez les cookies du navigateur (admin_token)
- ✅ Réessayez après avoir vidé les cookies

### Erreur MongoDB

```
❌ Impossible de se connecter à MongoDB
```

- ✅ Vérifiez `MONGODB_URI` dans `.env.local`
- ✅ Vérifiez la connexion internet
- ✅ Vérifiez les credentials MongoDB
- ✅ Assurez-vous que MongoDB est accessible depuis votre IP

### "Email déjà existant"

- ✅ L'email existe déjà dans la base de données
- ✅ Utilisez un email différent ou réinitialisez le mot de passe

### Mot de passe temporaire non affiché

- ✅ Le mot de passe s'affiche après la création dans le modal
- ✅ Copiez-le immédiatement, il n'est pas stocké
- ✅ Si vous l'avez perdu, utilisez "Réinitialiser le mot de passe"

---

## 📊 Flux d'Authentification

```
1. Admin visite /admin/login
   ↓
2. Entre email + mot de passe
   ↓
3. Appel POST /api/admin/login
   ↓
4. Vérification en BD + Hash bcrypt
   ↓
5. Génération JWT + Cookie httpOnly
   ↓
6. Redirect vers /admin/dashboard
   ↓
7. useAdminAuth() récupère le token du cookie
   ↓
8. Utilisation dans les requêtes API (automatique)
   ↓
9. Middleware vérifie JWT sur chaque requête
   ↓
10. Logout = suppression du cookie
```

---

## 🎨 Personnalisation

### Modifier les Couleurs

Fichier: `app/admin/login/page.tsx`

```tsx
// Changer la couleur de la marque
<div className="w-14 h-14 bg-red-600 rounded-2xl">  {/* Changer red-600 */}
  <ShieldAlert className="w-8 h-8" />
</div>
```

### Ajouter des Champs Utilisateur

Fichier: `lib/admin-auth.ts` + `app/api/admin/users/route.ts`

```tsx
// Ajouter un champ dans l'interface User
interface User {
  id: string
  email: string
  // ... ajouter ici
  telephone?: string
  // ... ajouter ici
}
```

---

## 📞 Support

Pour des problèmes ou questions:

1. Vérifiez le [Troubleshooting](#-troubleshooting)
2. Consultez les logs du serveur (`npm run dev`)
3. Vérifiez la console du navigateur (F12)
4. Vérifiez les logs MongoDB

---

## ✨ Prochaines Étapes

Après avoir configuré l'admin:

1. **Intégrer la connexion utilisateur** aux pages client
2. **Ajouter la gestion des cabinets** (CRUD complet)
3. **Ajouter des rôles avancés** (Manager, Praticien, etc.)
4. **Ajouter l'audit logging** (qui a fait quoi et quand)
5. **Ajouter 2FA** pour les admins
6. **Intégrer l'email** pour envoyer les mots de passe temporaires

---

**Date:** Janvier 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
