// components/ai-report-generator.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Zap, Download, Copy, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReportData {
  cabinetName: string;
  cabinetData: any;
  period: string;
}

interface GeneratedReport {
  report: string;
  predictions: any;
  recommendations: any;
  generatedAt: string;
}

interface AIReportGeneratorProps {
  data: ReportData;
  onReportGenerated?: (report: GeneratedReport) => void;
}

export function AIReportGenerator({ data, onReportGenerated }: AIReportGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [copied, setCopied] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/report-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cabinetName: data.cabinetName,
          cabinetData: data.cabinetData,
          period: data.period,
        }),
      });

      if (!response.ok) throw new Error('Erreur génération rapport');

      const result = await response.json();
      setReport(result.data);
      onReportGenerated?.(result.data);
      toast('Rapport généré avec succès');
    } catch (error) {
      toast('Erreur lors de la génération du rapport');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (report) {
      await navigator.clipboard.writeText(report.report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast('Rapport copié');
    }
  };

  const handleDownload = async () => {
    if (report) {
      const element = document.createElement('a');
      const file = new Blob([report.report], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `rapport-${data.cabinetName}-${data.period}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast('Rapport téléchargé');
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white gap-2"
      >
        <Zap size={16} />
        Générer avec IA
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rapport IA - {data.cabinetName}</DialogTitle>
          </DialogHeader>

          {!report ? (
            <div className="space-y-6 py-6">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Rapport IA Premium</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Générez un rapport complet alimenté par l'IA incluant :
                </p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Résumé exécutif personnalisé</li>
                  <li>Analyse détaillée de la performance</li>
                  <li>Prédictions IA pour la période suivante</li>
                  <li>Recommandations stratégiques priorisées</li>
                  <li>Plan d'action opérationnel</li>
                  <li>KPIs critiques à surveiller</li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <p className="text-sm text-amber-900">
                  ⏱️ <strong>Durée estimée:</strong> 10-15 secondes
                </p>
              </div>

              <Button
                onClick={generateReport}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 h-11"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin mr-2" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Zap size={16} className="mr-2" />
                    Générer le rapport IA
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-6">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy size={16} className="mr-2" />
                  {copied ? 'Copié!' : 'Copier'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download size={16} className="mr-2" />
                  Télécharger
                </Button>
                <Button variant="outline" size="sm" onClick={() => setReport(null)}>
                  <RefreshCw size={16} className="mr-2" />
                  Régénérer
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-[500px] overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  {report.report.split('\n').map((line, idx) => {
                    if (line.startsWith('###')) {
                      return (
                        <h3 key={idx} className="text-lg font-bold mt-4 mb-2">
                          {line.replace('###', '').trim()}
                        </h3>
                      );
                    }
                    if (line.startsWith('##')) {
                      return (
                        <h2 key={idx} className="text-xl font-bold mt-6 mb-3">
                          {line.replace('##', '').trim()}
                        </h2>
                      );
                    }
                    if (line.startsWith('#')) {
                      return (
                        <h1 key={idx} className="text-2xl font-black mt-8 mb-4">
                          {line.replace('#', '').trim()}
                        </h1>
                      );
                    }
                    if (line.startsWith('-')) {
                      return (
                        <li key={idx} className="ml-4">
                          {line.replace('-', '').trim()}
                        </li>
                      );
                    }
                    if (line.trim()) {
                      return (
                        <p key={idx} className="text-sm text-gray-800 mb-2">
                          {line}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                <p className="text-xs text-green-800">
                  ✓ Rapport généré le {new Date(report.generatedAt).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
