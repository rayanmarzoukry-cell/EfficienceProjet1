# 📊 Guide des Nouvelles Fonctionnalités Admin

## 🎯 Vue d'ensemble

Le système admin a été transformé en une **plateforme complète de gestion des données** avec 4 onglets principaux :

### 1. 🏠 **Onglet Accueil (Overview)**
- Affiche les statistiques clés du système
- Boutons d'accès rapide pour les principales tâches
- État du système (serveur, base de données)
- Nombre total de patients, cabinets et rendez-vous

### 2. 📥 **Onglet Importation (Import)**
- **Importation sécurisée de fichiers CSV/Excel**
- Interface Drag & Drop intuitive
- Support de 3 types de ressources:
  - **Patients**: Importation en masse de patient(es)
  - **Cabinets**: Importation en masse de cabinets
  - **Rendez-vous**: Importation en masse de rendez-vous
- Affichage de l'aperçu du fichier
- Rapport détaillé après l'importation (succès/erreurs)

### 3. 📋 **Onglet Audit (Audit Log)**
- **Journal complet de toutes les opérations admin**
- Trace chaque importation avec:
  - Email de l'administrateur
  - Type d'opération (importation, création d'admin, etc)
  - Type de ressource affectée
  - Nombre d'enregistrements touchés
  - Informations sur le fichier (nom, taille, nombre de lignes)
  - Statut (succès, erreur, en attente)
  - Horodatage exact
- Affichage en temps réel des opérations
- Tri automatique (opérations les plus récentes en premier)

### 4. 📊 **Onglet Analyses (Analytics/Power BI)**
- **Préparation pour l'intégration Power BI**
- Statut de readiness des données
- Guide étape par étape (6 étapes) pour configurer Power BI
- Détails de connexion MongoDB:
  - Cluster: `efficienceprojet`
  - Collections disponibles: patients, cabinets, rendezvous, audit_logs
  - Chaîne de connexion
- Placeholder pour l'intégration d'un dashboard Power BI embedded
- Instructions pour créer des rapports sophistiqués

---

## 🚀 Guide d'Utilisation

### Importer des données

#### 1️⃣ Accédez à l'interface d'importation
```
Cliquez sur l'onglet "Importation" → Zone Drag & Drop
```

#### 2️⃣ Préparez votre fichier CSV
Le fichier doit contenir les colonnes appropriées:

**Pour les patients:**
```csv
name,email,phone,dateRDV,type,status,cabinetId
Jean Doe,jean@example.com,0123456789,2026-01-20,consultation,confirmé,cabinet-001
```

**Pour les cabinets:**
```csv
nom,adresse,ville,telephone,email,directeur
Cabinet Dentaire Paris,123 Rue de Paris,Paris,0123456789,contact@cabinet.fr,Dr. Dupont
```

**Pour les rendez-vous:**
```csv
id,patientId,cabinetId,date,time,type,status,notes
rdv-001,patient-001,cabinet-001,2026-01-20,09:00,consultation,confirmé,Premier RDV
```

#### 3️⃣ Déposez votre fichier
- **Drag & Drop**: Glissez-déposez directement sur la zone
- **Sélection manuelle**: Cliquez pour ouvrir le sélecteur de fichiers

#### 4️⃣ Sélectionnez le type de ressource
Choisissez dans le dropdown ce que vous importez

#### 5️⃣ Cliquez sur "Importer"
Le système va:
- Parser le fichier CSV
- Valider chaque ligne
- Créer ou mettre à jour les enregistrements (upsert)
- Créer un journal d'audit automatiquement

#### 6️⃣ Consultez les résultats
- ✅ Nombre de succès
- ❌ Nombre d'erreurs
- 📝 Messages d'erreur détaillés si problèmes

---

## 🔒 Sécurité & Verrous Invisibles

Le système implémente **3 verrous invisibles** pour garder l'utilisateur comme point central:

### Verrou 1: Accès (Access Lock)
- ✅ Page de login `/admin/login`
- Seul l'admin avec les bonnes credentials accède au tableau de bord
- Credentials par défaut:
  - Email: `admin@efficience-dentaire.fr`
  - Mot de passe: `Efficience2026!`

### Verrou 2: API (API Lock)
- ✅ Tous les endpoints sont sécurisés par JWT
- Token stocké en localStorage
- Durée: 24 heures
- Pas de token = pas d'accès aux données

### Verrou 3: Importation (Import Lock)
- ✅ L'interface d'importation est le seul point d'entrée pour les mises à jour en masse
- L'équipe ne peut pas modifier les données directement
- Chaque import crée automatiquement un journal d'audit
- L'utilisateur reste le gatekeeper des données

---

## 📋 Journal d'Audit (Audit Log)

### Informations tracées
Chaque opération enregistre:

| Champ | Description |
|-------|-------------|
| `adminEmail` | Email de l'administrateur qui a effectué l'opération |
| `action` | Type d'opération (import_data, create_admin, etc) |
| `resource` | Type de ressource (patients, cabinets, rendezvous) |
| `status` | Résultat (success, error, pending) |
| `recordsAffected` | Nombre d'enregistrements traités |
| `fileInfo` | Nom, taille et nombre de lignes du fichier |
| `errorMessage` | Détails des erreurs si applicable |
| `ipAddress` | Adresse IP de l'administrateur |
| `userAgent` | Info du navigateur |
| `timestamp` | Date/heure exacte de l'opération |

### Requêtes et filtrage

**Via l'interface (Onglet Audit):**
- Affichage automatique des 50 opérations les plus récentes
- Statut visuellement codé par couleur (vert=succès, rouge=erreur)
- Affichage détaillé des informations du fichier

**Via API (`/api/admin/audit`):**

```bash
# Récupérer les 100 derniers logs
GET /api/admin/audit?limit=100

# Filtrer par action
GET /api/admin/audit?action=import_data

# Filtrer par email
GET /api/admin/audit?adminEmail=admin@efficience-dentaire.fr
```

---

## 🧮 Préparation Power BI

### État actuel
- ✅ **Données disponibles**: MongoDB pleinement peuplée
- ⏳ **Power BI**: En préparation
- 🔌 **Connexion**: Prête à être configurée

### 6 étapes pour configurer Power BI

1. **Ouvrir Power BI Desktop**
   - Télécharger depuis Microsoft

2. **Obtenir les données MongoDB**
   - Menu "Obtenir les données" → MongoDB
   - Entrer la chaîne de connexion fournie

3. **Sélectionner les collections**
   - patients
   - cabinets
   - rendezvous
   - audit_logs

4. **Transformer les données**
   - Créer des colonnes calculées
   - Fusionner les tables si nécessaire

5. **Créer des visualisations**
   - Graphiques de performance
   - Tableaux de tendances
   - Indicateurs KPI

6. **Publier sur le Web**
   - Publier le rapport Power BI
   - Obtenir le lien d'intégration
   - Mettre à jour l'onglet Analyses avec l'iframe

### Détails de connexion MongoDB

```
Cluster: efficienceprojet
Base de données: efficience
Collections:
  - patients
  - cabinets
  - rendezvous
  - audit_logs
  - admins

Chaîne de connexion:
mongodb+srv://<username>:<password>@efficienceprojet.mongodb.net/efficience
```

---

## 🛠️ Modèles de données pour importation

### 1. Patients

```typescript
interface Patient {
  name: string              // Nom du patient
  email: string            // Email unique
  phone?: string           // Téléphone
  dateRDV?: string        // Date du RDV (YYYY-MM-DD)
  type?: string           // Type de consultation
  status?: string         // Statut (confirmé, en attente, annulé)
  cabinetId?: string      // ID du cabinet
}
```

### 2. Cabinets

```typescript
interface Cabinet {
  nom: string              // Nom du cabinet
  adresse?: string         // Adresse
  ville?: string           // Ville
  telephone?: string       // Téléphone
  email?: string           // Email
  directeur?: string       // Nom du directeur
}
```

### 3. Rendez-vous (Rendezvous)

```typescript
interface RendezVous {
  id?: string              // ID unique
  patientId?: string       // ID du patient
  cabinetId?: string       // ID du cabinet
  date?: string           // Date (YYYY-MM-DD)
  time?: string           // Heure (HH:MM)
  type?: string           // Type de consultation
  status?: string         // Statut
  notes?: string          // Notes supplémentaires
}
```

---

## 📈 Statistiques et Monitoring

### Dans l'onglet Accueil
- Nombre total de patients
- Nombre total de cabinets
- Nombre total de rendez-vous
- État du serveur (en ligne/hors ligne)
- État de la base de données

### Dans l'onglet Analyses
- Placement pour les KPIs Power BI
- Métriques de performance
- Tendances et prévisions

---

## 🔧 Dépannage

### Le fichier ne s'importe pas
- Vérifiez que le CSV est au bon format
- Assurez-vous que les colonnes correspondent
- Vérifiez que le type de ressource est sélectionné

### L'audit log ne montre rien
- Vérifiez que vous êtes connecté
- Essayez de rafraîchir la page
- Vérifiez la console du navigateur pour les erreurs

### Power BI n'apparaît pas
- C'est normal ! La section est en préparation
- Suivez les 6 étapes pour configurer votre rapport
- Une fois configuré, copiez l'iframe d'intégration dans le composant

---

## 📞 Support

Pour toute question sur:
- **Importation**: Consultez ce guide ou l'interface
- **Audit**: Tous les détails sont disponibles dans l'onglet Audit
- **Power BI**: Suivez le guide étape par étape dans l'onglet Analyses
- **Erreurs**: Vérifiez les messages d'erreur détaillés après chaque opération

---

**Créé**: 2026-01-14  
**Système**: Efficience Analytics Admin v2.0  
**Version**: Phase 4 - Complete
