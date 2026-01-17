# 📚 GUIDE: Insérer les données dans MongoDB

## 🎯 Résumé rapide

**AVANT (sans MongoDB):**
```
Données → Hardcodées dans le code → Affichées directement
```

**MAINTENANT (avec MongoDB):**
```
Données → Insérées dans MongoDB → Application récupère → Affichées
```

---

## 📊 Les 2 Approches

### ✅ OPTION 1: Via MongoDB Compass (PLUS FACILE)

**Avantage:** Interface graphique facile, pas besoin de code

**Étapes:**

1. **Ouvre MongoDB Compass**
   - Connexion déjà configurée (tu vois les screenshots)
   - Base: `efficience-db`
   - Collection: `kpiresults`

2. **Ajoute une collection si elle n'existe pas**
   - Clique "+ Create collection"
   - Nom: `kpiresults`

3. **Insère les documents**
   - Clique "Insert Document"
   - Copie ce JSON:

```json
[
  {
    "cabinetName": "Dr Mocanu",
    "caActuel": 45000,
    "caObjectif": 55000,
    "volumePatients": 342,
    "performanceMoyenne": 82,
    "rapportsGenerés": 156,
    "emailsEnvoyes": 142,
    "absences": 2
  },
  {
    "cabinetName": "Dr Bresdin",
    "caActuel": 52000,
    "caObjectif": 60000,
    "volumePatients": 287,
    "performanceMoyenne": 87,
    "rapportsGenerés": 142,
    "emailsEnvoyes": 128,
    "absences": 1
  }
]
```

4. **Clique "Insert"** → ✅ Données dans MongoDB!

---

### ⚡ OPTION 2: Via l'Application (Facile aussi!)

**Avantage:** Un clic dans l'appli, c'est automatisé

**Étapes:**

1. **Assure-toi que Next.js tourne:**
   ```bash
   npm run dev
   # Doit dire: Ready in X.Xs
   ```

2. **Va à cette URL:**
   ```
   http://localhost:3001/admin/seed-data
   ```

3. **Clique le bouton "Importer les données"**
   - Automatiquement insère 5 cabinets dans MongoDB

4. **Vérification:**
   - Ouvre MongoDB Compass
   - Tu dois voir 5 documents dans `kpiresults`

---

## 🔄 Comment ça marche?

### **Avant (sans MongoDB - Hardcodé):**

```typescript
// app/dashboard/page.tsx
export default function Dashboard() {
  const stats = {
    caActuel: 52000,        // 🔴 Codé en dur
    volumePatients: 342,    // 🔴 Codé en dur
    performanceMoyenne: 87  // 🔴 Codé en dur
  };
  
  return <div>{stats.caActuel}</div>;
  // ✅ Affiche: 52000
}
```

### **Maintenant (avec MongoDB - Dynamique):**

```typescript
// app/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // 1️⃣ Appelle l'API
    fetch('/api/stats')
      // 2️⃣ L'API récupère de MongoDB
      // 3️⃣ Retourne les données
      .then(r => r.json())
      // 4️⃣ Affiche les données
      .then(data => setStats(data[0]));
  }, []);

  return <div>{stats?.caActuel}</div>;
  // ✅ Affiche: 52000 (depuis MongoDB)
}
```

---

## 📁 Structure MongoDB

**Base de données:** `efficience-db`

**Collection:** `kpiresults`

**Document exemple:**
```json
{
  "_id": ObjectId("..."),
  "cabinetName": "Dr Mocanu",
  "caActuel": 45000,           ← CA actuel
  "caObjectif": 55000,         ← Objectif
  "volumePatients": 342,       ← Nombre patients
  "performanceMoyenne": 82,    ← Performance (%)
  "rapportsGenerés": 156,      ← Rapports
  "emailsEnvoyes": 142,        ← Emails
  "absences": 2,               ← Absences
  "dateCreation": ISODate(...)
}
```

---

## ✅ Vérification que ça marche

**Après avoir inséré les données:**

1. **MongoDB Compass:**
   - Ouvre `efficience-db` → `kpiresults`
   - Tu dois voir 5 documents (5 cabinets)

2. **Dashboard:**
   - Va à http://localhost:3001/dashboard
   - Au lieu de "undefined €", tu dois voir les vrais chiffres
   - Les KPIs doivent afficher les données

3. **API de test:**
   - Va à http://localhost:3001/api/stats
   - Tu dois voir du JSON avec les données

---

## 🚨 Troubleshooting

**Q: Les données ne s'affichent pas?**
```
1. Ouvre MongoDB Compass
2. Clique "efficience-db" → "kpiresults"
3. Tu dois voir les documents
4. Si vide: Refais l'import (Option 1 ou 2)
```

**Q: "undefined €" sur le dashboard?**
```
1. Vérifie que MongoDB a les données (Compass)
2. Vérifie que MONGODB_URI est dans .env.local
3. Redémarre Next.js: Ctrl+C puis npm run dev
4. Attends 5 secondes et recharge la page
```

**Q: Comment modifier les données?**
```
1. Via MongoDB Compass: Double-clique le document et édite
2. Via API: Crée un endpoint PUT (on peut le faire après)
```

---

## 🎯 Résumé des différences

| Aspect | AVANT (Sans MongoDB) | MAINTENANT (Avec MongoDB) |
|--------|------|--------|
| **Stockage** | Hardcodé dans le code | Stocké dans MongoDB |
| **Modification** | Édite le code et redémarre | Modifie via Compass, instantané |
| **Multiple cabinets** | ❌ Difficile | ✅ Facile (juste ajouter des docs) |
| **Persistance** | ❌ Réinitialise si tu supprimes le code | ✅ Sauvegardé même si tu redémarres |
| **Scalabilité** | ❌ Limité | ✅ Illimité |

---

## 📝 Prochaines étapes

1. **Importe les données** (Option 1 ou 2)
2. **Vérifie dans MongoDB Compass**
3. **Recharge le Dashboard**
4. **Les données doivent s'afficher!** 🎉

Dis-moi si ça marche ou si tu as des questions! 🚀
