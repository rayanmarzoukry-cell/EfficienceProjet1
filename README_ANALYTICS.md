# EFFICIENCE ANALYTICS - Platform de Suivi Dentaire

Plateforme complète de gestion, analyse et reporting pour cabinets dentaires. Version améliorée avec tableaux de bord analytiques avancés, gestion des rapports et analyses détaillées.

## 🎯 Fonctionnalités principales

### 📊 Dashboard Général
- Synthèse globale avec 4 KPIs principaux
- Evolution du CA moyen par cabinet
- Répartition des scores (Performants, À surveiller, En difficulté)
- Alertes & Notifications en temps réel
- Top cabinets ranking
- Accès rapide aux autres modules

### 📈 Analyses Globales
- Comparatifs des performances entre cabinets
- Graphiques multi-cabinets (CA, CA horaires, nouveaux patients)
- Montant moyen des devis proposés
- Scoring performance avec visualization
- Répartition des scores par catégorie

### 📋 Gestion des Cabinets
- Liste globale avec overview
- Cartes de performance pour chaque cabinet
- Recherche et filtres avancés
- Tableaux avec statistiques détaillées
- Lien vers page détail de chaque cabinet

### 🏥 Détails Cabinet (Page individuelle)
Sections complètes pour chaque cabinet:
- **Chiffre d'affaires**: CA total, CA horaire, évolution
- **Agenda**: Nouveaux patients, traités, sur l'agenda
- **En cours**: Patients en cours, montants, durée
- **Devis**: Nombre, montant moyen, taux d'acceptation
- Tous les graphiques avec tendances mensuelles

### 📑 Rapports
- Vue rapide avec statistiques (envoyés, générés, non envoyés)
- Tableau complet avec filtres de recherche
- Actions rapides: voir PDF, télécharger, renvoyer, régénérer
- Aperçu PDF en modal dialog
- Générer et historique des rapports

### 📞 Analyse des Consultations
- Tableau global des consultations par cabinet
- Détails par cabinet avec informations complètes
- Scores de consultation par intervenant
- Évolution des consultations sur 12 mois
- Graphiques de nouveaux patients, traités, agenda

## 🏗️ Architecture

### Structure des dossiers
```
app/
├── dashboard/           # Dashboard principal
├── analyses/           # Page analyses globales
├── rapports/           # Gestion des rapports
├── consultations/      # Analyse des consultations
├── cabinets/           # Gestion et liste cabinets
├── cabinet/[id]/       # Détail d'un cabinet
└── api/                # API endpoints

components/
├── kpi-card.tsx        # Composants KPI
├── alerts-panel.tsx    # Panneaux d'alertes
├── advanced-charts.tsx # Graphiques avancés
├── data-table.tsx      # Tableaux réutilisables
├── performance-metrics.tsx # Metrics et scoring
├── dashboard-extended.tsx  # Section dashboard étendue
├── cabinet-contacts.tsx    # Gestion contacts
└── sidebar.tsx         # Navigation

lib/
├── report-utils.ts     # Utils pour rapports/PDF/CSV
├── format-utils.ts     # Formatting et conversion
└── types.ts            # Types TypeScript

config/
└── kpi-config.ts       # Configuration KPIs

hooks/
└── use-custom.ts       # Hooks réutilisables
```

### Technologie Stack
- **Framework**: Next.js 14+ (React)
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Database**: MongoDB (intégration backend)
- **Authentication**: JWT (existant)

## 🚀 Démarrage rapide

### Installation
```bash
npm install
# ou
pnpm install
```

### Démarrage dev
```bash
npm run dev
# ou
pnpm dev
```

Accédez à `http://localhost:3000`

### Build production
```bash
npm run build
npm start
```

## 📱 Pages et Routes

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Dashboard | Vue d'ensemble générale |
| `/analyses` | Analyses Globales | Comparatif cabinets |
| `/cabinets` | Gestion Clients | Liste et overview cabinets |
| `/cabinet/[id]` | Détail Cabinet | Analyses détaillées cabinet |
| `/rapports` | Rapports | Gestion rapports générés |
| `/consultations` | Consultations | Analyse consultations |
| `/patients` | Patients | Gestion patients |
| `/settings` | Paramètres | Configuration |

## 🔌 API Endpoints

### GET endpoints
- `/api/analyses` - Données d'analyses globales
- `/api/rapports` - Liste des rapports
- `/api/consultations` - Données consultations
- `/api/cabinets` - Liste des cabinets

### POST endpoints
- `/api/rapports` - Générer nouveau rapport
- `/api/emails/send` - Envoyer rapport par email
- `/api/exports` - Exporter données

## 🎨 Thème et Styling

### Couleurs principales
- **Dark bg**: `#030712`
- **Card bg**: `#090E1A`
- **Primary**: `#3b82f6` (Blue)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Orange)
- **Danger**: `#ef4444` (Red)

### Composants réutilisables
- Card, Badge, Button, Input (Shadcn/ui)
- KPICard, DataTable, PerformanceMetric (custom)
- MultiLineChart, DonutChart (Recharts)

## 📊 KPIs et Métriques suivies

### Principaux KPIs
- Chiffre d'affaires (CA) total et horaire
- Nombre de patients (nouveaux, traités, agenda)
- Montant et taux d'acceptation des devis
- Score de consultation (IA)
- Heures travaillées et heures HP
- Taux de rapports envoyés
- Taux d'absence

### Seuils de performance
- **Excellent**: >85%
- **Bon**: 75-85%
- **À surveiller**: 60-75%
- **Danger**: <60%

## 📤 Export et Rapports

### Formats supportés
- PDF (rapport complet avec graphiques)
- CSV (données tabulaires)
- JSON (données brutes)

### Génération de rapports
```typescript
// Générer un rapport PDF
const pdf = await generatePDF("Cabinet Name", data)

// Exporter en CSV
exportToCSV(cabinetsData, "cabinets_export")

// Envoyer par email
sendEmailReport("email@cabinet.fr", "Cabinet Name", pdfUrl)
```

## 🔒 Sécurité

- Authentification JWT requise
- Autorisations par rôle
- CSRF protection
- SQL injection prevention (MongoDB)
- XSS protection via Sanitization

## 📝 Données Mock

Toutes les pages utilisent des données mock pour démonstration. Pour intégrer avec une vraie base de données:

1. Remplacer les données mock dans les routes par appels à DB
2. Mettre à jour les API endpoints pour connecter MongoDB
3. Implémenter la validation des données

## 🛠️ Outils et Utilitaires

### Format Utils
```typescript
formatCurrency(1000)           // "1 000 €"
formatPercentage(0.87)         // "87,0%"
formatDate(new Date())         // "13/01/2026"
getStatusLabel(92)             // "Performant"
```

### Report Utils
```typescript
generatePDF(name, data)        // Génère PDF
exportToCSV(data, filename)    // Export CSV
sendEmailReport(email, name, url) // Envoyer email
```

### Hooks Custom
```typescript
usePagination(items, 10)       // Gestion pagination
useFilters(items)              // Gestion filtres
useSorting(items)              // Gestion tri
useAsync(asyncFn)              // Gestion données async
useForm(initialValues)         // Gestion formulaires
```

## 📱 Responsive Design

- Mobile first approach
- Grid responsive (1 à 4 colonnes selon écran)
- Tableaux scrollables sur mobile
- Modals adaptés

## 🔄 Mise à jour des données

- Bouton "Mettre à jour" sur dashboard
- Auto-refresh des graphiques
- Cache client avec localStorage
- Synchronisation avec backend

## 📈 Performance

- Code splitting automatique
- Image optimization
- Lazy loading des composants
- Memoization des calculs coûteux
- Pagination pour gros datasets

## 🐛 Troubleshooting

### Graphiques ne s'affichent pas
- Vérifier que Recharts est installé: `npm install recharts`
- Vérifier dimensions du container

### Données ne se chargent pas
- Vérifier l'authentification
- Vérifier les API endpoints
- Consulter la console du navigateur

### Styling incorrect
- Vérifier Tailwind config
- Vérifier les classes CSS
- Vider cache du navigateur

## 📚 Documentation supplémentaire

- `MODIFICATIONS_2026.md` - Détail des modifications apportées
- `config/kpi-config.ts` - Configuration des KPIs
- `lib/report-utils.ts` - Utilitaires rapports
- `lib/format-utils.ts` - Utilitaires formatting

## 🤝 Contribution

Les contributions sont bienvenues! Veuillez:
1. Fork le projet
2. Créer une branche feature
3. Commit vos changements
4. Push la branche
5. Ouvrir une Pull Request

## 📄 Licence

Propriété de EFFICIENCE ANALYTICS - Tous droits réservés

## 📞 Support

Pour toute question ou problème:
- Email: support@efficience-analytics.fr
- Slack: #efficience-support
- Docs: https://docs.efficience-analytics.fr

---

**Version**: 1.0  
**Date**: 13 janvier 2026  
**Dernière mise à jour**: 13/01/2026
