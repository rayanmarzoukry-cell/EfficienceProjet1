"use client"

import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Interface alignée sur le Dashboard
interface DailyFlowMetrics {
  date: string;
  patients: number;
}

// Nom logique : PatientFlowChart
export default function PatientFlowChart({ data }: { data: DailyFlowMetrics[] }) {
  return (
    /* IMPORTANT : On utilise h-full ici pour qu'il remplisse le conteneur 
       parent h-[350px] défini dans le dashboard
    */
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data} 
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#f1f5f9" 
          />
          
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
            dy={10}
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
          />
          
          <Tooltip 
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          />
          
          <Area 
            type="monotone" 
            dataKey="patients" 
            stroke="#3b82f6" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorBlue)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}