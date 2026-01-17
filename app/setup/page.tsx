"use client"

import React, { useState, useEffect } from "react"
import { Activity, Lock, Mail, User, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SetupPage() {
  const router = useRouter()
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })

  // Vérifier si setup est déjà faite
  useEffect(() => {
    const checkSetup = async () => {
      try {
        const res = await fetch("/api/auth/setup")
        const data = await res.json()
        setIsSetupComplete(data.setupComplete)
      } catch (error) {
        console.error("Erreur check setup:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSetup()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validations
    if (!formData.email || !formData.password || !formData.name) {
      setError("Tous les champs sont requis")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Email invalide")
      return
    }

    try {
      setIsSubmitting(true)
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erreur lors de la création")
        return
      }

      setSuccess("Administrateur créé avec succès! Redirection...")
      setTimeout(() => router.push("/login"), 2000)
    } catch (error) {
      setError("Erreur serveur")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-slate-600 font-medium">Vérification...</p>
        </div>
      </div>
    )
  }

  if (isSetupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-2xl border-0 shadow-lg">
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Setup Complétée ✅</h2>
              <p className="text-slate-600">
                L'administrateur a déjà été créé. Accédez à la connexion.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Aller à la Connexion
              <ArrowRight size={20} />
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-3xl relative z-10 p-8 md:p-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg text-white">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-slate-900">Configuration Initiale</h1>
            <p className="text-slate-600">Créez votre compte administrateur</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
                {success}
              </div>
            )}

            {/* Nom */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">Nom Complet</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition" />
                <Input
                  type="text"
                  placeholder="Jean Dupont"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 pl-12 rounded-lg bg-slate-50 border-none font-medium focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">Email Professionnel</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition" />
                <Input
                  type="email"
                  placeholder="admin@cabinet.fr"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 pl-12 rounded-lg bg-slate-50 border-none font-medium focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">Mot de Passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 pl-12 rounded-lg bg-slate-50 border-none font-medium focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Confirmer mot de passe */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">Confirmer le Mot de Passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="h-12 pl-12 rounded-lg bg-slate-50 border-none font-medium focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-blue-600 text-white rounded-lg font-black uppercase tracking-wider hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Activity className="w-5 h-5 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  Créer l'Admin
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-900 font-medium">
              ✓ Les données seront sauvegardées dans MongoDB<br />
              ✓ Mot de passe haché avec bcrypt<br />
              ✓ Une seule création d'admin possible
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
