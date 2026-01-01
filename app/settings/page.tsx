"use client"

import React, { useState, useEffect } from "react"
import { 
  Target, Database, Bell, Shield, 
  ChevronRight, Activity, UploadCloud, 
  Building2, BellRing, MessageSquare, ShieldCheck
} from "lucide-react"
import { Badge } from "@/components/ui/badge" 
import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("cabinet")

  // 1. ÉTAT POUR LES DONNÉES DU CABINET (Fixe l'erreur de lecture seule)
  const [cabinet, setCabinet] = useState({
    nom: "",
    adeli: "10004567890",
    telephone: "",
    adresse: ""
  })

  // ÉTAT POUR LES SEUILS
  const [thresholds, setThresholds] = useState({ revenue: "50000", newPatients: "30" })

  // 2. CHARGEMENT DES DONNÉES DEPUIS LE BACKEND FLASK
  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/cabinet-info")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCabinet({
            nom: data.info.nom,
            adeli: "10004567890", // Valeur par défaut
            telephone: data.info.telephone,
            adresse: data.info.adresse
          })
        }
      })
      .catch(err => console.error("Erreur de chargement:", err))
  }, [])

  // 3. FONCTION DE MISE À JOUR DES INPUTS (Fixe l'erreur onChange)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCabinet(prev => ({ ...prev, [name]: value }))
  }

  // 4. SAUVEGARDE VERS LE BACKEND
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("http://127.0.0.1:5001/api/update-cabinet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cabinet)
      })
      if (res.ok) {
        alert("Données RM DEV mises à jour avec succès !")
      }
    } catch (error) {
      alert("Erreur lors de la connexion au serveur Flask")
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <Sidebar />

      <main className="ml-80 p-10 animate-in fade-in duration-700">
        
        {/* HEADER */}
        <div className="text-left mb-10">
          <Badge className="bg-blue-100 text-blue-600 font-black px-4 py-1 rounded-full text-[10px] uppercase tracking-widest mb-4">
            DR. MARTIN — CONFIGURATION
          </Badge>
          <h1 className="text-6xl font-black italic uppercase tracking-tighter text-slate-900 flex items-center gap-4">
            Réglages <span className="text-blue-600 not-italic">.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">
            Optimisation des performances propulsée par RM Dev Intelligence
          </p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          
          {/* MENU GAUCHE */}
          <div className="col-span-4 space-y-4">
            <Card className="p-4 rounded-[2.5rem] border-none shadow-xl bg-white/80 backdrop-blur-md">
              <nav className="space-y-2">
                {[
                  { id: "cabinet", label: "Informations Cabinet", icon: Building2 },
                  { id: "objectifs", label: "Objectifs & KPIs", icon: Target },
                  { id: "import", label: "Importation", icon: Database },
                  { id: "notifs", label: "Notifications", icon: Bell },
                  { id: "security", label: "Sécurité", icon: Shield },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                      activeTab === item.id 
                      ? "bg-white shadow-lg text-blue-600 scale-[1.02]" 
                      : "text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>
                    <ChevronRight className={`w-4 h-4 ${activeTab === item.id ? "opacity-100" : "opacity-0"}`} />
                  </button>
                ))}
              </nav>

              <div className="mt-8 p-6 bg-[#0A101E] rounded-[2rem] text-white text-left relative overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Système Actif</span>
                </div>
                <p className="text-xs font-black italic uppercase tracking-tighter">RM-CORE-V2</p>
              </div>
            </Card>
          </div>

          {/* CONTENU DROITE */}
          <div className="col-span-8">
            <Card className="rounded-[3.5rem] border-none shadow-2xl bg-white overflow-hidden min-h-[700px]">
              <div className="p-12">
                
                {activeTab === "cabinet" && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                    <div className="flex items-center gap-6 mb-10">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                        <Activity className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Profil Cabinet</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Identité et coordonnées</p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nom de l'établissement</label>
                        <Input 
                          name="nom"
                          value={cabinet.nom} 
                          onChange={handleInputChange}
                          className="h-16 px-6 rounded-2xl bg-slate-50 border-none font-bold" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Numéro ADELI / RPPS</label>
                        <Input 
                          name="adeli"
                          value={cabinet.adeli} 
                          onChange={handleInputChange}
                          className="h-16 px-6 rounded-2xl bg-slate-50 border-none font-bold" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Téléphone</label>
                        <Input 
                          name="telephone"
                          value={cabinet.telephone} 
                          onChange={handleInputChange}
                          className="h-16 px-6 rounded-2xl bg-slate-50 border-none font-bold" 
                        />
                      </div>
                      <div className="col-span-2 space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Adresse</label>
                        <Input 
                          name="adresse"
                          value={cabinet.adresse} 
                          onChange={handleInputChange}
                          className="h-16 px-6 rounded-2xl bg-slate-50 border-none font-bold" 
                        />
                      </div>
                      <Button type="submit" className="col-span-2 h-20 rounded-[2rem] bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase text-[10px] tracking-[0.3em] transition-all">
                        Enregistrer le profil
                      </Button>
                    </form>
                  </div>
                )}

                {activeTab === "objectifs" && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                    <div className="flex items-center gap-6 mb-10">
                      <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner">
                        <Target className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Seuils Performance</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Cibles IA Mensuelles</p>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Chiffre d'affaires cible (€)</label>
                        <Input 
                          type="number" 
                          value={thresholds.revenue} 
                          onChange={(e) => setThresholds({...thresholds, revenue: e.target.value})}
                          className="h-20 px-8 rounded-3xl bg-slate-50 border-none font-black text-2xl text-blue-600 shadow-inner" 
                        />
                      </div>
                      <Button className="w-full h-20 rounded-[2rem] bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.3em]">Mettre à jour les KPIs</Button>
                    </div>
                  </div>
                )}

                {activeTab === "import" && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                    <div className="flex items-center gap-6 mb-10">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                        <Database className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Importation</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Analyser un document PDF</p>
                      </div>
                    </div>
                    <div className="border-4 border-dashed border-slate-100 rounded-[3rem] p-16 flex flex-col items-center justify-center gap-6 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer relative group">
                      <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                      <UploadCloud className="w-16 h-16 text-blue-600 group-hover:scale-110 transition-transform" />
                      <p className="text-xl font-black italic uppercase text-slate-900">Glissez votre PDF ici</p>
                    </div>
                  </div>
                )}

                {activeTab === "notifs" && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                    <div className="flex items-center gap-6 mb-10 text-left">
                      <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner">
                        <BellRing className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Automatisations</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Gestion des rappels patients</p>
                      </div>
                    </div>
                    <div className="grid gap-6">
                      <Card className="p-8 rounded-[2.5rem] border-2 border-slate-50 hover:border-purple-100 transition-all bg-white shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <MessageSquare className="w-10 h-10 text-purple-600" />
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-tighter">Rappels SMS (H-24)</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Automatique la veille du RDV</p>
                          </div>
                        </div>
                        <div className="w-12 h-6 bg-purple-600 rounded-full relative shadow-inner cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                    <div className="flex items-center gap-6 mb-10">
                      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Sécurité</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Compte et Authentification</p>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Ancien mot de passe</label>
                          <Input type="password" placeholder="••••••••" className="h-16 px-6 rounded-2xl bg-slate-50 border-none font-bold shadow-inner" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nouveau mot de passe</label>
                          <Input type="password" placeholder="••••••••" className="h-16 px-6 rounded-2xl bg-slate-50 border-none font-bold shadow-inner" />
                        </div>
                      </div>
                      <Button className="w-full h-20 rounded-[2rem] bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.3em]">
                        Changer le mot de passe
                      </Button>
                    </div>
                  </div>
                )}

              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}