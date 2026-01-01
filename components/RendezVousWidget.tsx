"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, User, ChevronRight } from "lucide-react"

// Données fictives basées sur votre planning
const upcomingRDV = [
  { id: 1, patient: "PATIENT 47", heure: "11:15", type: "CONTRÔLE" },
  { id: 2, patient: "PATIENT 49", heure: "11:15", type: "SOINS" },
  { id: 3, patient: "PATIENT 53", heure: "11:15", type: "CHIRURGIE" },
]

export default function RendezVousWidget() {
  return (
    <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="pb-2 border-b border-slate-50">
        <CardTitle className="text-sm font-black flex justify-between items-center">
          <span className="flex items-center gap-2 text-slate-800">
            <Clock className="w-4 h-4 text-blue-600" /> Prochains RDV
          </span>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px]">
            Aujourd'hui
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-50">
          {upcomingRDV.map((rdv) => (
            <div 
              key={rdv.id} 
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">{rdv.patient}</p>
                  <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> {rdv.heure}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md tracking-tighter">
                  {rdv.type}
                </span>
                <ChevronRight size={14} className="text-slate-300" />
              </div>
            </div>
          ))}
        </div>
        <button className="w-full py-4 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 transition-colors border-t border-slate-50">
          Voir tout le planning
        </button>
      </CardContent>
    </Card>
  )
}