"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Mail, BarChart3, TrendingUp } from "lucide-react"

export function AdminStats() {
  const stats = [
    {
      title: "Cabinets Actifs",
      value: "24",
      change: "+2 ce mois",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Rapports Générés",
      value: "156",
      change: "Ce mois",
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Emails Envoyés",
      value: "142",
      change: "Taux: 98%",
      icon: Mail,
      color: "text-purple-600",
    },
    {
      title: "Performance Moyenne",
      value: "87%",
      change: "+5% vs mois dernier",
      icon: BarChart3,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {stat.change.includes("+") && <TrendingUp className="h-3 w-3 text-green-500" />}
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
