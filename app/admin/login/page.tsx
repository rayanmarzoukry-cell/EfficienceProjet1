'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, ShieldAlert, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAdminAuth } from '@/hooks/use-admin-auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, isLoading, error, isAuthenticated } = useAdminAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!email || !password) {
      setLocalError('Email et mot de passe requis')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Email invalide')
      return
    }

    if (password.length < 8) {
      setLocalError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    await login(email, password)
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center p-4 md:p-10 relative overflow-hidden font-sans text-slate-900">
      {/* Gradient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-[1400px] min-h-[850px] rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl bg-[#090E1A]/60 backdrop-blur-3xl relative z-10 grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Section */}
        <div className="md:col-span-5 p-12 md:p-20 flex flex-col justify-between border-r border-white/5 relative bg-gradient-to-b from-transparent to-red-900/5">
          <div className="space-y-16">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/40 text-white">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <span className="text-white text-xl font-black italic uppercase tracking-tighter">ADMIN</span>
            </div>
            
            <div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.85] mb-8">
                CONSOLE <br />
                <span className="text-red-500">ADMIN.</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed opacity-70 border-l-2 border-red-600/30 pl-6">
                Gestion centralisée des utilisateurs et des cabinets dentaires. Accès administrateur sécurisé.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-fit">
            <ShieldAlert className="text-red-500 w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Authentification Sécurisée</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:col-span-7 bg-white m-5 rounded-[3.5rem] p-8 md:p-16 lg:p-24 flex flex-col justify-center shadow-2xl relative">
          <div className="mb-10 text-left">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span className="text-red-600 font-black uppercase text-[10px] tracking-widest italic">Accès Administrateur</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              CONNEXION .
            </h2>
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-semibold">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Email Administrateur
              </label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-red-600 transition-colors" />
                <Input
                  required
                  type="email"
                  placeholder="admin@efficience-dentaire.fr"
                  className="h-16 pl-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-900 focus:ring-2 focus:ring-red-500/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                Mot de passe
              </label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-red-600 transition-colors" />
                <Input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-16 pl-14 pr-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-900 focus:ring-2 focus:ring-red-500/20 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-20 rounded-[2rem] bg-slate-900 hover:bg-red-600 text-white font-black uppercase text-[12px] tracking-[0.4em] transition-all flex gap-4 mt-6 shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  VÉRIFICATION...
                </>
              ) : (
                <>
                  ACCÈS ADMIN <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-12 text-center border-t border-slate-100 pt-8">
            <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
              Retour vers <a href="/login" className="text-slate-900 ml-3 underline decoration-red-600 decoration-2 underline-offset-8 hover:text-red-600">
                connexion client
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
