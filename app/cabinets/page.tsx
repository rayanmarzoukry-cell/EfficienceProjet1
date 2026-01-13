"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"

// Données mock des cabinets
const cabinetsData = [
  {
    id: 1,
    nom: "Dental Care Bordeaux",
    email: "contact@cabinetb.fr",
    score: 94,
    statut: "performant",
    ca: "52 000€",
    trend: "+5%",
    rapport: "Envoyé",
    rapportStatut: "sent",
  },
  {
    id: 2,
    nom: "Cabinet Dr. Martin",
    email: "dr.martin@cabinet.fr",
    score: 92,
    statut: "performant",
    ca: "45 000€",
    trend: "+3%",
    rapport: "Envoyé",
    rapportStatut: "sent",
  },
  {
    id: 3,
    nom: "Dr. Emmanuel (ER)",
    email: "emmanuel@cabinet.fr",
    score: 88,
    statut: "surveiller",
    ca: "38 000€",
    trend: "-1%",
    rapport: "À générer",
    rapportStatut: "pending",
  },
  {
    id: 4,
    nom: "Dr. Jean-Claude (JC)",
    email: "jc@cabinet.fr",
    score: 87,
    statut: "surveiller",
    ca: "45 000€",
    trend: "+2%",
    rapport: "Envoyé",
    rapportStatut: "sent",
  },
  {
    id: 5,
    nom: "Cabinet Sourire",
    email: "sourire@cabinet.fr",
    score: 76,
    statut: "attention",
    ca: "32 000€",
    trend: "-8%",
    rapport: "Non envoyé",
    rapportStatut: "failed",
  },
]

export default function CabinetsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCabinets = cabinetsData.filter(
    (cabinet) =>
      cabinet.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabinet.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "performant":
        return "bg-green-500/20 text-green-400"
      case "surveiller":
        return "bg-yellow-500/20 text-yellow-400"
      case "attention":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  const getRapportColor = (statut: string) => {
    switch (statut) {
      case "sent":
        return "bg-green-500/20 text-green-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "failed":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  const stats = [
    { label: "Cabinets suivis", count: cabinetsData.length, icon: "📊", color: "text-blue-400" },
    { label: "Performants", count: cabinetsData.filter(c => c.statut === "performant").length, icon: "✅", color: "text-green-400" },
    { label: "À surveiller", count: cabinetsData.filter(c => c.statut === "surveiller").length, icon: "⚠️", color: "text-yellow-400" },
    { label: "En attention", count: cabinetsData.filter(c => c.statut === "attention").length, icon: "🔴", color: "text-red-400" },
  ]

  return (
    <div className="p-8 bg-[#030712] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Gestion des cabinets</h1>
          <p className="text-slate-400">Suivi et analyse des performances</p>
        </div>

        {/* Cartes de stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-[#090E1A] border-white/10 hover:border-white/20 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className={`text-3xl font-bold ${stat.color}`}>{stat.count}</span>
                </div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recherche et filtres */}
        <Card className="bg-[#090E1A] border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <Input
                  placeholder="Rechercher un cabinet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Filtrer</Button>
            </div>
          </CardContent>
        </Card>

        {/* Cartes des cabinets */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {filteredCabinets.map((cabinet) => (
            <Card key={cabinet.id} className="bg-[#090E1A] border-white/10 hover:border-blue-500/50 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg">{cabinet.nom}</CardTitle>
                    <p className="text-slate-500 text-sm">{cabinet.email}</p>
                  </div>
                  <Badge className={getStatutColor(cabinet.statut)}>
                    {cabinet.score}%
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Chiffre d'affaires */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <p className="text-slate-400 text-sm">Chiffre d'affaires</p>
                      <p className="text-white font-semibold">{cabinet.ca}</p>
                    </div>
                    <div className={`flex items-center gap-1 ${cabinet.trend.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-semibold">{cabinet.trend}</span>
                    </div>
                  </div>

                  {/* Statut Rapport */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-slate-400 text-sm">Statut Rapport</p>
                    <Badge className={getRapportColor(cabinet.rapportStatut)}>
                      {cabinet.rapport}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/cabinet/${cabinet.id}`} className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Voir détails
                      </Button>
                    </Link>
                    <Button variant="outline" className="border-white/10 text-sm" size="sm">
                      Rapport
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tableau vue d'ensemble */}
        <Card className="bg-[#090E1A] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Vue d'ensemble</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-slate-400 font-semibold">CABINET</th>
                    <th className="text-left py-4 px-4 text-slate-400 font-semibold">SCORE</th>
                    <th className="text-left py-4 px-4 text-slate-400 font-semibold">CA</th>
                    <th className="text-left py-4 px-4 text-slate-400 font-semibold">TENDANCE</th>
                    <th className="text-left py-4 px-4 text-slate-400 font-semibold">RAPPORT</th>
                    <th className="text-left py-4 px-4 text-slate-400 font-semibold">STATUT</th>
                    <th className="text-left py-4 px-4 text-slate-400 font-semibold">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCabinets.map((cabinet) => (
                    <tr key={cabinet.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white font-medium">{cabinet.nom}</p>
                          <p className="text-slate-500 text-xs">{cabinet.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatutColor(cabinet.statut)}>
                          {cabinet.score}%
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{cabinet.ca}</td>
                      <td className="py-4 px-4">
                        <span className={cabinet.trend.startsWith("+") ? "text-green-400" : "text-red-400"}>
                          {cabinet.trend}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getRapportColor(cabinet.rapportStatut)}>
                          {cabinet.rapport}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatutColor(cabinet.statut)}>
                          {cabinet.statut === "performant" ? "✓ OK" : cabinet.statut === "surveiller" ? "⚠ À suivre" : "🔴 Alerte"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Link href={`/cabinet/${cabinet.id}`}>
                          <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
