// hooks/use-ai.ts
import { useState, useCallback } from 'react';

interface CabinetData {
  id: string;
  nom: string;
  caActuel: number;
  caObjectif: number;
  nouveauxPatients: number;
  absences: number;
  devisEnvoyes: number;
  devisConvertis: number;
  traitements: Array<{
    nom: string;
    nombre: number;
  }>;
  periodicite: string;
}

interface PredictionResult {
  caPredit: number;
  tauxConversion: number;
  patientsPrevus: number;
  riskFactors: string[];
  confidence: number;
}

interface RecommendationResult {
  recommendations: string[];
  urgency: 'critical' | 'high' | 'medium' | 'low';
  actionPlan: Array<{
    action: string;
    impact: string;
    deadline: string;
  }>;
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPredictions = useCallback(async (data: CabinetData): Promise<PredictionResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erreur récupération prédictions');

      const result = await response.json();
      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur prédictions IA';
      setError(message);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecommendations = useCallback(
    async (data: CabinetData): Promise<RecommendationResult | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Erreur récupération recommandations');

        const result = await response.json();
        return result.data.recommendations;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur recommandations IA';
        setError(message);
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generateReport = useCallback(
    async (
      cabinetName: string,
      cabinetData: CabinetData,
      period: string
    ): Promise<string | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai/report-generator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cabinetName,
            cabinetData,
            period,
          }),
        });

        if (!response.ok) throw new Error('Erreur génération rapport');

        const result = await response.json();
        return result.data.report;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur rapport IA';
        setError(message);
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const analyzeCabinet = useCallback(async (data: CabinetData): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.details || errorData?.error || 'Erreur API analyse cabinet';
        console.error('Erreur API:', errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result.data.analysis;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur analyse IA';
      setError(message);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getPredictions,
    getRecommendations,
    generateReport,
    analyzeCabinet,
  };
}
