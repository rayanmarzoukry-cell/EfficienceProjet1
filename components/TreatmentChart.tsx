import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Couleurs basées sur le design de votre dashboard
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

interface TreatmentProps {
  data: {
    consultations: number;
    soins: number;
    chirurgie: number;
    orthodontie: number;
  };
}

export default function TreatmentChart({ data }: TreatmentProps) {
  // Transformation des données pour Recharts
  const chartData = [
    { name: 'Consultations', value: data.consultations },
    { name: 'Soins', value: data.soins },
    { name: 'Chirurgie', value: data.chirurgie },
    { name: 'Orthodontie', value: data.orthodontie },
  ];

  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
      <h2 className="text-lg font-bold mb-6 text-slate-800">Répartition des Actes</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}