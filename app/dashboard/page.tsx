"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Users, TrendingUp, Calendar, ArrowUpRight, BrainCircuit, FileDown, RefreshCw, BarChart3, FileText, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useApp } from "@/context/AppContext"
import Link from "next/link"

import PatientFlowChart from "@/components/OccupationChart"
import RevenuePerformanceChart from "@/components/ProductionChart"
import AIInsightsPanel from "@/components/RecommendationWidget"

export default function PredictiveAnalyticsDashboard() {
  const { patients } = useApp()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false) // État pour l'animation
  const [flowData, setFlowData] = useState<any[]>([])

  const OBJECTIF_MENSUEL_CA = 8000 

  // Fonction pour générer des données de flux
  const generateFlowData = () => {
    const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven']
    return jours.map(j => ({
      date: j,
      patients: patients?.length ? Math.floor(Math.random() * 15) + 5 : 10
    }))
  }

  useEffect(() => {
    setIsLoaded(true)
    setFlowData(generateFlowData())
  }, [patients])

  // FONCTION DU BOUTON : Mettre à jour
  const handleRefresh = () => {
    setIsRefreshing(true)
    
    // Simulation d'un temps de calcul/chargement de 1.5s
    setTimeout(() => {
      setFlowData(generateFlowData()) // On recalcule les points du graphique
      setIsRefreshing(false)
      console.log("Statistiques synchronisées avec succès")
    }, 1500)
  }

  const kpiMetrics = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]
    const currentRevenue = (patients?.length || 0) * 60
    const progression = Math.min(100, Math.round((currentRevenue / OBJECTIF_MENSUEL_CA) * 100))
    const realAppointmentsToday = (patients || []).filter((p: any) => p.dateRDV === todayStr).length
    const displayFlux = realAppointmentsToday > 0 
      ? realAppointmentsToday 
      : Math.max(1, Math.floor((patients?.length || 0) / 8))

    return {
      patientCount: patients?.length || 0,
      projectedRevenue: currentRevenue,
      dailyAppointments: displayFlux,
      progressionPercent: progression
    }
  }, [patients])

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8 overflow-y-auto text-left">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Tableau de Bord Prédictif</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Analyse des flux en temps réel</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-orange-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="text-[10px] font-black uppercase text-slate-600">
                {isRefreshing ? "Synchronisation..." : "Système d'Analyse Actif"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard title="Volume Patients" value={kpiMetrics.patientCount} icon={<Users />} color="bg-blue-600" />
          <KPICard title="Revenu Prévu" value={`${kpiMetrics.projectedRevenue} €`} icon={<TrendingUp />} color="bg-emerald-500" />
          <KPICard title="Rendez-vous Jour" value={kpiMetrics.dailyAppointments} icon={<Calendar />} color="bg-violet-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 rounded-[2.5rem] border-none shadow-sm bg-white">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-left">Modélisation des Flux</h3>
              <div className="h-[350px] w-full">
                {isLoaded && <PatientFlowChart data={flowData} />}
              </div>
            </Card>

            <Card className="p-8 rounded-[2.5rem] border-none shadow-sm bg-white">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-left">Production vs Objectifs</h3>
              <div className="h-[250px] w-full">
                {isLoaded && <RevenuePerformanceChart />}
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <AIInsightsPanel analysis={isRefreshing ? "Analyse des nouvelles données..." : `Diagnostic : Vous avez complété ${kpiMetrics.progressionPercent}% de l'objectif de ce mois.`} />
            
            <Card className="p-8 rounded-[2.5rem] bg-blue-600 text-white border-none shadow-xl relative overflow-hidden text-left">
              <h3 className="font-black uppercase text-[10px] tracking-widest mb-2 opacity-80 text-left">Taux d'Efficacité</h3>
              <div className="text-4xl font-black italic">94%</div>
              <ArrowUpRight className="absolute top-6 right-6 opacity-20" size={40} />
            </Card>

            <Card className="p-8 rounded-[2.5rem] bg-white border-none shadow-sm text-left">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Suivi de l'Objectif</h3>
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Progression Globale</span>
                  <span className="text-lg font-black text-blue-600">{kpiMetrics.progressionPercent}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000 ease-out" 
                    style={{ width: `${kpiMetrics.progressionPercent}%` }} 
                  />
                </div>
                
                {/* BOUTON OPERATIONNEL */}
                <button 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="w-full mt-4 py-4 bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400 rounded-2xl text-[9px] font-black uppercase flex items-center justify-center gap-2 border-none transition-all shadow-lg"
                >
                  <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                  {isRefreshing ? "Mise à jour..." : "Mettre à jour les statistiques"}
                </button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function KPICard({ title, value, icon, color }: any) {
  return (
    <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-white flex items-center gap-6">
      <div className={`p-4 rounded-2xl text-white ${color}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div className="text-left">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
      </div>
    </Card>
  )
}