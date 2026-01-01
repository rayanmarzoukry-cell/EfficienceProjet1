"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, Users, Euro } from "lucide-react"

interface ChatAnalyticsProps {
  data: {
    scoreGlobal: number
    chiffreAffaires: number
    objectifCA: number
    nombreRDV: number
    tauxPresence: number
    periode: string
  }
}

export function ChatAnalytics({ data }: ChatAnalyticsProps) {
  const performanceCA = (data.chiffreAffaires / data.objectifCA) * 100

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Aperçu Performance
        </CardTitle>
        <Badge variant="secondary" className="w-fit text-xs">
          {data.periode}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Score Global */}
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{data.scoreGlobal}/100</div>
          <div className="text-xs text-blue-700">Score Global</div>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Euro className="h-3 w-3 text-green-600" />
            <span>{Math.round(performanceCA)}% CA</span>
            {performanceCA >= 90 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-blue-600" />
            <span>{data.tauxPresence}% présence</span>
            <TrendingUp className="h-3 w-3 text-green-500" />
          </div>
        </div>

        {/* Valeurs */}
        <div className="text-xs text-gray-600 space-y-1">
          <div>CA: {data.chiffreAffaires.toLocaleString("fr-FR")}€</div>
          <div>RDV: {data.nombreRDV} ce mois</div>
        </div>
      </CardContent>
    </Card>
  )
}
