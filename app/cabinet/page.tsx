"use client"

import React, { useState, useMemo } from "react"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import { 
  Calendar as CalendarIcon, Clock, ChevronLeft, 
  Plus, Trash2, X, UserPlus, CheckCircle2 
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { useApp } from "@/context/AppContext"
import { useRouter } from 'next/navigation'

export default function CabinetPage() {
  // On récupère uniquement ce qui est disponible dans votre AppContext
  const { patients, addPatient, deletePatient } = useApp()
  const router = useRouter()
  
  const [modalMode, setModalMode] = useState<"edit" | "add" | null>(null)
  const [targetPatient, setTargetPatient] = useState<any>(null)
  const [newDateTime, setNewDateTime] = useState({ date: "", time: "" })
  const [formData, setFormData] = useState({ name: "", phone: "", time: "", type: "CONTRÔLE" })

  // Transformation des données pour l'affichage calendrier
  const events = useMemo(() => {
    return (patients || []).map((p: any) => ({
      id: p.id,
      title: p.name,
      start: `${p.dateRDV}T${p.time}`,
      backgroundColor: p.type === 'CHIRURGIE' ? '#dc2626' : p.type === 'SOINS' ? '#059669' : '#2563eb',
      extendedProps: { ...p }
    }))
  }, [patients])

  // CORRECTION DE L'ERREUR : Logique de mise à jour alternative
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (targetPatient && newDateTime.date) {
      // 1. On supprime l'ancien
      deletePatient(targetPatient.id)
      
      // 2. On ajoute le nouveau avec les dates modifiées
      addPatient({
        ...targetPatient,
        dateRDV: newDateTime.date,
        time: newDateTime.time
      })
      
      setModalMode(null)
    }
  }

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault()
    addPatient({
      id: Date.now().toString(),
      name: formData.name.toUpperCase(),
      phone: formData.phone,
      dateRDV: new Date().toISOString().split('T')[0],
      time: formData.time,
      type: formData.type,
      initial: formData.name.charAt(0).toUpperCase()
    })
    setModalMode(null)
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex text-slate-900">
      <Sidebar />
      <main className="flex-1 p-10 space-y-8 text-left">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <h1 className="text-2xl font-black text-slate-900 uppercase italic">Planning Cabinet</h1>
          </div>
          <Button onClick={() => setModalMode("add")} className="h-14 px-8 rounded-2xl bg-blue-600 text-white font-black uppercase text-[10px] gap-2 border-none">
            <Plus size={18} /> Nouveau RDV
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Stats de gauche */}
          <div className="col-span-3 space-y-6">
            <Card className="rounded-[2.5rem] p-8 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
               <h3 className="font-black uppercase text-[9px] tracking-widest mb-4 text-blue-400">Taux d'occupation</h3>
               <div className="text-5xl font-black italic tracking-tighter mb-2">
                {Math.min(100, Math.round(((patients?.length || 0) / 10) * 100))}%
               </div>
               <CheckCircle2 size={120} className="absolute -right-8 -bottom-8 text-white/5 transform -rotate-12" />
            </Card>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase mb-6 flex items-center gap-2">
                <Clock size={14} className="text-blue-600"/> Aujourd'hui
              </h3>
              <div className="space-y-4">
                {(patients || []).slice(0, 3).map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase">{p.name}</span>
                    <Badge className="bg-slate-50 text-slate-400 border-none text-[8px]">{p.time}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Planning Calendrier */}
          <div className="col-span-9 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
              locales={[frLocale]}
              locale="fr"
              events={events}
              slotMinTime="08:00:00"
              slotMaxTime="19:00:00"
              allDaySlot={false}
              height="650px"
              eventClick={(info) => {
                setTargetPatient(info.event.extendedProps);
                setNewDateTime({ date: info.event.extendedProps.dateRDV, time: info.event.extendedProps.time });
                setModalMode("edit");
              }}
            />
          </div>
        </div>
      </main>

      {/* Modale Edition/Report */}
      {modalMode === "edit" && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
          <Card className="w-full max-w-md bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border-none">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <h3 className="font-black italic uppercase text-sm">Modifier : {targetPatient?.name}</h3>
              <X onClick={() => setModalMode(null)} className="cursor-pointer" />
            </div>
            <form onSubmit={handleUpdate} className="p-10 space-y-6 text-left">
              <Input type="date" value={newDateTime.date} required className="h-14 rounded-xl bg-slate-50 border-none font-bold" onChange={e => setNewDateTime({...newDateTime, date: e.target.value})} />
              <Input type="time" value={newDateTime.time} required className="h-14 rounded-xl bg-slate-50 border-none font-bold" onChange={e => setNewDateTime({...newDateTime, time: e.target.value})} />
              <Button type="submit" className="w-full h-14 rounded-xl bg-blue-600 text-white font-black uppercase text-[10px] border-none">Confirmer le report</Button>
            </form>
          </Card>
        </div>
      )}

      {/* Modale Ajout Rapide */}
      {modalMode === "add" && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
          <Card className="w-full max-w-lg bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border-none">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <h3 className="font-black italic uppercase text-sm flex items-center gap-2"><UserPlus size={18}/> Nouveau RDV</h3>
              <X onClick={() => setModalMode(null)} className="cursor-pointer" />
            </div>
            <form onSubmit={handleQuickAdd} className="p-10 space-y-6 text-left">
              <Input required placeholder="NOM DU PATIENT" className="h-14 rounded-xl bg-slate-50 border-none font-bold uppercase" onChange={e => setFormData({...formData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Input required type="time" className="h-14 rounded-xl bg-slate-50 border-none font-bold" onChange={e => setFormData({...formData, time: e.target.value})} />
                <select className="h-14 rounded-xl bg-slate-50 border-none font-bold px-4" onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="CONTRÔLE">CONTRÔLE</option>
                  <option value="SOINS">SOINS</option>
                  <option value="CHIRURGIE">CHIRURGIE</option>
                </select>
              </div>
              <Button type="submit" className="w-full h-14 rounded-xl bg-blue-600 text-white font-black uppercase text-[10px] border-none shadow-lg">Ajouter au planning</Button>
            </form>
          </Card>
        </div>
      )}

      <style jsx global>{`
        .fc { --fc-border-color: #f1f5f9; font-family: inherit; }
        .fc .fc-toolbar-title { font-size: 1.1rem !important; font-weight: 900 !important; text-transform: uppercase; color: #1e293b; }
        .fc-event { border-radius: 8px !important; border: none !important; padding: 4px 8px !important; font-weight: 800 !important; font-size: 10px !important; cursor: pointer; }
      `}</style>
    </div>
  )
}