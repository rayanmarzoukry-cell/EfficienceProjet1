"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, LogOut, Bell, Settings } from "lucide-react"

export function AdminHeader() {
  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Administration</h1>
                <p className="text-sm text-gray-500">Efficience-Dentaire</p>
              </div>
            </div>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Paramètres */}
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>

            {/* Badge rôle */}
            <Badge variant="default" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Administrateur
            </Badge>

            {/* Infos utilisateur */}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Administrateur</p>
              <p className="text-xs text-gray-500">admin@efficience-dentaire.fr</p>
            </div>

            {/* Bouton déconnexion */}
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-1" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
