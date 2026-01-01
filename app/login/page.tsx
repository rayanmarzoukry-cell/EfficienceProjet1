"use client"

import React, { useState } from "react"
import { Activity, Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => router.push("/dashboard"), 1500)
  }

  return (
    <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center p-4 md:p-10 relative overflow-hidden font-sans text-slate-900">
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-[1400px] min-h-[850px] rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl bg-[#090E1A]/60 backdrop-blur-3xl relative z-10 grid grid-cols-1 md:grid-cols-12">
        
        <div className="md:col-span-5 p-12 md:p-20 flex flex-col justify-between border-r border-white/5 relative bg-gradient-to-b from-transparent to-blue-900/5">
          <div className="space-y-16">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 text-white">
                <Activity className="w-8 h-8" />
              </div>
              <span className="text-white text-xl font-black italic uppercase tracking-tighter">RM DEV</span>
            </div>
            
            <div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.85] mb-8">
                EFFICIENCE <br />
                <span className="text-blue-500">DENTAIRE.</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed opacity-70 border-l-2 border-blue-600/30 pl-6">
                L'excellence opérationnelle de votre cabinet augmentée par l'intelligence artificielle générative.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-fit">
            <ShieldCheck className="text-emerald-500 w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Protection HDS Certifiée</span>
          </div>
        </div>

        <div className="md:col-span-7 bg-white m-5 rounded-[3.5rem] p-8 md:p-16 lg:p-24 flex flex-col justify-center shadow-2xl relative">
          <div className="mb-10 text-left">
            <div className="flex items-center gap-2 mb-4">
               <Sparkles className="w-4 h-4 text-blue-600" />
               <span className="text-blue-600 font-black uppercase text-[10px] tracking-widest italic">Accès Praticien</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              BIENVENUE .
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Email Professionnel</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input required type="email" placeholder="contact@efficience-dentaire.fr" className="h-16 pl-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <Input required type="password" placeholder="••••••••" className="h-16 pl-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 transition-all" />
              </div>
            </div>

            <Button className="w-full h-20 rounded-[2rem] bg-slate-900 hover:bg-blue-600 text-white font-black uppercase text-[12px] tracking-[0.4em] transition-all flex gap-4 mt-4 shadow-xl active:scale-95">
              {isLoading ? "AUTHENTIFICATION..." : "BIENVENUE"} <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="mt-12 text-center border-t border-slate-100 pt-8">
            <Link href="/register" className="text-[11px] font-black uppercase text-slate-400 tracking-widest hover:text-blue-600 group">
              Pas encore membre ? <span className="text-slate-900 ml-3 underline decoration-blue-600 decoration-2 underline-offset-8">S'inscrire</span>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}