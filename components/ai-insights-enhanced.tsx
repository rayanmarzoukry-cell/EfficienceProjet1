// components/ai-insights-enhanced.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Lightbulb, TrendingUp, Zap, RefreshCw } from 'lucide-react';

interface RecommendationResult {
  recommendations: string[];
  urgency: 'critical' | 'high' | 'medium' | 'low';
  actionPlan: {
    action: string;
    impact: string;
    deadline: string;
  }[];
}

interface AIInsightsEnhancedProps {
  cabinetId: string;
  cabinetName: string;
  cabinetData: any;
}

export function AIInsightsEnhanced({ cabinetId, cabinetName, cabinetData }: AIInsightsEnhancedProps) {
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cabinetData),
      });

      if (!response.ok) throw new Error('Erreur API');

      const result = await response.json();
      setRecommendations(result.data.recommendations);
    } catch (err) {
      setError('Impossible de charger les recommandations IA');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [cabinetId]);

  const urgencyColor = {
    critical: 'bg-red-50 border-red-200',
    high: 'bg-orange-50 border-orange-200',
    medium: 'bg-yellow-50 border-yellow-200',
    low: 'bg-green-50 border-green-200',
  };

  const urgencyBadgeColor = {
    critical: 'bg-red-600',
    high: 'bg-orange-600',
    medium: 'bg-yellow-600',
    low: 'bg-green-600',
  };

  const urgencyIcon = {
    critical: <AlertCircle className="text-red-600" size={18} />,
    high: <Zap className="text-orange-600" size={18} />,
    medium: <TrendingUp className="text-yellow-600" size={18} />,
    low: <Lightbulb className="text-green-600" size={18} />,
  };

  if (!recommendations) return null;

  return (
    <Card className={`p-6 rounded-[2rem] border shadow-md ${urgencyColor[recommendations.urgency]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {urgencyIcon[recommendations.urgency]}
          <div>
            <h3 className="font-black uppercase text-xs tracking-widest text-slate-700">
              Recommandations IA
            </h3>
            <p className="text-xs text-slate-600 mt-1">Basé sur l'analyse de vos données</p>
          </div>
        </div>
        <Badge className={`${urgencyBadgeColor[recommendations.urgency]} text-white`}>
          {recommendations.urgency.toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        {recommendations.recommendations.slice(0, 3).map((rec, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
            <p className="text-sm text-slate-700">{rec}</p>
          </div>
        ))}
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-gray-300 space-y-4">
          <h4 className="font-bold text-sm text-slate-800">Plan d'action prioritaire:</h4>
          {recommendations.actionPlan.map((plan, idx) => (
            <div key={idx} className="bg-white bg-opacity-50 p-3 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-sm text-slate-800">{plan.action}</p>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{plan.deadline}</span>
              </div>
              <p className="text-xs text-slate-600">{plan.impact}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-xs"
        >
          {expanded ? 'Réduire' : 'Voir le plan d\'action'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchRecommendations}
          disabled={loading}
          className="text-xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Rafraîchir
        </Button>
      </div>

      {error && (
        <p className="text-xs text-red-600 mt-3">{error}</p>
      )}
    </Card>
  );
}
