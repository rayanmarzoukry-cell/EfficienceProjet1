"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, Lock, User } from "lucide-react"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminName, setAdminName] = useState("")

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié (token stocké en localStorage)
    const token = localStorage.getItem("admin_token")
    const adminUser = localStorage.getItem("admin_user")

    if (token) {
      // Vérifier le token (validation basique - à améliorer avec JWT en production)
      try {
        const decoded = JSON.parse(atob(token.split(".")[1] || ""))
        const now = Date.now() / 1000
        if (decoded.exp && decoded.exp > now) {
          setIsAuthenticated(true)
          setAdminName(adminUser || "Admin")
        } else {
          // Token expiré
          localStorage.removeItem("admin_token")
          localStorage.removeItem("admin_user")
          router.push("/admin/login")
        }
      } catch (e) {
        localStorage.removeItem("admin_token")
        localStorage.removeItem("admin_user")
        router.push("/admin/login")
      }
    } else {
      router.push("/admin/login")
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("admin_user")
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* En-tête Admin */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Tableau de bord Admin
              </h1>
              <p className="text-sm text-slate-600">
                Efficience - Gestion sécurisée
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-700">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{adminName}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
