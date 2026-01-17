# 🚀 Guide de Démarrage - Système Admin Efficience

## ⏱️ 5 Minutes pour Être Opérationnel

### Étape 1️⃣: Configuration (1 min)

```bash
# Créer le fichier .env.local
cp .env.local.example .env.local

# Remplir les valeurs:
# MONGODB_URI = votre URI MongoDB
# JWT_SECRET = clé forte (min 32 caractères)
# INIT_SECRET_KEY = clé secrète forte
```

**Exemple .env.local:**
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/efficience
DATABASE_NAME=efficience
JWT_SECRET=your-super-secret-key-at-least-32-characters-long-here
INIT_SECRET_KEY=another-super-secret-key-for-init
NODE_ENV=development
```

### Étape 2️⃣: Démarrer le Serveur (1 min)

```bash
npm run dev
```

Vous verrez:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
```

### Étape 3️⃣: Créer le Premier Admin (2 min)

**Windows (PowerShell):**
```powershell
.\scripts\init-admin.ps1
```

**Linux/Mac (Bash):**
```bash
./scripts/init-admin.sh
```

**Ou Python (tous les OS):**
```bash
python scripts/init-admin.py
```

Suivez les prompts:
```
Email: admin@efficience-dentaire.fr
Nom: Admin Efficience
Mot de passe: YourSecurePassword123!
```

### Étape 4️⃣: Se Connecter (1 min)

Ouvrir: **http://localhost:3000/admin/login**

Connexion:
- Email: `admin@efficience-dentaire.fr`
- Mot de passe: (celui entré)

✅ Vous êtes maintenant dans le **Dashboard Admin**!

---

## 📋 Checklist Post-Démarrage

- [ ] Serveur démarre sans erreurs
- [ ] Admin créé avec succès
- [ ] Connexion admin fonctionne
- [ ] Dashboard affiche les utilisateurs
- [ ] Vous pouvez créer un nouvel utilisateur

---

## 🎯 Prochaines Étapes

### 1. Créer des Utilisateurs
```
Dashboard > Nouvel utilisateur
Remplir: Nom, Email, Rôle, Cabinet
Copier le mot de passe temporaire
```

### 2. Communiquer les Credentials
```
À l'utilisateur:
- Email: user@example.com
- Mot de passe temporaire: ABC123def456!@#
```

### 3. Intégrer au Login Client
```
Les utilisateurs vont sur /login
Entrent leur email et mot de passe
Sont redirigés vers /dashboard
```

---

## 📱 Interfaces Disponibles

| URL | Purpose | Auth Required |
|-----|---------|---------------|
| `/admin/login` | Connexion admin | ❌ Non |
| `/admin/dashboard` | Gestion utilisateurs | ✅ Oui |
| `/login` | Connexion client | ❌ Non |
| `/dashboard` | Dashboard client | ✅ Oui |

---

## 🔐 Sécurité - À Faire Immédiatement

### 🚨 En Production UNIQUEMENT:

1. **Changez les clés secrètes**
   ```env
   JWT_SECRET=<random-strong-key-32chars>
   INIT_SECRET_KEY=<random-strong-key-32chars>
   ```

2. **Utilisez HTTPS**
   ```env
   NODE_ENV=production
   ```

3. **Désactivez l'init endpoint**
   - Après création du premier admin
   - Ou limitez par IP

4. **Backups MongoDB**
   - Configurez les sauvegardes automatiques

---

## 🐛 Problèmes Courants

### ❌ "Impossible de se connecter à MongoDB"
```
✅ Vérifiez MONGODB_URI dans .env.local
✅ Assurez-vous que MongoDB est accessible
✅ Vérifiez les credentials
```

### ❌ "Email invalide ou mot de passe incorrect"
```
✅ Vérifiez que l'admin a été créé
✅ Vérifiez l'orthographe exacte
✅ Le mot de passe fait > 8 caractères
```

### ❌ "Erreur lors du login après création d'admin"
```
✅ Attendez 2-3 secondes
✅ Rafraîchissez la page (F5)
✅ Essayez incognito (cache problème)
```

---

## 💡 Astuces

### Commandes Utiles

```bash
# Démarrer le serveur
npm run dev

# Créer admin (Windows)
npm run init:admin:powershell

# Créer admin (Linux/Mac)
npm run init:admin:bash

# Créer admin (Python)
npm run init:admin:python

# Tester l'API
npm run test:admin

# Build pour production
npm run build

# Démarrer en production
npm start
```

### Visualiser les Données MongoDB

Utilisez MongoDB Compass:
1. Connectez-vous avec MONGODB_URI
2. Allez à la collection `users`
3. Voyez tous vos utilisateurs

### Réinitialiser un Mot de Passe Oublié

1. Allez sur le dashboard
2. Trouvez l'utilisateur
3. Clic sur l'icône ↻ (Réinitialiser)
4. Copiez le nouveau mot de passe
5. Envoyez à l'utilisateur

---

## 📊 Flux Utilisateur Standard

```
1. Admin se connecte
   ↓ /admin/login
   
2. Admin crée un utilisateur
   ↓ Dashboard > Nouvel utilisateur
   
3. Mot de passe temporaire généré
   ↓ Admin envoie à l'utilisateur
   
4. Utilisateur se connecte
   ↓ /login avec credentials
   
5. Utilisateur crée son mot de passe
   ↓ Formulaire de modification
   
6. Utilisateur accède au dashboard
   ↓ /dashboard
```

---

## 🆘 Support

### Documents Disponibles

- `ADMIN_AUTH_GUIDE.md` - Guide complet et détaillé
- `ADMIN_IMPLEMENTATION_COMPLETE.md` - Implémentation technique
- `README.md` - Vue générale du projet

### Vérifier les Logs

**Terminal:**
```
npm run dev

# Cherchez les erreurs:
# ✅ = succès
# ❌ = erreur
# ⚠️  = warning
```

**Console Navigateur (F12):**
```
Application > Cookies > admin_token
(Pour vérifier le token)
```

### Fichiers Importants

- `.env.local` - Configuration
- `app/admin/login/page.tsx` - Page login
- `app/admin/dashboard/page.tsx` - Dashboard
- `app/api/admin/` - API endpoints
- `hooks/use-admin-auth.ts` - Hook auth
- `lib/admin-auth.ts` - Fonctions crypto

---

## ✨ Points Clés à Retenir

1. **JWT Secret** - Gardez-le secret! 🔒
2. **Mots de passe temporaires** - À envoyer de manière sécurisée
3. **Cookies httpOnly** - Protection automatique
4. **Hashage bcryptjs** - Sécurisé et standard
5. **Middleware** - Protège automatiquement `/admin/*`
6. **MongoDB** - Schéma flexible et scalable

---

## 🎓 Qu'avez-vous obtenu?

✅ Système d'authentification complet  
✅ Gestion des utilisateurs (CRUD)  
✅ Hashage sécurisé des mots de passe  
✅ JWT tokens avec expiration  
✅ Dashboard admin intuitif  
✅ Réinitialisation de mots de passe  
✅ Recherche et filtrage  
✅ Tests automatisés  
✅ Scripts d'initialisation  
✅ Documentation complète  

---

## 🚀 Vous êtes Prêt!

```
npm run dev
→ Open http://localhost:3000/admin/login
→ Create admin
→ Manage users
→ Profit! 🎉
```

---

**Créé:** 17 Janvier 2026  
**Temps estimé:** 5 minutes  
**Complexité:** ⭐ Facile (tout est configuré)  
**Support:** ✅ Documentation complète incluse
