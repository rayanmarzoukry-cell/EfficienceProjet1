"use client"

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// Données types pour l'analyse de performance
const performanceData = [
  { name: 'Chiffre Affaires', reel: 3540, objectif: 5000 }, // Mis à jour à 3540 pour correspondre à vos 59 patients
  { name: 'Nouv. Patients', reel: 12, objectif: 15 },
  { name: 'Consultations', reel: 85, objectif: 100 },
]

// Nom logique : RevenuePerformanceChart
export default function RevenuePerformanceChart() {
  return (
    /* FIX: On utilise h-full pour remplir le conteneur parent h-[250px] 
       défini dans le dashboard, supprimant l'erreur width/height -1
    */
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={performanceData} 
          barGap={12} 
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#f1f5f9" 
          />
          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
            dy={10}
          />
          
          {/* On garde YAxis masqué pour un design épuré type dashboard IA */}
          <YAxis hide />
          
          <Tooltip 
            cursor={{fill: '#f8fafc'}}
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              fontSize: '11px',
              fontWeight: 'bold'
            }}
          />
          
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="circle" 
            wrapperStyle={{ 
              paddingTop: '30px',
              fontSize: '10px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#64748b'
            }} 
          />
          
          <Bar 
            name="Réalisé" 
            dataKey="reel" 
            fill="#2563eb" 
            radius={[6, 6, 0, 0]} 
            barSize={30} 
            animationDuration={1500}
          />
          
          <Bar 
            name="Objectif" 
            dataKey="objectif" 
            fill="#e2e8f0" 
            radius={[6, 6, 0, 0]} 
            barSize={30} 
            animationDuration={2000}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}