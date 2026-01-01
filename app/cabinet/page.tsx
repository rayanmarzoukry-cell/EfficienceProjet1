"use client"

import React, { useState, useMemo } from "react"
import { 
  Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, 
  Plus, Calendar, Trash2, X, UserPlus, CheckCircle2 
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { useApp } from "@/context/AppContext"

export default function CabinetPage() {
  const { patients, updatePatientDate, deletePatient, addPatient } = useApp()
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  const [modalMode, setModalMode] = useState<"edit" | "add" | null>(null)
  const [targetPatient, setTargetPatient] = useState<any>(null)
  
  const [newDateTime, setNewDateTime] = useState({ date: "", time: "" })
  const [formData, setFormData] = useState({ name: "", phone: "", time: "", type: "CONTRÔLE" })

  // --- GÉNÉRATION DE LA SEMAINE ---
  const weekDays = useMemo(() => {
    const days = []
    const startOfWeek = new Date(selectedDate)
    startOfWeek.setDate(selectedDate.getDate() - 3)
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }, [selectedDate])

  // --- FORMATAGE DE LA DATE LOCALE ---
  const dateStr = useMemo(() => {
    const y = selectedDate.getFullYear()
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const d = String(selectedDate.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }, [selectedDate])

  // --- FILTRAGE + TRI PAR HEURE ---
  const appointments = useMemo(() => {
    const filtered = patients?.filter((p: any) => p.dateRDV === dateStr) || []
    // TRI CHRONOLOGIQUE (Ex: 08:30 avant 14:00)
    return filtered.sort((a: any, b: any) => a.time.localeCompare(b.time))
  }, [patients, dateStr])

  // --- ACTIONS ---
  const changeDay = (date: Date) => setSelectedDate(date)

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (targetPatient && newDateTime.date) {
      updatePatientDate(targetPatient.id, newDateTime.date, newDateTime.time)
      setModalMode(null)
    }
  }

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`
    addPatient({
      id: uniqueId,
      name: formData.name.toUpperCase(),
      phone: formData.phone,
      dateRDV: dateStr,
      time: formData.time,
      type: formData.type,
      initial: formData.name.charAt(0).toUpperCase()
    })
    setModalMode(null)
    setFormData({ name: "", phone: "", time: "", type: "CONTRÔLE" })
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex text-slate-900">
      <Sidebar />
      <main className="flex-1 p-10 space-y-8">
        
        {/* HEADER & TIMELINE */}
        <div className="bg-white p-8 rounded-[3.5rem] shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6 text-left">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                <CalendarIcon size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">Agenda du jour</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                  {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
            <Button onClick={() => changeDay(new Date())} variant="outline" className="rounded-xl font-black uppercase text-[10px] tracking-widest border-slate-100 h-12 px-6 hover:bg-slate-50">
              Aujourd'hui
            </Button>
          </div>

          <div className="flex justify-between items-center gap-4 bg-slate-50 p-4 rounded-[2rem] border border-slate-100">
            {weekDays.map((date, i) => {
              const isSelected = date.toDateString() === selectedDate.toDateString()
              return (
                <button
                  key={i}
                  onClick={() => changeDay(date)}
                  className={`flex-1 py-4 rounded-[1.5rem] flex flex-col items-center transition-all ${
                    isSelected ? 'bg-white shadow-lg scale-105 border border-blue-100' : 'hover:bg-white/50'
                  }`}
                >
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                    {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </span>
                  <span className={`text-xl font-black italic ${isSelected ? 'text-slate-900' : 'text-slate-300'}`}>
                    {date.getDate()}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-4 text-left">
            <div className="flex justify-between items-center px-6">
               <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Planning de la journée</h2>
               <Badge className="bg-blue-600 text-white border-none font-black text-[10px] px-4 py-1 rounded-full">{appointments.length} PATIENTS</Badge>
            </div>

            {appointments.length > 0 ? appointments.map((apt: any, idx: number) => (
              <Card key={apt.id || `apt-${idx}`} className="p-6 rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all group bg-white border-l-4 border-l-transparent hover:border-l-blue-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center justify-center w-20 h-20 bg-slate-50 rounded-3xl group-hover:bg-blue-600 transition-colors">
                      <Clock size={16} className="text-slate-300 group-hover:text-blue-200 mb-1" />
                      <span className="font-black text-lg group-hover:text-white">{apt.time}</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-black italic uppercase text-xl text-slate-900 tracking-tighter">{apt.name}</h3>
                      <div className="flex gap-3 items-center">
                        <Badge variant="outline" className="text-[9px] font-black uppercase border-slate-100 text-slate-400">{apt.type}</Badge>
                        <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{apt.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <Button onClick={() => { setTargetPatient(apt); setNewDateTime({date: apt.dateRDV, time: apt.time}); setModalMode("edit"); }} className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border-none hover:bg-blue-600 hover:text-white">
                      <Calendar size={18} />
                    </Button>
                    <Button onClick={() => deletePatient(apt.id)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 border-none hover:bg-red-500 hover:text-white">
                      <Trash2 size={18}/>
                    </Button>
                  </div>
                </div>
              </Card>
            )) : (
              <div className="py-24 flex flex-col items-center opacity-20 gap-4 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <CalendarIcon size={64} />
                <p className="font-black italic uppercase text-sm tracking-widest text-slate-900">Aucun patient programmé</p>
              </div>
            )}
          </div>

          <div className="col-span-4 space-y-6">
            <Card className="rounded-[3rem] p-8 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden text-left">
               <div className="relative z-10">
                 <h3 className="font-black italic uppercase text-[10px] tracking-widest mb-6 text-blue-400">Taux d'occupation</h3>
                 <div className="text-6xl font-black italic tracking-tighter mb-2">
                  {Math.min(100, Math.round((appointments.length / 10) * 100))}%
                 </div>
                 <div className="h-3 bg-slate-800 rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${Math.min(100, (appointments.length / 10) * 100)}%` }} />
                 </div>
                 <p className="text-[9px] text-slate-500 mt-6 uppercase font-bold tracking-[0.2em]">Objectif : 10 patients / jour</p>
               </div>
               <div className="absolute -right-10 -bottom-10 text-slate-800/50 transform -rotate-12">
                 <CheckCircle2 size={160} />
               </div>
            </Card>

            <Button onClick={() => setModalMode("add")} className="w-full h-24 rounded-[2.5rem] bg-white border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 hover:shadow-xl transition-all font-black uppercase text-[10px] tracking-[0.2em] flex flex-col gap-2 justify-center items-center group">
              <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              Nouveau Rendez-vous
            </Button>
          </div>
        </div>
      </main>

      {/* MODALE REPORTER RDV */}
      {modalMode === "edit" && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
          <Card className="w-full max-w-md bg-white rounded-[3.5rem] overflow-hidden shadow-2xl text-left border-none">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black italic uppercase tracking-widest text-sm">Modifier la date</h3>
                <p className="text-[9px] text-slate-400 uppercase font-bold mt-1">Patient : {targetPatient?.name}</p>
              </div>
              <X onClick={() => setModalMode(null)} className="cursor-pointer text-slate-500 hover:text-white transition-colors" />
            </div>
            <form onSubmit={handleUpdate} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Date du report</label>
                <Input type="date" value={newDateTime.date} required className="h-16 rounded-2xl bg-slate-50 border-none font-bold text-lg" onChange={e => setNewDateTime({...newDateTime, date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nouvel Horaire</label>
                <Input type="time" value={newDateTime.time} required className="h-16 rounded-2xl bg-slate-50 border-none font-bold text-lg" onChange={e => setNewDateTime({...newDateTime, time: e.target.value})} />
              </div>
              <Button type="submit" className="w-full h-16 rounded-2xl bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest border-none hover:bg-slate-900 shadow-lg shadow-blue-200 transition-all">
                Confirmer le report
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* MODALE AJOUT RAPIDE */}
      {modalMode === "add" && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
          <Card className="w-full max-w-lg bg-white rounded-[3.5rem] overflow-hidden shadow-2xl text-left border-none">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><UserPlus size={18} /></div>
                <h3 className="font-black italic uppercase tracking-widest text-sm">Admission Express</h3>
              </div>
              <X onClick={() => setModalMode(null)} className="cursor-pointer text-slate-500 hover:text-white transition-colors" />
            </div>
            <form onSubmit={handleQuickAdd} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Identité</label>
                <Input required placeholder="NOM ET PRÉNOM DU PATIENT" className="h-16 rounded-2xl bg-slate-50 border-none font-bold uppercase placeholder:text-slate-300" onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Téléphone</label>
                  <Input placeholder="NUMÉRO" className="h-16 rounded-2xl bg-slate-50 border-none font-bold placeholder:text-slate-300" onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Heure de passage</label>
                  <Input required type="time" className="h-16 rounded-2xl bg-slate-50 border-none font-bold" onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>
              <Button type="submit" className="w-full h-16 rounded-2xl bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest border-none hover:bg-slate-900 shadow-lg shadow-blue-200 transition-all mt-4">
                Inscrire au planning
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}