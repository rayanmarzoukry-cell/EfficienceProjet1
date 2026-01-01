// components/RendezVousWidget.tsx (et autres widgets)
"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

// CORRECTION DE L'IMPORT : Utilisez l'alias @/data/
import { rdvData } from "@/data/rendezvous"


export default function RendezVousWidget() {
  return (
    <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <CardTitle className="text-sm font-black flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" /> RENDEZ-VOUS
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-3xl font-black text-slate-900">{rdvData.total}</div>
        <p className="text-xs text-slate-500 font-bold uppercase mt-1">
          Taux de présence : {rdvData.tauxPresence}%
        </p>
      </CardContent>
    </Card>
  )
}