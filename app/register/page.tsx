"use client"

import React, { useState } from "react"
import { Activity, Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles, Phone, Stethoscope } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(false) 
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center p-4 md:p-10 relative overflow-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-[1400px] min-h-[850px] rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl bg-[#090E1A]/60 backdrop-blur-3xl relative z-10 grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-5 p-12 md:p-20 flex flex-col justify-between border-r border-white/5 relative">
          <div className="space-y-16">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                <Activity className="text-white w-8 h-8" />
              </div>
              <span className="text-white text-xl font-black italic uppercase tracking-tighter">TEMPS RÉEL</span>
            </div>
            <div className="relative">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.85] mb-8">
                EFFICIENCE <br /><span className="text-blue-500">DENTAIRE.</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-fit">
            <ShieldCheck className="text-emerald-500 w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">HDS Certifié v2</span>
          </div>
        </div>

        <div className="md:col-span-7 bg-white m-5 rounded-[3.5rem] p-8 md:p-16 flex flex-col justify-center shadow-2xl relative overflow-hidden">
          <div className="mb-10">
            <h2 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              {isLogin ? "LOGIN ." : "NOUVEAU COMPTE ."}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isLogin && (
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Identité</label>
                <Input required placeholder="Dr. Martin Durand" className="h-16 rounded-2xl bg-slate-50 border-none font-bold text-slate-900" />
              </div>
            )}
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Email</label>
              <Input required type="email" placeholder="contact@cabinet.fr" className="h-16 rounded-2xl bg-slate-50 border-none font-bold text-slate-900" />
            </div>
            <Button disabled={isLoading} className="col-span-2 h-20 rounded-[2rem] bg-slate-900 hover:bg-blue-600 text-white font-black uppercase text-[12px] tracking-[0.4em] transition-all flex gap-4 mt-4 shadow-xl">
              {isLoading ? "PATIENTEZ..." : "ACCÉDER AU DASHBOARD"} 
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}