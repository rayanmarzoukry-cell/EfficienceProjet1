import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CabinetData {
  id: string;
  nom: string;
  caActuel: number;
  caObjectif: number;
  nouveauxPatients: number;
  absences: number;
  devisEnvoyes: number;
  devisConvertis: number;
  traitements: {
    nom: string;
    nombre: number;
  }[];
  periodicite: string; 
}

export interface PredictionResult {
  caPredit: number;
  tauxConversion: number;
  patientsPrevus: number;
  riskFactors: string[];
  confidence: number;
}

export interface RecommendationResult {
  recommendations: string[];
  urgency: 'critical' | 'high' | 'medium' | 'low';
  actionPlan: {
    action: string;
    impact: string;
    deadline: string;
  }[];
}

export async function generatePredictions(data: CabinetData): Promise<PredictionResult> {
  const prompt = `Tu es un expert en gestion de cabinets dentaires.
Données du cabinet: ${data.nom}
- CA actuel: ${data.caActuel}€
- CA objectif: ${data.caObjectif}€
- Nouveaux patients: ${data.nouveauxPatients}
- Absences: ${data.absences}
- Devis convertis: ${data.devisConvertis}/${data.devisEnvoyes}
Réponds UNIQUEMENT en JSON:
{
  "caPredit": <nombre>,
  "tauxConversion": <0-100>,
  "patientsPrevus": <nombre>,
  "riskFactors": ["facteur1"],
  "confidence": <0-100>
}`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '';
    return JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim());
  } catch (error) {
    return { caPredit: data.caActuel, tauxConversion: 50, patientsPrevus: 10, riskFactors: [], confidence: 50 };
  }
}

export async function generateRecommendations(data: CabinetData, prediction: PredictionResult): Promise<RecommendationResult> {
  const gap = ((data.caObjectif - prediction.caPredit) / data.caObjectif) * 100;
  const prompt = `Génère des recommandations pour ce cabinet dentaire (Écart objectif: ${gap.toFixed(1)}%).
Réponds UNIQUEMENT en JSON:
{
  "recommendations": ["string"],
  "urgency": "critical|high|medium|low",
  "actionPlan": [{"action": "string", "impact": "string", "deadline": "string"}]
}`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    const content = response.choices[0]?.message?.content || '';
    return JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim());
  } catch (error) {
    return { recommendations: ['Améliorer le suivi'], urgency: 'medium', actionPlan: [] };
  }
}