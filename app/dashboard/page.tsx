"use client"

import React, { useState, useEffect } from "react"
import { Users, TrendingUp, Calendar, RefreshCw, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import { useApp } from "@/context/AppContext"

export default function Dashboard() {
  const [mongoData, setMongoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour appeler notre nouvelle API Route
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
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8">
        <h1 className="text-4xl font-black text-slate-900">Tableau de Bord Réel</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* On utilise les champs de votre document MongoDB Atlas */}
          <KPICard 
            title="Volume Patients" 
            value={loading ? "..." : mongoData?.nouveauxPatients || 0} 
            icon={<Users />} 
            color="bg-blue-600" 
          />
          <KPICard 
            title="CA Actuel" 
            value={loading ? "..." : `${mongoData?.caActuel?.toLocaleString()} €`} 
            icon={<TrendingUp />} 
            color="bg-emerald-500" 
          />
          <KPICard 
            title="Objectif" 
            value={loading ? "..." : `${mongoData?.caObjectif?.toLocaleString()} €`} 
            icon={<Calendar />} 
            color="bg-violet-500" 
          />
        </div>

        <button 
          onClick={loadStats}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl flex items-center gap-2"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Actualiser depuis MongoDB
        </button>
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