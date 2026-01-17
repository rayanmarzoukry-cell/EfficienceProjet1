# 🔐 Guide d'Administration - Efficience Analytics

## Configuration Admin

### Compte Admin Par Défaut

**Email:** `admin@efficience-dentaire.fr`  
**Mot de passe:** `Efficience2026!`

⚠️ **IMPORTANT:** Ces credentials sont temporaires pour le développement. Vous DEVEZ les changer en production.

---

## 🚀 Accès à l'Interface Admin

### URL
```
http://localhost:3001/admin
```

### Flux d'Authentification

1. **Accéder à la page d'administration**
   - L'utilisateur est redirigé vers `/admin/login` s'il n'a pas de token valide
   - Affichage du formulaire de connexion

2. **Saisir les identifiants**
   - Email: `admin@efficience-dentaire.fr`
   - Mot de passe: `Efficience2026!`

3. **Validation et Token JWT**
   - L'API `/api/admin/login` valide les credentials
   - Un token JWT valide 24h est généré
   - Le token est stocké dans `localStorage.admin_token`
   - Les infos utilisateur sont stockées dans `localStorage.admin_user`

4. **Redirection vers le Dashboard**
   - Après connexion réussie, redirection vers `/admin`
   - Le `ProtectedLayout` vérifie le token et affiche le contenu

5. **Déconnexion**
   - Clic sur le bouton "Déconnexion" en haut à droite
   - Suppression des tokens localStorage
   - Redirection vers `/admin/login`

---

## 📋 Structure du Système

### Architecture de Sécurité

```
┌─────────────────────────────────────────┐
│  Page Admin (/admin)                    │
│  + ProtectedLayout                      │
│    - Vérifie JWT token                  │
│    - Valide l'expiration (24h)          │
│    - Affiche header avec user info      │
│    - Bouton déconnexion                 │
│    - Redirige si pas de token           │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  API Routes (/api/admin/*)              │
│  + POST /api/admin/login                │
│    - Valide email/password              │
│    - Génère JWT token                   │
│    - Retourne user info                 │
└─────────────────────────────────────────┘
```

### Fichiers Clés

| Fichier | Rôle |
|---------|------|
| `app/admin/page.tsx` | Dashboard admin principal |
| `app/admin/login/page.tsx` | Page de connexion |
| `app/api/admin/login/route.ts` | API d'authentification |
| `components/layout/protected-layout.tsx` | Wrapper de protection |
| `.env.local` | Variables d'environnement (JWT_SECRET) |

---

## 🔧 Configuration en Production

### Étape 1: Changer les Credentials

Modifier `app/api/admin/login/route.ts` :

```typescript
const ADMIN_CREDENTIALS = {
  email: "votre-email@example.com",
  password: "VotreMotDePasseSecurisé123!",
  name: "Votre Nom",
}
```

**OU** utiliser des variables d'environnement:

```typescript
// Ajouter à .env.local
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SecurePassword123!
```

### Étape 2: Utiliser un JWT Secret Sécurisé

```typescript
// Dans app/api/admin/login/route.ts
const JWT_SECRET = process.env.JWT_SECRET || "changez-cette-clé-en-production"
```

Ajouter à `.env.local`:
```
JWT_SECRET=votre_clé_secrète_longue_et_complexe_ici
```

### Étape 3: Implémenter une Base de Données pour les Admins

Actuellement les credentials sont en dur. Recommandation:

1. Créer un modèle Mongoose `Admin.ts`
2. Stocker les admins dans MongoDB avec mots de passe hashés (bcrypt)
3. Modifier `/api/admin/login` pour requêter la base de données

```typescript
// Exemple avec MongoDB
const admin = await Admin.findOne({ email })
if (!admin || !await bcrypt.compare(password, admin.passwordHash)) {
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
}
```

---

## 📊 Fonctionnalités du Panneau Admin

### Dashboard (Actuellement Disponible)

- ✅ Vue des statistiques en temps réel
  - Nombre total de cabinets
  - Nombre total de patients
  - Nombre total de rendez-vous
  
- ✅ Statut du système
  - Connexion MongoDB
  - Dernière mise à jour

- ✅ Information de sécurité
  - Type d'authentification (JWT)
  - Niveau d'accès (Admin only)
  - Provider base de données

- 📅 Historique des activités
  - Dernière connexion
  - État du système

### À Ajouter (Prochaines Étapes)

- 📤 **Importation de données CSV/Excel**
  - Upload de fichier
  - Validation des données
  - Prévisualisation avant import
  - Confirmation et enregistrement en MongoDB

- 👥 **Gestion des comptes admin**
  - Ajouter/modifier/supprimer des admins
  - Réinitialiser les mots de passe

- 🔍 **Audit Log**
  - Historique de toutes les actions admin
  - Qui a importé quoi et quand
  - Modifications effectuées

- 📋 **Gestion des cabinets**
  - Modifier les informations
  - Activer/désactiver les comptes

---

## 🔐 Sécurité et Bonnes Pratiques

### Protection Contre les Attaques

✅ **CSRF Protection**
- Les tokens sont côté localStorage (automatiquement ajoutés aux headers)

✅ **Expiration de Session**
- Les tokens JWT expirent après 24h
- Nécessite une reconnexion

✅ **Validation d'Entrée**
- Email et password sont validés côté serveur
- Pas d'affichage de messages d'erreur spécifiques

✅ **HTTPS Recommandé**
- En production, toutes les communications doivent être en HTTPS

### À Implémenter

❌ **Hashage de Mot de Passe**
- Actuellement: Credentials en dur
- À faire: Utiliser bcrypt pour hasher les MDP

❌ **Rate Limiting**
- Limiter les tentatives de login échouées

❌ **2FA (Double Authentification)**
- Ajouter un code 2FA par email ou SMS

❌ **Audit Logging**
- Enregistrer toutes les actions admin

---

## 🛠️ Dépannage

### "Module not found: Can't resolve '@/components/layout/protected-layout'"

**Solution:** Le fichier existe maintenant. Redémarrez le serveur:
```bash
npm run dev
```

### Token expiré après 24h

**Solution:** Reconnecter vous à l'interface admin. Le token JWT a une durée de vie de 24 heures.

### Pas accès à `/admin` après connexion

**Vérifications:**
1. Avez-vous cliqué sur "Se connecter"?
2. Le token est-il dans localStorage? (Ouvrir DevTools → Application → Local Storage)
3. Le serveur MongoDB est-il connecté? (Vérifier les logs du serveur)

### Erreur "Identifiants invalides"

**Vérifications:**
1. Email: `admin@efficience-dentaire.fr` (exactement)
2. Mot de passe: `Efficience2026!` (exactement)
3. Les credentials sont-ils changés en production?

---

## 📝 Notes de Développement

### Structure des Tokens JWT

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "email": "admin@efficience-dentaire.fr",
    "role": "admin",
    "exp": 1704067200  // Timestamp expiration (24h)
  },
  "signature": "..." // Signé avec JWT_SECRET
}
```

### Format localStorage

**admin_token** (JWT complet):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGVmZmljaWVuY2UtZGVudGFpcmUuZnIiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDQwNjcyMDB9.abc123...
```

**admin_user** (JSON):
```json
{
  "email": "admin@efficience-dentaire.fr",
  "name": "Administrateur Efficience",
  "role": "admin"
}
```

---

## 📞 Support

Pour toute question concernant l'administration:
1. Vérifier les logs serveur (npm run dev)
2. Ouvrir DevTools pour voir les erreurs côté client
3. Vérifier la connexion MongoDB

---

**Dernière mise à jour:** 2026-01-15  
**Version:** 1.0.0  
**Auteur:** Efficience Analytics Team
