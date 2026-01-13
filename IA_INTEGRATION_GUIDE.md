# 🤖 Intégration IA - Guide Complet

## 📋 Vue d'ensemble

EFFICIENCE ANALYTICS intègre maintenant une **infrastructure IA complète** basée sur **Claude 3.5 Sonnet** (OpenAI) pour :

✅ **Prédictions** - CA, patients, taux de conversion
✅ **Recommandations** - Actions concrètes et priorisées  
✅ **Génération de rapports** - Rapports intelligents et formatés
✅ **Analyses de cabinet** - Insights professionnels

---

## 🔧 Configuration Requise

### 1. **Installer OpenAI SDK**

```bash
npm install openai
```

### 2. **Configurer la clé API OpenAI**

Créez un fichier `.env.local` à la racine du projet :

```env
OPENAI_API_KEY=sk-proj-your-api-key-here
```

Obtenez votre clé sur : https://platform.openai.com/api-keys

### 3. **Vérifier l'installation**

```bash
npm run dev
```

Le serveur devrait démarrer sans erreurs.

---

## 📚 Architecture IA

### Service Central (`lib/openai-service.ts`)

Le service `openai-service.ts` exporte 4 fonctions principales :

#### 1️⃣ **generatePredictions(data)**

**Génère des prédictions basées sur les données du cabinet**

```typescript
import { generatePredictions } from '@/lib/openai-service';

const predictions = await generatePredictions({
  id: 'cabinet-1',
  nom: 'Cabinet Dr. Martin',
  caActuel: 45000,
  caObjectif: 50000,
  nouveauxPatients: 12,
  absences: 2,
  devisEnvoyes: 15,
  devisConvertis: 9,
  traitements: [
    { nom: 'Détartrage', nombre: 25 },
    { nom: 'Dévitalisation', nombre: 8 },
  ],
  periodicite: 'mois',
});

// Résultat :
{
  caPredit: 49500,           // CA prédit pour la prochaine période
  tauxConversion: 68,        // Taux de conversion devis→réalisation
  patientsPrevus: 14,        // Nouveaux patients prévus
  riskFactors: [],           // Facteurs de risque identifiés
  confidence: 92             // Confiance de la prédiction (0-100)
}
```

#### 2️⃣ **generateRecommendations(data, prediction)**

**Génère des recommandations stratégiques**

```typescript
import { generateRecommendations } from '@/lib/openai-service';

const recommendations = await generateRecommendations(cabinetData, predictions);

// Résultat :
{
  recommendations: [
    "Augmenter le taux de conversion devis en améliorant le suivi...",
    "Mettre en place un système d'alerte pour les absences...",
    // ... 3 autres recommandations
  ],
  urgency: "high",           // 'critical' | 'high' | 'medium' | 'low'
  actionPlan: [
    {
      action: "Audit des devis perdus",
      impact: "+10-15% conversion",
      deadline: "1 semaine"
    },
    // ... autres actions
  ]
}
```

#### 3️⃣ **generateReportWithAI(cabinetName, data, prediction, recommendations, period)**

**Génère un rapport complet formaté en markdown**

```typescript
const report = await generateReportWithAI(
  'Cabinet Dr. Martin',
  cabinetData,
  predictions,
  recommendations,
  'Décembre 2025'
);

// Retourne un markdown avec :
// - Résumé exécutif
// - Analyse de la performance
// - Insights IA et tendances
// - Plan d'action détaillé
// - KPIs à suivre
// - Conclusions
```

#### 4️⃣ **analyzeCabinet(data)**

**Analyse rapide d'un cabinet en détail**

```typescript
const analysis = await analyzeCabinet(cabinetData);

// Retourne une analyse de 3-4 paragraphes avec :
// - Points forts identifiés
// - Points d'amélioration critiques
// - Insights pratiques (20 ans d'expertise)
// - 3 actions immédiates recommandées
```

---

## 🔌 API Endpoints

### `POST /api/ai/predictions`

**Obtient les prédictions pour un cabinet**

```bash
curl -X POST http://localhost:3002/api/ai/predictions \
  -H "Content-Type: application/json" \
  -d '{
    "id": "cabinet-1",
    "nom": "Cabinet Dr. Martin",
    "caActuel": 45000,
    "caObjectif": 50000,
    ...
  }'
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "caPredit": 49500,
    "tauxConversion": 68,
    ...
  },
  "timestamp": "2025-01-13T10:30:00Z"
}
```

### `POST /api/ai/recommendations`

**Obtient prédictions + recommandations**

```bash
curl -X POST http://localhost:3002/api/ai/recommendations \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

### `POST /api/ai/report-generator`

**Génère un rapport complet avec IA**

```bash
curl -X POST http://localhost:3002/api/ai/report-generator \
  -H "Content-Type: application/json" \
  -d '{
    "cabinetName": "Cabinet Dr. Martin",
    "cabinetData": { ... },
    "period": "Décembre 2025"
  }'
```

### `POST /api/ai/analyze`

**Analyse rapide d'un cabinet**

```bash
curl -X POST http://localhost:3002/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

---

## 🎨 Composants UI IA

### 1. **AIReportGenerator**

**Génère un rapport avec une interface modale**

```tsx
import { AIReportGenerator } from '@/components/ai-report-generator';

<AIReportGenerator
  data={{
    cabinetName: 'Cabinet Dr. Martin',
    cabinetData: { /* données cabinet */ },
    period: 'Décembre 2025',
  }}
  onReportGenerated={(report) => {
    console.log('Rapport généré:', report);
  }}
/>
```

**Fonctionnalités:**
- Aperçu du rapport dans une modale
- Copier le rapport
- Télécharger en .txt
- Régénérer le rapport

### 2. **AIInsightsEnhanced**

**Affiche les recommandations avec niveau d'urgence**

```tsx
import { AIInsightsEnhanced } from '@/components/ai-insights-enhanced';

<AIInsightsEnhanced
  cabinetId="cabinet-1"
  cabinetName="Cabinet Dr. Martin"
  cabinetData={{
    /* données du cabinet */
  }}
/>
```

**Affiche:**
- Recommandations principales (top 3)
- Badge d'urgence (critical/high/medium/low)
- Plan d'action détaillé (expandable)
- Bouton de rafraîchissement

---

## 🪝 Hook personnalisé

### `useAI()`

**Fournit l'accès à toutes les fonctionnalités IA**

```tsx
import { useAI } from '@/hooks/use-ai';

export function MonComposant() {
  const { loading, error, getPredictions, getRecommendations, generateReport, analyzeCabinet } = useAI();

  const handleAnalyze = async () => {
    const predictions = await getPredictions(cabinetData);
    const recommendations = await getRecommendations(cabinetData);
    const report = await generateReport('Cabinet', cabinetData, 'Décembre 2025');
    const analysis = await analyzeCabinet(cabinetData);
  };

  return (
    <>
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Chargement...' : 'Analyser'}
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </>
  );
}
```

---

## 📊 Intégrations Actuelles

### ✅ Page Rapports (`/rapports`)

- Bouton **"Générer avec IA"** pour créer un rapport intelligent
- Modale avec aperçu et options de téléchargement
- Inclut prédictions + recommandations

### ✅ Page Analyses (`/analyses`)

- Bouton **"Analyse IA Globale"** pour analyser tous les cabinets
- Insights basés sur les tendances détectées

### ⏳ Futures intégrations suggérées

- **Dashboard**: AIInsightsEnhanced avec recommandations en temps réel
- **Cabinets**: Analyse individuelle par cabinet avec plan d'action
- **Patients**: Prédictions de patients à risque (absences élevées)
- **Alertes**: Notifications basées sur recommandations critiques

---

## 💡 Exemples d'Utilisation

### Exemple 1: Analyse simple d'un cabinet

```tsx
'use client';

import { useState } from 'react';
import { useAI } from '@/hooks/use-ai';

export default function AnalyzeButton() {
  const { loading, error, getPredictions } = useAI();
  const [result, setResult] = useState(null);

  const handleClick = async () => {
    const predictions = await getPredictions({
      id: 'cabinet-1',
      nom: 'Cabinet Test',
      caActuel: 40000,
      caObjectif: 50000,
      nouveauxPatients: 10,
      absences: 3,
      devisEnvoyes: 20,
      devisConvertis: 12,
      traitements: [
        { nom: 'Détartrage', nombre: 30 },
        { nom: 'Détartrage', nombre: 15 },
      ],
      periodicite: 'mois',
    });
    setResult(predictions);
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Analyse en cours...' : 'Analyser'}
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
```

### Exemple 2: Utiliser AIReportGenerator dans une page

```tsx
'use client';

import { AIReportGenerator } from '@/components/ai-report-generator';

export default function RapportsPage() {
  return (
    <div className="p-8">
      <AIReportGenerator
        data={{
          cabinetName: 'Cabinet Dr. Martin',
          cabinetData: {
            id: 'cabinet-1',
            nom: 'Cabinet Dr. Martin',
            caActuel: 45000,
            caObjectif: 50000,
            // ... autres données
          },
          period: 'Décembre 2025',
        }}
      />
    </div>
  );
}
```

---

## 🚀 Performance et Optimisation

### Gestion du cache

L'IA ne doit pas être appelée à chaque render. Utilisez `useCallback` :

```tsx
const { getPredictions } = useAI();
const cachedPredictions = useCallback(() => getPredictions(data), [data, getPredictions]);
```

### Timeouts

Les appels IA peuvent être longs (10-15s). Affichez un loading :

```tsx
{loading && <LoadingSpinner />}
```

### Fallback

Si l'API OpenAI échoue, les fonctions retournent des valeurs par défaut raisonnables.

---

## 🔐 Sécurité

### Points importants :

1. **Ne jamais committer la clé API** - Utilisez `.env.local` (ignoré par git)
2. **Les appels API passent par votre serveur Next.js** - Pas d'appels directs depuis le client
3. **Limitez les appels** - OpenAI facture par token

---

## 📞 Support & Dépannage

### Erreur: "OPENAI_API_KEY not found"

→ Assurez-vous que `.env.local` existe et contient la bonne clé

### Erreur: "Timeout"

→ Les appels IA prennent 10-15s. Attendez plus longtemps ou vérifiez votre connexion

### Erreur: "Invalid API key"

→ Vérifiez que votre clé sur https://platform.openai.com/api-keys est valide

---

## 🎯 Roadmap IA

- [ ] Cache des prédictions (24h)
- [ ] Dashboard temps réel avec recommandations
- [ ] Alertes automatiques (email/SMS)
- [ ] Historique des prédictions vs réalité
- [ ] Modèles d'apprentissage personnalisés
- [ ] Export PDF automatique des rapports

---

**Dernière mise à jour:** 13 janvier 2026

Pour toute question, consultez la documentation OpenAI : https://platform.openai.com/docs
