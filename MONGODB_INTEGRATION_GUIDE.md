# 📚 Guide MongoDB - Comment utiliser et mettre à jour les données

## 🎯 Concept Clé : URL vs Application

Vous utilisez **l'URL de MongoDB Cloud** (pas d'application locale) :
```
MONGODB_URI=mongodb+srv://maarzoukrayan3_db_user:izNTKZc05Sj43687@cluster0.xdxmgov.mongodb.net/efficience-db
```

Cette URL se connecte directement au serveur MongoDB dans le cloud. Vous n'avez rien à installer localement !

---

## 📋 Workflow Complet

### **1️⃣ INITIALISER LA BASE (UNE SEULE FOIS)**

Remplissez MongoDB avec les données de départ :

```bash
# Assurez-vous que les packages sont installés
npm install

# Exécutez le script de seed (remplissage initial)
npx ts-node scripts/seed-mongodb.ts
```

**Ce que ça fait :**
- ✅ Crée 5 cabinets
- ✅ Crée 5 patients
- ✅ Crée 5 rendez-vous
- ✅ Affiche les confirmations

---

### **2️⃣ LANCER L'APPLICATION**

```bash
npm run dev
```

Accédez à : http://localhost:3000

**Flux de données :**
```
NextJS App → API Routes (/api/patients, /api/cabinets) → MongoDB Cloud
                    ↑
          Récupère les vraies données
```

---

### **3️⃣ COMPRENDRE LE FLUX DE DONNÉES**

#### **Le chemin des données :**

```
┌──────────────────┐
│  Navigateur      │ (votre app à http://localhost:3000)
└─────────┬────────┘
          │ fetch('/api/patients')
          ↓
┌──────────────────────────────┐
│  NextJS API Route            │ (/app/api/patients/route.ts)
│  - initializeApp()           │
│  - Patient.find()            │
└─────────┬────────────────────┘
          │ requête MongoDB
          ↓
┌──────────────────────────────┐
│  MongoDB Cloud               │ (votre base de données)
│  - collection 'patients'     │
│  - collection 'cabinets'     │
└──────────────────────────────┘
```

---

### **4️⃣ AJOUTER MANUELLEMENT UN PATIENT**

**Option A : Directement via l'API (avec cURL ou Postman)**

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nouveau Patient",
    "dateRDV": "2026-01-20",
    "time": "14:00",
    "type": "DÉTARTRAGE",
    "status": "ATTENTE",
    "cabinetId": "1"
  }'
```

**Option B : Créer une interface UI**

Dans votre app, ajouter un formulaire qui fait un POST à `/api/patients`.

---

### **5️⃣ METTRE À JOUR LES DONNÉES**

Pour modifier un patient existant, créez une API PUT :

**Fichier : `app/api/patients/[id]/route.ts`**

```typescript
import { initializeApp } from '@/lib/db';
import Patient from '@/models/Patient';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await initializeApp();
    
    const body = await request.json();
    const updatedPatient = await Patient.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );

    return Response.json(updatedPatient, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

### **6️⃣ SUPPRIMER UN PATIENT**

Ajoutez une API DELETE :

**Fichier : `app/api/patients/[id]/route.ts`** (ajouter à PUT)

```typescript
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await initializeApp();
    
    await Patient.findByIdAndDelete(params.id);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
```

---

## 📊 Structure des Collections MongoDB

### **Collection: cabinets**
```json
{
  "_id": ObjectId,
  "id": 1,
  "nom": "Cabinet Dr. Martin",
  "email": "dr.martin@cabinet.fr",
  "score": 92,
  "statut": "performant",
  "caActuel": 45000,
  "caObjectif": 40000,
  "trend": "+3%",
  "createdAt": Date
}
```

### **Collection: patients**
```json
{
  "_id": ObjectId,
  "name": "Jean Dupont",
  "dateRDV": Date,
  "time": "09:00",
  "type": "CONTRÔLE",
  "status": "PRESENT",
  "cabinetId": "1",
  "createdAt": Date
}
```

### **Collection: rendezvous**
```json
{
  "_id": ObjectId,
  "patientId": ObjectId,
  "cabinetId": "1",
  "dateRDV": Date,
  "type": "DÉTARTRAGE",
  "status": "COMPLETED",
  "duration": 30,
  "createdAt": Date
}
```

---

## 🔧 Vérifier que MongoDB fonctionne

### **Méthode 1 : Via MongoDB Atlas (Interface Web)**
1. Allez sur https://www.mongodb.com/cloud/atlas
2. Connectez-vous avec votre compte
3. Cliquez sur votre cluster "Cluster0"
4. Allez dans "Collections" → "efficience-db"
5. Vous verrez vos données !

### **Méthode 2 : Tester l'API dans le navigateur**

Ouvrez : http://localhost:3000/api/patients

Vous devriez voir du JSON avec vos patients.

---

## 🚨 Troubleshooting

### Erreur : "MONGODB_URI n'est pas défini"
→ Vérifiez que `.env.local` existe à la racine du projet

### Erreur : "Connection timeout"
→ Votre IP n'est pas whitelistée. Allez dans MongoDB Atlas et ajoutez 0.0.0.0/0

### Les données ne s'affichent pas
→ Exécutez `npx ts-node scripts/seed-mongodb.ts` pour remplir les données

### Impossible de faire le seed
→ Installez TypeScript : `npm install -D typescript @types/node ts-node`

---

## ✅ Checklist Intégration

- [ ] `.env.local` avec MONGODB_URI configuré
- [ ] Models créés (Patient.ts, Cabinet.ts, RendezVous.ts)
- [ ] API routes créées (/api/patients, /api/cabinets, /api/rendezvous)
- [ ] Script seed exécuté (`npx ts-node scripts/seed-mongodb.ts`)
- [ ] AppContext mis à jour pour récupérer depuis `/api/patients`
- [ ] `npm run dev` fonctionne sans erreurs
- [ ] Données visibles à http://localhost:3000/api/patients

---

## 📞 Prochaines étapes

1. **Créer les routes API pour CRUD complet** (PUT, DELETE)
2. **Créer des formulaires UI** pour ajouter/modifier les données
3. **Connecter les KPI** pour calculer statistiques depuis MongoDB
4. **Mettre à jour les graphiques** pour afficher les vraies données
