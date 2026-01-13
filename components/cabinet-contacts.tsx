"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Mail, Phone, MapPin, Edit2, Trash2, Eye } from "lucide-react"

interface CabinetContactInfo {
  id: number
  name: string
  email: string
  phone: string
  city: string
  score: number
  status: "active" | "inactive" | "warning"
}

interface CabinetContactsProps {
  cabinets: CabinetContactInfo[]
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}

export function CabinetContacts({ cabinets, onEdit, onDelete }: CabinetContactsProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCabinets = cabinets.filter(
    (cabinet) =>
      cabinet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabinet.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabinet.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400"
      case "inactive":
        return "bg-gray-500/20 text-gray-400"
      case "warning":
        return "bg-yellow-500/20 text-yellow-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  return (
    <Card className="bg-[#090E1A] border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Contacts Cabinets</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <Input
            placeholder="Rechercher un cabinet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
          />
        </div>

        {/* Liste des cabinets */}
        <div className="grid grid-cols-2 gap-4">
          {filteredCabinets.map((cabinet) => (
            <div
              key={cabinet.id}
              className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold">{cabinet.name}</h3>
                  <Badge className={getStatusColor(cabinet.status)} variant="secondary">
                    Score: {cabinet.score}%
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-blue-400"
                    onClick={() => onEdit?.(cabinet.id)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-red-400"
                    onClick={() => onDelete?.(cabinet.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{cabinet.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-4 h-4" />
                  <span>{cabinet.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>{cabinet.city}</span>
                </div>
              </div>

              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-sm" size="sm">
                <Eye className="w-3 h-3 mr-2" />
                Voir détails
              </Button>
            </div>
          ))}
        </div>

        {filteredCabinets.length === 0 && (
          <p className="text-center text-slate-400 py-8">Aucun cabinet trouvé</p>
        )}
      </CardContent>
    </Card>
  )
}

interface StatsCardProps {
  label: string
  value: string | number
  unit?: string
  trend?: number
  color?: "blue" | "green" | "purple" | "orange"
}

export function StatsCard({ label, value, unit, trend, color = "blue" }: StatsCardProps) {
  const colorMap = {
    blue: "bg-blue-500/20 border-blue-500/30 text-blue-400",
    green: "bg-green-500/20 border-green-500/30 text-green-400",
    purple: "bg-purple-500/20 border-purple-500/30 text-purple-400",
    orange: "bg-orange-500/20 border-orange-500/30 text-orange-400",
  }

  return (
    <Card className={`${colorMap[color]} border`}>
      <CardContent className="p-6">
        <p className="text-sm font-semibold text-white mb-2">{label}</p>
        <p className="text-3xl font-bold text-white">
          {value}
          {unit && <span className="text-lg text-slate-400">{unit}</span>}
        </p>
        {trend !== undefined && (
          <p className={`text-xs mt-2 ${trend > 0 ? "text-green-400" : "text-red-400"}`}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% vs dernier mois
          </p>
        )}
      </CardContent>
    </Card>
  )
}
