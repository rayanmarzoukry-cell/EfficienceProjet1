// app/admin/seed-data/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function SeedDataPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/seed/kpis', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Erreur lors du seed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800 border-slate-700 p-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            Importer les données dans MongoDB
          </h1>

          <div className="bg-slate-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">📊 Données à importer:</h2>
            <ul className="text-slate-300 space-y-2">
              <li>✅ Dr Mocanu - CA: 45 000€</li>
              <li>✅ Dr Bresdin - CA: 52 000€</li>
              <li>✅ Dr Burnier - CA: 38 000€</li>
              <li>✅ Dr Dick - CA: 41 000€</li>
              <li>✅ Dr Zina - CA: 48 000€</li>
            </ul>
          </div>

          <Button
            onClick={handleSeed}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg mb-6"
          >
            {loading ? (
              <>
                <Loader className="mr-2 animate-spin" size={20} />
                Importation en cours...
              </>
            ) : (
              'Importer les données'
            )}
          </Button>

          {result && (
            <div className="bg-green-900 border border-green-600 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="text-green-400 mr-3" size={24} />
                <h3 className="text-lg font-bold text-green-300">{result.message}</h3>
              </div>
              <p className="text-green-200 text-sm">
                Cabinets insérés: {result.cabinets?.join(', ')}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-900 border border-red-600 rounded-lg p-6">
              <div className="flex items-center">
                <AlertCircle className="text-red-400 mr-3" size={24} />
                <p className="text-red-300 font-semibold">{error}</p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-700">
            <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase">ÉTAPES:</h3>
            <ol className="text-slate-400 space-y-3 text-sm">
              <li>
                <strong>1.</strong> Clique le bouton "Importer les données" ci-dessus
              </li>
              <li>
                <strong>2.</strong> Les données seront insérées dans MongoDB
              </li>
              <li>
                <strong>3.</strong> Va à{' '}
                <a href="/dashboard" className="text-blue-400 hover:underline">
                  Dashboard
                </a>{' '}
                pour voir les données
              </li>
              <li>
                <strong>4.</strong> Ouvre MongoDB Compass pour vérifier les données
              </li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}
