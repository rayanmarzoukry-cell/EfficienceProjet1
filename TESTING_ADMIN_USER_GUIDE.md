# Guide Pratique - Tester Admin vs User en Local

## 🚀 Démarrage Rapide

### **1. Lancer l'application**
```bash
npm run dev
```
Accédez à `http://localhost:3000`

---

## 👤 Test Mode USER

### **Connexion comme USER:**
```
Email: user@efficience-dentaire.fr
Mot de passe: user123
```

### **Après connexion, vous voyez:**

#### **Sidebar USER (Bleu)**
```
📊 Dashboard général
  ↓ Clique → /dashboard
     ├─ Voir stats du cabinet personnel
     ├─ Vos RDV
     ├─ Votre chiffre d'affaires
     
📈 Analyses
  ↓ Clique → /analyses
     ├─ Tendances patients
     ├─ Revenus par mois
     
👥 Gestion clients
  ↓ Clique → /cabinets
  
📄 Rapports
  ↓ Clique → /rapports
  
🩺 Consultations
  ↓ Clique → /consultations
  
👨‍⚕️ PATIENTS
  ↓ Clique → /patients
  ├─ Liste de VOS patients
  ├─ Ajouter un patient
  ├─ Voir détails
  
⚙️ RÉGLAGES
  ↓ Clique → /settings
  ├─ Changer mot de passe
  ├─ Préférences
```

### **Restrictions USER:**
- ❌ Cannot access `/admin/*`
- ❌ Cannot manage other cabinets
- ❌ Cannot create/edit users
- ❌ Cannot import files
- ❌ Cannot see system logs

---

## 🛡️ Test Mode ADMIN

### **Connexion comme ADMIN:**
```
Email: admin@efficience-dentaire.fr
Mot de passe: admin123
```

### **Après connexion, vous voyez:**

#### **Sidebar ADMIN (Rouge avec Shield)**
```
🛡️ Dashboard Admin
  ↓ Clique → /admin/dashboard
     ├─ Stats système (users, cabinets, patients)
     ├─ Actions rapides
     ├─ Architecture admin vs user expliquée
     
👥 Gestion Utilisateurs
  ↓ Clique → /admin/users
     ├─ Liste de TOUS les utilisateurs
     ├─ Ajouter nouvel utilisateur
     ├─ Réinitialiser mot de passe
     ├─ Supprimer utilisateur
     ├─ Activer/Désactiver comptes
     
🏥 Gestion Cabinets
  ↓ Clique → /admin/cabinets
     ├─ Liste de TOUS les cabinets
     ├─ Ajouter nouveau cabinet
     ├─ Modifier infos cabinet
     ├─ Supprimer cabinet
     
📥 Import Fichiers
  ↓ Clique → /admin/import
     ├─ Glisser-déposer fichiers CSV/Excel
     ├─ Importer patients/finances/production
     ├─ Guide complet intégration N8N
     ├─ Explications flux automatisé
     
⚙️ Configuration
  ↓ Clique → /admin/configuration
     (À créer)
     
📊 Système & Logs
  ↓ Clique → /admin/system
     (À créer)
     ├─ Logs d'importation
     ├─ Santé système
     ├─ Activité récente
```

### **Permissions ADMIN:**
- ✅ Access all `/admin/*` routes
- ✅ Manage all users (CRUD)
- ✅ Manage all cabinets (CRUD)
- ✅ Import files & configure N8N
- ✅ View system logs
- ✅ Configure application

---

## 🔑 Créer un Nouvel Utilisateur (Comme Admin)

### **Via Interface Web:**

1. Connexion comme admin@efficience-dentaire.fr
2. Aller à `/admin/users`
3. Cliquer "Nouvel utilisateur"
4. Remplir formulaire:
   ```
   Nom: Jean Dupont
   Email: jean@exemple.fr
   Rôle: Utilisateur (ou Administrateur)
   Cabinet: Cabinet A (optionnel)
   ```
5. Le système génère mot de passe temporaire
6. Communiquer mot de passe à l'utilisateur
7. Utilisateur change mot de passe à 1ère connexion

---

## 📊 Tester les Différentes Interfaces

### **Scénario 1: User essaie d'accéder /admin/**

1. Connectez-vous comme user@efficience-dentaire.fr
2. Allez à `http://localhost:3000/admin/dashboard`
3. **Résultat:** Redirection à `/dashboard`
   - Middleware empêche l'accès
   - Seul l'admin peut voir `/admin/*`

### **Scénario 2: Admin accède user routes**

1. Connectez-vous comme admin@efficience-dentaire.fr
2. Allez à `http://localhost:3000/dashboard`
3. **Résultat:** Vous voyez la page user
   - Admin CAN see user routes
   - But admin SHOULD see /admin/dashboard instead
   - (Logic à ajouter: redirection auto vers /admin si role=admin)

### **Scénario 3: Tester import N8N**

1. Connectez-vous comme admin
2. Allez à `/admin/import`
3. Glissez-déposez un fichier CSV
4. Vérifiez la documentation N8N affichée
5. (Actuellement: import returns test message, webhook not yet functional)

---

## 🔐 Mots de Passe (Développement)

### **Utilisateurs permanents (dans MongoDB Atlas):**

```
USER:
├─ Email: user@efficience-dentaire.fr
├─ Password: user123
└─ Role: user

ADMIN:
├─ Email: admin@efficience-dentaire.fr
├─ Password: admin123
└─ Role: admin
```

### **Changer mot de passe:**
1. Connexion
2. Aller à `/settings` (user) ou `/admin/configuration` (admin)
3. Cliquer "Changer mot de passe"
4. New password doit être 6+ caractères

---

## 📱 Interfaces Responsives

### **Desktop (1920px+):**
- ✅ Sidebar (ml-72 = 288px)
- ✅ Main content full width
- ✅ Grid 3+ colonnes

### **Tablet (768px-1024px):**
- ✅ Sidebar visible (shrink slightly)
- ✅ Grid 2 colonnes
- ✅ Cards adapt

### **Mobile (<768px):**
- ✅ Sidebar collapses
- ✅ Hamburger menu
- ✅ Grid 1 colonne
- ✅ Cards stack

---

## 🎨 Palette Couleurs

### **Thème USER:**
- Bleu primaire: `#3b82f6`
- Backgrounds: Light blues
- Sidebar icon: User

### **Thème ADMIN:**
- Rouge primaire: `#dc2626`
- Backgrounds: Light reds
- Sidebar icon: Shield

### **Neutres (Partout):**
- Slate-900: `#0f172a` (Texte)
- Slate-50: `#f8fafc` (Background)
- White: `#ffffff` (Cards)

---

## 🐛 Troubleshooting

### **Problème 1: Connecté mais redirection boucle**
**Solution:** 
- Vérifier localStorage: `auth_token` existe?
- Vérifier middleware.ts: route est-elle protégée?
- Reload page: `Ctrl+F5` (hard refresh)

### **Problème 2: User voit sidebar admin**
**Solution:**
- Vérifier `user_role` dans localStorage
- Doit être "user" ou "admin"
- Redirection basée sur rôle à ajouter en middleware

### **Problème 3: Admin dashboard vide**
**Solution:**
- Stats sont actuellement mockées
- À remplacer par vrais appels API `/api/admin/stats`
- Vérifier console pour erreurs réseau

### **Problème 4: Import ne fonctionne pas**
**Solution:**
- `/api/admin/import` n'existe pas encore
- À créer pour vraiment importer en MongoDB
- Actuellement: interface prête, backend manquant

---

## 📋 Checklist pour Tester

### **Login:**
- [ ] Admin login fonctionne
- [ ] User login fonctionne
- [ ] Mauvais password = erreur
- [ ] Token généré et stocké

### **Routing:**
- [ ] Admin voit `/admin/dashboard`
- [ ] User ne peut pas accéder `/admin/*`
- [ ] User voit `/dashboard`
- [ ] Logout déconnecte bien

### **Interfaces:**
- [ ] Sidebar USER affiche (bleu)
- [ ] Sidebar ADMIN affiche (rouge)
- [ ] Menus différents visiblement
- [ ] Navigation fonctionne

### **Pages Admin:**
- [ ] `/admin/dashboard` affiche stats
- [ ] `/admin/cabinets` liste les cabinets
- [ ] `/admin/import` affiche formulaire upload
- [ ] Boutons "Créer", "Modifier" fonctionnent

---

## 🎓 Ce qui Existe vs À Faire

### ✅ Déjà implémenté:
- Login/Register page
- Authentication (bcrypt + JWT)
- MongoDB connection & users storage
- User sidebar component
- Admin sidebar component
- Admin dashboard page
- Admin cabinets page
- Admin import page (avec N8N doc)
- Middleware route protection
- Role-based UI (different sidebars)

### ⏳ À créer pour compléter:
- [ ] `/api/admin/stats` - Endpoint stats
- [ ] `/api/admin/import` - Webhook import
- [ ] `/admin/users` - Gestion utilisateurs (API existe)
- [ ] `/admin/configuration` - Configuration système
- [ ] `/admin/system` - Logs et monitoring
- [ ] Role checking in middleware (pas seulement token)
- [ ] Auto-redirect admin to `/admin/dashboard`
- [ ] User management CRUD pages
- [ ] File upload handling

### ⏰ Future (Nice to have):
- [ ] N8N production configuration
- [ ] Audit logs
- [ ] MFA/2FA
- [ ] Advanced analytics
- [ ] Data export features

---

## 💡 Architecture Summary

```
┌─────────────────────────────────────────┐
│           APP EFFICIENCE                │
├─────────────────────────────────────────┤
│                                         │
│  LOGIN PAGE (/login)                   │
│    ↓                                   │
│    ├─ Admin? → /admin/dashboard ⚙️    │
│    └─ User?  → /dashboard 📊           │
│                                         │
│  ┌──────────────┬──────────────┐       │
│  │              │              │       │
│  │  USER AREA   │  ADMIN AREA  │       │
│  │  /dashboard  │  /admin/...  │       │
│  │  /patients   │  /users      │       │
│  │  /rapports   │  /cabinets   │       │
│  │  /analyses   │  /import     │       │
│  │              │  /config     │       │
│  └──────────────┴──────────────┘       │
│       (Blue Theme)  (Red Theme)        │
│                                         │
│  └─ MongoDB Atlas                      │
│     └─ users collection                │
│     └─ cabinets collection             │
│     └─ patients collection             │
│     └─ etc...                          │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📞 Support

Pour toute question:
1. Vérifier la documentation `ADMIN_INTERFACE_ARCHITECTURE.md`
2. Checker les logs du navigateur (F12 → Console)
3. Vérifier MongoDB Atlas pour données
4. Relancer `npm run dev`
