# 🚀 Guide de Démarrage Rapide - EFFICIENCE ANALYTICS

## 1. Installation des dépendances manquantes

```bash
npm install jspdf html2canvas
npm install recharts@^2.10.0
```

## 2. Vérifier que tout fonctionne

```bash
npm run dev
```

Puis ouvrez :
- **Dashboard Analyses** : http://localhost:3000/analyses
- **Gestion Clients** : http://localhost:3000/cabinets
- **Rapports** : http://localhost:3000/rapports
- **Consultations** : http://localhost:3000/consultations
- **Détail Cabinet** : http://localhost:3000/cabinet/1

## 3. Intégration MongoDB (URGENT pour données réelles)

### 3.1 Créer votre connexion MongoDB

Éditez [app/api/cabinets/route.ts](app/api/cabinets/route.ts) :

```typescript
import { connectDB } from "@/lib/db"

export async function GET() {
  await connectDB()
  const cabinets = await Cabinet.find()
  return Response.json(cabinets)
}
```

### 3.2 Variables d'environnement

Créez `.env.local` :
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/efficience
DATABASE_NAME=efficience
```

## 4. Configuration des rapports PDF

### 4.1 Utiliser la générationPDF

```typescript
import { generatePDF } from "@/lib/report-utils"

const pdf = await generatePDF({
  title: "Rapport Cabinet",
  data: cabinetData,
  fileName: "rapport_cabinet.pdf"
})
```

### 4.2 Email (optionnel)

```typescript
import { sendEmailReport } from "@/lib/report-utils"

await sendEmailReport({
  to: "doctor@cabinet.fr",
  subject: "Votre rapport mensuel",
  cabinetName: "Cabinet Dentaire A",
  reportData: data
})
```

## 5. Fichiers clés créés

### Pages
- ✅ [app/analyses/page.tsx](app/analyses/page.tsx) - Analyses globales
- ✅ [app/rapports/page.tsx](app/rapports/page.tsx) - Gestion rapports
- ✅ [app/consultations/page.tsx](app/consultations/page.tsx) - Consultations
- ✅ [app/cabinets/page.tsx](app/cabinets/page.tsx) - Liste clients
- ✅ [app/cabinet/[id]/page.tsx](app/cabinet/[id]/page.tsx) - Détail cabinet

### Composants réutilisables
- ✅ [components/kpi-card.tsx](components/kpi-card.tsx) - Cartes KPI
- ✅ [components/advanced-charts.tsx](components/advanced-charts.tsx) - Graphiques avancés
- ✅ [components/data-table.tsx](components/data-table.tsx) - Tables avec export
- ✅ [components/performance-metrics.tsx](components/performance-metrics.tsx) - Métriques

### Utilities
- ✅ [lib/report-utils.ts](lib/report-utils.ts) - Génération rapports/PDF/CSV
- ✅ [lib/format-utils.ts](lib/format-utils.ts) - Formatage données
- ✅ [config/kpi-config.ts](config/kpi-config.ts) - Configuration KPIs
- ✅ [hooks/use-custom.ts](hooks/use-custom.ts) - 10 custom hooks

### Documentation
- ✅ [MODIFICATIONS_2026.md](MODIFICATIONS_2026.md) - Changelog détaillé
- ✅ [README_ANALYTICS.md](README_ANALYTICS.md) - Guide complet

## 6. Structures de données attendues

### Cabinet
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  score: number,
  status: "excellent" | "bon" | "attention" | "critique",
  ca: number,
  caPerHour: number,
  trend: number,
  newPatients: number,
  consultations: number,
  rapport: {
    unsent: number,
    sent: number,
    generated: number
  }
}
```

### Rapport
```typescript
{
  _id: ObjectId,
  cabinetId: ObjectId,
  date: Date,
  type: "mensuel" | "trimestriel" | "annuel",
  status: "sent" | "generated" | "unsent",
  data: any,
  createdAt: Date
}
```

## 7. Checklist d'intégration

- [ ] Installer dépendances manquantes : `npm install jspdf html2canvas`
- [ ] Tester pages avec données mock : `npm run dev`
- [ ] Connecter MongoDB aux API routes
- [ ] Configurer variables d'environnement
- [ ] Tester export PDF/CSV
- [ ] Configurer email (optionnel)
- [ ] Déployer sur Vercel/serveur

## 8. Besoin d'aide ?

📖 Consultez :
- [README_ANALYTICS.md](README_ANALYTICS.md) - Architecture complète
- [MODIFICATIONS_2026.md](MODIFICATIONS_2026.md) - Détail de chaque fichier
- Code dans [app/](app/) et [components/](components/)

## 9. Problèmes courants

### "ReferenceError: React is not defined"
→ Ajoutez `"use client"` au top du fichier

### "Chart not rendering"
→ Assurez-vous que `ResponsiveContainer` enveloppe le chart
→ Vérifiez que les données ne sont pas vides

### "Export to CSV failing"
→ Utilisez la fonction `generateCSVContent()` de [lib/format-utils.ts](lib/format-utils.ts)

---

**Commencez par tester les pages avec `npm run dev`, puis intégrez MongoDB progressivement.** 🎉
