'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface RealisationData {
  praticien: string;
  mois: string;
  nbPatients: number;
  montantFacture: number;
  montantEncaisse: number;
}

interface JoursData {
  praticien: string;
  mois: string;
  nbHeures: number;
  [key: string]: string | number;
}

interface RdvData {
  praticien: string;
  mois: string;
  nbRdv: number;
  dureeTotale: number;
  nbPatients: number;
  nbNouveaux: number;
}

export function AnalysisPanel() {
  const [realisation, setRealisation] = useState<RealisationData[]>([]);
  const [jours, setJours] = useState<JoursData[]>([]);
  const [rdv, setRdv] = useState<RdvData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [realisationRes, joursRes, rdvRes] = await Promise.all([
          fetch('/api/analysis/realisation'),
          fetch('/api/analysis/jours'),
          fetch('/api/analysis/rdv'),
        ]);

        if (realisationRes.ok) setRealisation(await realisationRes.json().then(d => d.realisation));
        if (joursRes.ok) setJours(await joursRes.json().then(d => d.jours));
        if (rdvRes.ok) setRdv(await rdvRes.json().then(d => d.rdv));
      } catch (error) {
        console.error('Failed to fetch analysis data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-8">Chargement des données...</div>;

  // Agrégation par praticien pour les graphiques
  const realisationByPraticien = realisation.reduce((acc, item) => {
    const existing = acc.find(r => r.praticien === item.praticien);
    if (existing) {
      existing.montantFacture += item.montantFacture;
      existing.montantEncaisse += item.montantEncaisse;
      existing.nbPatients += item.nbPatients;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, [] as RealisationData[]);

  const joursPerPraticien = jours.reduce((acc, item) => {
    const existing = acc.find(j => j.praticien === item.praticien);
    if (existing) {
      existing.nbHeures += item.nbHeures;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, [] as JoursData[]);

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Réalisation par praticien */}
        <Card>
          <CardHeader>
            <CardTitle>Réalisation Financière</CardTitle>
            <CardDescription>Montants facturés vs encaissés par praticien</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={realisationByPraticien}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="praticien" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="montantFacture" fill="#3b82f6" name="Facturé" />
                <Bar dataKey="montantEncaisse" fill="#10b981" name="Encaissé" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Jours ouverts (heures) */}
        <Card>
          <CardHeader>
            <CardTitle>Jours Ouverts</CardTitle>
            <CardDescription>Nombre d'heures travaillées par praticien</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={joursPerPraticien}
                  dataKey="nbHeures"
                  nameKey="praticien"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {joursPerPraticien.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* RDV Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rendez-vous</CardTitle>
          <CardDescription>Détail des consultations par praticien</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Praticien</th>
                  <th className="px-4 py-2 text-left">Mois</th>
                  <th className="px-4 py-2 text-center">NB RDV</th>
                  <th className="px-4 py-2 text-center">Durée (min)</th>
                  <th className="px-4 py-2 text-center">Patients</th>
                  <th className="px-4 py-2 text-center">Nouveaux</th>
                </tr>
              </thead>
              <tbody>
                {rdv.slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-semibold">{item.praticien}</td>
                    <td className="px-4 py-2">{item.mois}</td>
                    <td className="px-4 py-2 text-center">{item.nbRdv}</td>
                    <td className="px-4 py-2 text-center">{item.dureeTotale}</td>
                    <td className="px-4 py-2 text-center">{item.nbPatients}</td>
                    <td className="px-4 py-2 text-center text-green-600 font-semibold">{item.nbNouveaux}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stats générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Facturé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {realisation.reduce((sum, r) => sum + r.montantFacture, 0).toFixed(2)} €
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Encaissé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {realisation.reduce((sum, r) => sum + r.montantEncaisse, 0).toFixed(2)} €
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Patients Traités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {realisation.reduce((sum, r) => sum + r.nbPatients, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total RDV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {rdv.reduce((sum, r) => sum + r.nbRdv, 0)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
