"use client"
import React, { useEffect, useState } from 'react'
import { useApp } from "@/context/AppContext"
import { Users, CreditCard, Calendar, MapPin } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const { patients } = useApp()
  const [stats, setStats] = useState({ totalPatients: 0, chiffreAffaires: 0, rdvToday: 0 })
  const [graphData, setGraphData] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:5001/api/dashboard-stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats)
          setGraphData(data.graphData)
        }
      })
  }, [patients])

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">Tableau de Bord Cabinet</h1>

      {/* CARTES STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Patients" value={stats.totalPatients} icon={<Users className="text-blue-600"/>} />
        <StatCard title="Chiffre d'Affaires" value={`${stats.chiffreAffaires} €`} icon={<CreditCard className="text-emerald-600"/>} />
        <StatCard title="RDV du Jour" value={stats.rdvToday} icon={<Calendar className="text-purple-600"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GRAPHIQUE - COURBE D'EVOLUTION */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold mb-6 text-slate-800">Flux de Patients</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Line type="monotone" dataKey="rdv" stroke="#2563eb" strokeWidth={4} dot={{ r: 6, fill: '#2563eb' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GOOGLE MAPS CORRIGÉE */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
            <MapPin className="text-rose-500" size={20} /> Localisation du Cabinet
          </h2>
          <div className="h-[300px] w-full rounded-2xl overflow-hidden bg-slate-100">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.292292615674389!3d48.85837007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca979a741c941!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1647524567234!5m2!1sfr!2sfr"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm flex justify-between items-center border border-slate-100">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
      </div>
      <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center">{icon}</div>
    </div>
  )
}