"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Download, Mail, Eye } from "lucide-react"
import Link from "next/link"

// Données pour le dashboard étendu
const dashboardMetrics = {
  totalCabinets: 24,
  reportsGenerated: 156,
  emailsSent: 142,
  avgPerformance: 87,
}

const performanceData = [
  { cabinet: "Dr Bresden", score: 94 },
  { cabinet: "Dr Martin", score: 92 },
  { cabinet: "Dr Emmanuel", score: 88 },
  { cabinet: "Dr Jean-Claude", score: 87 },
  { cabinet: "Mireille", score: 76 },
]

const caEvolutionData = [
  { month: "Jan", ca: 125 },
  { month: "Feb", ca: 135 },
  { month: "Mar", ca: 142 },
  { month: "Apr", ca: 140 },
  { month: "May", ca: 155 },
  { month: "Jun", ca: 162 },
]

const scoreDistribution = [
  { name: "Performants (>85%)", value: 45, color: "#10b981" },
  { name: "À surveiller", value: 30, color: "#f59e0b" },
  { name: "En difficulté", value: 25, color: "#ef4444" },
]

export function DashboardExtended() {
  return (
    <div className="space-y-8 mt-8">
      {/* Section Analyses Globales */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Analyses & Performance</h2>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#090E1A] border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-sm">CA Moyen par Cabinet</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={caEvolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip contentStyle={{ backgroundColor: "#090E1A", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <Line type="monotone" dataKey="ca" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-[#090E1A] border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-sm">Top Performances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performanceData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-8">#{idx + 1}</span>
                    <span className="text-sm text-slate-300 flex-1 truncate">{item.cabinet}</span>
                    <Badge className="bg-blue-500/20 text-blue-400">{item.score}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#090E1A] border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-sm">Répartition Scores</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={scoreDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                    {scoreDistribution.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Raccourcis</h2>
        <div className="grid grid-cols-4 gap-4">
          <Link href="/analyses">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start" size="lg">
              <BarChart className="w-4 h-4 mr-2" />
              Analyses
            </Button>
          </Link>
          <Link href="/rapports">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 justify-start" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Rapports
            </Button>
          </Link>
          <Link href="/cabinets">
            <Button className="w-full bg-green-600 hover:bg-green-700 justify-start" size="lg">
              <Eye className="w-4 h-4 mr-2" />
              Cabinets
            </Button>
          </Link>
          <Link href="/consultations">
            <Button className="w-full bg-orange-600 hover:bg-orange-700 justify-start" size="lg">
              <Mail className="w-4 h-4 mr-2" />
              Consultations
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
