"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileText, BarChart3, Settings, Mail, Shield } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Gestion des Cabinets",
      description: "Gérer les cabinets dentaires, leurs utilisateurs et leurs paramètres.",
      icon: Users,
      color: "bg-blue-500",
      action: () => console.log("Accès cabinets"),
    },
    {
      title: "Rapports & Analyses",
      description: "Consulter tous les rapports générés et les analyses de performance.",
      icon: FileText,
      color: "bg-green-500",
      action: () => console.log("Accès rapports"),
    },
    {
      title: "Automatisation",
      description: "Configurer les tâches automatisées et surveiller leur exécution.",
      icon: BarChart3,
      color: "bg-purple-500",
      action: () => console.log("Accès automatisation"),
    },
    {
      title: "Paramètres Système",
      description: "Configuration globale de la plateforme et des intégrations.",
      icon: Settings,
      color: "bg-orange-500",
      action: () => console.log("Accès paramètres"),
    },
    {
      title: "Gestion des Emails",
      description: "Templates d'emails, historique d'envoi et configuration SMTP.",
      icon: Mail,
      color: "bg-indigo-500",
      action: () => console.log("Accès emails"),
    },
    {
      title: "Sécurité & Logs",
      description: "Surveillance des connexions, logs système et sécurité.",
      icon: Shield,
      color: "bg-red-500",
      action: () => console.log("Accès sécurité"),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {actions.map((action, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${action.color} text-white`}>
                <action.icon className="h-5 w-5" />
              </div>
              {action.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{action.description}</p>
            <Button onClick={action.action} className="w-full">
              Accéder
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
