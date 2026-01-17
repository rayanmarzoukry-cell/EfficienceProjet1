# 🦷 Efficience Analytics - Plateforme de Gestion Cabinet Dentaire

**Version**: 1.0  
**Date**: 14 janvier 2026  
**Statut**: ✅ Production Ready  
**Langue**: 🇫🇷 Français

---

## 📋 À Propos

**Efficience Analytics** est une plateforme de **gestion intégrée pour cabinets dentaires** avec:
- 📊 Tableaux de bord analytiques en temps réel
- 👥 Gestion des patients et rendez-vous
- 🏢 Suivi des performances par cabinet
- 📈 Prédictions et recommandations IA
- 🔐 Interface d'administration sécurisée
- 📤 Import/Export de données
- 💾 Base de données MongoDB Atlas Cloud

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm 9+
- MongoDB Atlas Cloud account (gratuit)
- Variables d'environnement configurées

### Installation (2 minutes)

```bash
# 1. Cloner le projet
git clone <repo-url>
cd efficience-app-offic

# 2. Installer les dépendances
npm install

# 3. Configurer .env.local
cp .env.example .env.local
# Puis remplir les valeurs:
# MONGODB_URI=mongodb+srv://...
# JWT_SECRET=votre-secret
# OPENAI_API_KEY=sk-proj-...

# 4. Démarrer le serveur
npm run dev
```

### Accès
```
🏠 Dashboard: http://localhost:3001
🔐 Admin:     http://localhost:3001/admin/login
```

### Credentials par Défaut (Développement)
```
Email:    admin@efficience-dentaire.fr
Password: Efficience2026!
```

---

## 🏗️ Structure du Projet

```
efficience-analytics/
├── 📁 app/                    # Pages et API routes
│   ├── admin/                 # Interface admin
│   │   ├── login/            # Page login
│   │   └── page.tsx          # Dashboard admin
│   ├── dashboard/            # Dashboard principal
│   ├── analyses/             # Pages analyses
│   ├── cabinets/             # Gestion cabinets
│   ├── consultations/        # Consultations
│   ├── rapports/             # Rapports
│   ├── api/                  # API endpoints
│   │   ├── admin/            # Admin auth + CRUD
│   │   ├── patients/         # Patients API
│   │   ├── cabinets/         # Cabinets API
│   │   ├── rendezvous/       # RDV API
│   │   └── stats/            # Statistics API
│   └── layout.tsx            # Root layout
│
├── 📁 components/            # Composants React
│   ├── layout/              # Layouts (ProtectedLayout)
│   ├── ui/                  # Shadcn/UI components
│   ├── admin-automation-panel.tsx
│   ├── cabinet-performance.tsx
│   └── ... (30+ composants)
│
├── 📁 lib/                  # Services et utilitaires
│   ├── db.ts               # MongoDB connection
│   ├── types.ts            # TypeScript types
│   ├── openai-service.ts   # OpenAI integration
│   ├── report-utils.ts     # Report generation
│   └── kpiService.ts       # KPI calculations
│
├── 📁 models/              # Mongoose schemas
│   ├── Admin.ts            # Admin schema
│   ├── Patient.ts          # Patient schema
│   ├── Cabinet.ts          # Cabinet schema
│   └── RendezVous.ts       # Appointment schema
│
├── 📁 context/             # React Context
│   └── AppContext.tsx      # Global app state
│
├── 📁 public/              # Assets statiques
│
└── 📁 .github/
    └── copilot-instructions.md  # AI Copilot guide

```

---

## 📚 Documentation Complète

### Pour Commencer
- **[QUICK_START_ADMIN.md](QUICK_START_ADMIN.md)** - Guide de démarrage rapide (4 étapes)
- **[ADMIN_SYSTEM_COMPLETE.md](ADMIN_SYSTEM_COMPLETE.md)** - Documentation système admin complète

### Pour la Production
- **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)** - Checklist 9 phases avant production
- **[RESUME_COMPLET.md](RESUME_COMPLET.md)** - Résumé complet du projet

### Guides Existants
- **[GUIDE_DEMARRAGE_RAPIDE.md](GUIDE_DEMARRAGE_RAPIDE.md)** - Quick start (français)
- **[IA_INTEGRATION_GUIDE.md](IA_INTEGRATION_GUIDE.md)** - Intégration OpenAI
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - Instructions AI Copilot

---

## 🔐 Système d'Administration

### Authentification
```
1. Page login: /admin/login
2. Formulaire: email + password
3. Endpoint API: POST /api/admin/login
4. Token JWT généré (24h expiration)
5. localStorage storage
6. Route protection avec ProtectedLayout
```

### Fonctionnalités Admin
- ✅ Tableau de bord avec stats en direct
- ✅ Affichage cabinetsd, patients, RDV
- ✅ Zone d'importation de données
- ✅ État du système (MongoDB, JWT)
- ✅ Historique d'activité
- ✅ Déconnexion sécurisée

### Sécurité Implémentée
- ✅ JWT tokens (24h d'expiration)
- ✅ localStorage protection
- ✅ Route protection (ProtectedLayout)
- ✅ Input validation côté serveur
- ✅ HTTP status codes appropriés
- ✅ Zero TypeScript errors

---

## 🗄️ Base de Données

### MongoDB Atlas Cloud
```
Cluster: efficienceprojet
Collections:
  • admins - Administrateurs
  • patients - Patients cabinet
  • cabinets - Cabinets dentaires
  • rendezvous - Rendez-vous
  • kpis - Key Performance Indicators
```

### Mongoose Models
- `models/Admin.ts` - Schema administrateurs
- `models/Patient.ts` - Schema patients
- `models/Cabinet.ts` - Schema cabinets
- `models/RendezVous.ts` - Schema rendez-vous

### API Endpoints
```
GET  /api/stats       - Statistiques en direct
GET  /api/patients    - Lister patients
GET  /api/cabinets    - Lister cabinets
GET  /api/rendezvous  - Lister RDV
POST /api/admin/login - Authentification
POST /api/admin       - Créer administrateur
```

---

## 🎨 Theme & Styling

### Design System
- **Framework**: Tailwind CSS
- **Components**: Shadcn/UI (50+ components)
- **Theme**: Light mode (blanc, gris, bleu)
- **Icons**: Lucide React

### Palette de Couleurs
```
Primary:     #3b82f6 (Blue)
Success:     #10b981 (Green)
Warning:     #f59e0b (Amber)
Error:       #ef4444 (Red)
Background:  #f8fafc (Slate-50)
Text:        #0f172a (Slate-900)
```

---

## 🔧 Technologie Stack

### Frontend
- **Framework**: Next.js 15.5.9 (App Router)
- **Language**: TypeScript
- **UI Library**: React + Shadcn/UI
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State**: React Context + localStorage

### Backend
- **Framework**: Next.js API Routes
- **Database**: MongoDB Atlas Cloud
- **ORM**: Mongoose
- **Auth**: JWT tokens
- **AI**: OpenAI API (Claude 3.5 Sonnet)

### DevOps
- **Deployment**: Vercel (recommended)
- **Repository**: GitHub
- **Package Manager**: npm
- **Node Version**: 18+

---

## 📊 Fonctionnalités Principales

### 1. Dashboard
```
✅ KPI cards (Patients, CA, Objectif)
✅ Charts (Line, Pie, Bar)
✅ Real-time data from MongoDB
✅ 5-second auto-refresh
✅ Alerts et notifications
```

### 2. Gestion Cabinets
```
✅ Lister tous les cabinets
✅ Afficher stats par cabinet
✅ Voir performance (CA, patients, RDV)
✅ Tableaux interactifs
```

### 3. Gestion Patients
```
✅ Lister tous les patients
✅ Détails patient (nom, email, RDV)
✅ Consulter historique
✅ Filter par cabinet
```

### 4. Rendez-vous
```
✅ Calendrier avec RDV
✅ Filtrer par status
✅ Voir détails RDV
✅ Planner nouveaux RDV
```

### 5. Rapports
```
✅ Générer rapports PDF
✅ Export CSV/Excel
✅ AI-powered insights
✅ Recommendations
```

### 6. Analyses
```
✅ Analyses globales avancées
✅ Performance scoring
✅ Distribution des scores
✅ Graphiques interactifs
```

---

## 🚀 Déploiement

### Développement Local
```bash
npm run dev
# Port 3001 (si port 3000 occupé)
```

### Build Production
```bash
npm run build
npm start
```

### Déployer sur Vercel
```bash
# Connecter GitHub repo
# Ajouter variables d'environnement:
# - MONGODB_URI
# - JWT_SECRET
# - OPENAI_API_KEY
# - DATABASE_NAME

# Push sur main branch
git push origin main

# Vercel déploie automatiquement
# Accès: https://votre-app.vercel.app
```

---

## 🧪 Tests

### Vérifier la compilation
```bash
npm run build
```

### Linter
```bash
npm run lint
```

### Test le serveur
```bash
npm run dev
# Ouvrir http://localhost:3001
```

### Tester API avec curl
```bash
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@efficience-dentaire.fr","password":"Efficience2026!"}'
```

---

## ⚙️ Configuration

### .env.local (Créer ce fichier)
```env
# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/efficience
DATABASE_NAME=efficience

# JWT
JWT_SECRET=votre-secret-ultra-secure-minimum-32-chars

# OpenAI
OPENAI_API_KEY=sk-proj-votre-clé-openai

# Optional
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### .env.example (Pour Git)
```env
MONGODB_URI=mongodb+srv://[user]:[password]@[cluster].mongodb.net/[db]
DATABASE_NAME=efficience
JWT_SECRET=votre-secret-ici
OPENAI_API_KEY=sk-proj-votre-clé-ici
```

---

## 🐛 Troubleshooting

### Port 3000 occupé
```
✅ Serveur redémarre automatiquement sur port 3001
```

### MongoDB connection error
```
❌ Vérifier MONGODB_URI dans .env.local
❌ Vérifier IP whitelist sur MongoDB Atlas
❌ Vérifier credentials MongoDB
```

### JWT error
```
❌ Vérifier JWT_SECRET variable d'environnement
❌ Nettoyer localStorage (F12 → Application → Clear)
❌ Vous reconnecter
```

### Types manquants
```bash
npm install --save-dev @types/jsonwebtoken
npm run build
```

---

## 🤝 Contribution

### Pour ajouter une feature
1. Créer branche: `git checkout -b feature/mon-feature`
2. Commit: `git commit -m "Add: description"`
3. Push: `git push origin feature/mon-feature`
4. Pull Request

### Standards de code
- TypeScript strict mode
- Tailwind CSS pour styling
- Shadcn/UI pour components
- Mongoose pour MongoDB
- Functional components (React hooks)

---

## 📞 Support

### Documentation
- 📖 [ADMIN_SYSTEM_COMPLETE.md](ADMIN_SYSTEM_COMPLETE.md) - Système admin
- 📖 [QUICK_START_ADMIN.md](QUICK_START_ADMIN.md) - Quick start
- 📖 [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Checklist prod
- 📖 [.github/copilot-instructions.md](.github/copilot-instructions.md) - AI guide

### Ressources
- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📄 Licence

Propriétaire - Efficience Analytics 2026

---

## 🎉 Changelog

### v1.0 (14 janvier 2026)
✅ Système admin complet
✅ JWT authentication
✅ MongoDB integration
✅ Dashboard en live
✅ Light theme appliqué partout
✅ Documentation complète
✅ Zero TypeScript errors

---

**Efficience Analytics - Plateforme de Gestion Cabinet Dentaire**  
**Production Ready ✅**  
**Support & Documentation Complète 📚**

Pour plus d'informations, consultez la [documentation complète](ADMIN_SYSTEM_COMPLETE.md).
