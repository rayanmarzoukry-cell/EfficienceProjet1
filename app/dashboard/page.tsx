"use client"

import React, { useState, useEffect } from "react"
import { Users, TrendingUp, Calendar, RefreshCw, AlertCircle, Mail, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const [mongoData, setMongoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stats');
      const data = await res.json();
      setMongoData(data);
    } catch (err) {
      console.error("Erreur chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // Données pour les graphiques
  const cabinetData = mongoData?.cabinets || [];
  const mobileChartData = cabinetData.slice(0, 5).map((c: any) => ({
    name: c.nom.split(' ')[0],
    ca: c.caActuel || 0,
  }));

  const scoreData = cabinetData.map((c: any) => ({
    name: c.nom.split(' ')[0],
    score: c.score || 0,
  }));

  const pieData = [
    { name: 'Bon', value: cabinetData.filter((c: any) => c.score >= 85).length, fill: '#10b981' },
    { name: 'Moyen', value: cabinetData.filter((c: any) => c.score >= 75 && c.score < 85).length, fill: '#f59e0b' },
    { name: 'Faible', value: cabinetData.filter((c: any) => c.score < 75).length, fill: '#ef4444' },
  ];

  const today = new Date();
  const monthName = today.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8">
        
        {/* HEADER avec salutation */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Bonjour 👋</h1>
            <p className="text-slate-600 mt-2">Date/Période : Données mises à jour du : 01/01/2026 (Mois d'analyse : Décembre 2025)</p>
          </div>
          <button 
            onClick={loadStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Actualiser
          </button>
        </div>

        {/* SYNTHÈSE GLOBALE */}
        <Card className="bg-white rounded-3xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-slate-900">Synthèse Globale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SynthesisCard 
                icon={<BarChart3 className="text-blue-500" size={24} />}
                title="Cabinets Suivis"
                value={mongoData?.cabinets?.length || 0}
                trend="+2 ce mois"
                bgColor="bg-blue-50"
              />
              <SynthesisCard 
                icon={<Mail className="text-purple-500" size={24} />}
                title="Rapports Générés"
                value={mongoData?.cabinets?.filter((c: any) => c.rapportStatut === 'sent').length || 0}
                trend="ce mois"
                bgColor="bg-purple-50"
              />
              <SynthesisCard 
                icon={<Mail className="text-green-500" size={24} />}
                title="Emails Envoyés"
                value={mongoData?.cabinets?.length * 3 || 0}
                trend="taux ~98%"
                bgColor="bg-green-50"
              />
              <SynthesisCard 
                icon={<TrendingUp className="text-red-500" size={24} />}
                title="Performance Moyenne"
                value="87%"
                trend="+5% vs mois dernier"
                bgColor="bg-red-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* GRAPHIQUES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CA Moyen par Cabinet */}
          <Card className="bg-white rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">CA Moyen par cabinet</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mobileChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ca" stroke="#3b82f6" strokeWidth={2} name="CA (€)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Répartition des Scores */}
          <Card className="bg-white rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">Répartition des Scores</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* ALERTES & NOTIFICATIONS */}
        <Card className="bg-white rounded-3xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Alertes & Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AlertBox 
                title="CA < Objectif"
                count={mongoData?.cabinets?.filter((c: any) => c.caActuel < c.caObjectif).length || 0}
                trend="+2 vs mois dernier"
                bgColor="bg-red-50"
                textColor="text-red-600"
                icon="⚠️"
              />
              <AlertBox 
                title="Absences élevées"
                count={2}
                trend="+2 vs mois dernier"
                bgColor="bg-orange-50"
                textColor="text-orange-600"
                icon="👁️"
              />
              <AlertBox 
                title="Rapports non envoyés"
                count={mongoData?.cabinets?.filter((c: any) => c.rapportStatut !== 'sent').length || 0}
                trend="+2 vs mois dernier"
                bgColor="bg-pink-50"
                textColor="text-pink-600"
                icon="📧"
              />
            </div>
          </CardContent>
        </Card>

        {/* KPI CARDS en bas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard 
            title="Total Patients" 
            value={mongoData?.nouveauxPatients || 0} 
            icon={<Users />} 
            color="bg-blue-600" 
          />
          <KPICard 
            title="CA Total" 
            value={`${(mongoData?.caActuel || 0).toLocaleString()} €`} 
            icon={<TrendingUp />} 
            color="bg-emerald-500" 
          />
          <KPICard 
            title="Objectif Total" 
            value={`${(mongoData?.caObjectif || 0).toLocaleString()} €`} 
            icon={<Calendar />} 
            color="bg-violet-500" 
          />
        </div>

      </main>
    </div>
  )
}

function KPICard({ title, value, icon, color }: any) {
  return (
    <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-white flex items-center gap-6">
      <div className={`p-4 rounded-2xl text-white ${color}`}>{icon}</div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase">{title}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </Card>
  )
}

function SynthesisCard({ icon, title, value, trend, bgColor }: any) {
  return (
    <div className={`${bgColor} p-6 rounded-2xl border-0`}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-sm font-semibold text-slate-700">{title}</span>
      </div>
      <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
      <p className="text-xs text-slate-600">{trend}</p>
    </div>
  )
}

function AlertBox({ title, count, trend, bgColor, textColor, icon }: any) {
  return (
    <div className={`${bgColor} p-6 rounded-2xl border-l-4 border-red-500`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className={`font-bold ${textColor}`}>{title} {icon}</h3>
      </div>
      <p className="text-3xl font-black text-slate-900 mb-1">{count}</p>
      <p className="text-xs text-slate-600">{trend}</p>
    </div>
  )
}