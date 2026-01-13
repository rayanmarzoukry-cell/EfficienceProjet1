"use client"

import React, { useState } from "react"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, Zap, RefreshCw } from "lucide-react"
import { useAI } from "@/hooks/use-ai"

// Données mock pour les analyses globales
const dataCAMoyenParCabinet = [
  { month: "Jan", "Dr Mocanu": 8, "Dr Bresden": 12, "Dr Burnier": 10, "Dr Dick": 9, "Dr Zina": 11, "Dr Pinard": 13 },
  { month: "Feb", "Dr Mocanu": 10, "Dr Bresden": 14, "Dr Burnier": 12, "Dr Dick": 11, "Dr Zina": 13, "Dr Pinard": 15 },
  { month: "Mar", "Dr Mocanu": 12, "Dr Bresden": 16, "Dr Burnier": 14, "Dr Dick": 13, "Dr Zina": 15, "Dr Pinard": 17 },
  { month: "Apr", "Dr Mocanu": 14, "Dr Bresden": 18, "Dr Burnier": 16, "Dr Dick": 15, "Dr Zina": 17, "Dr Pinard": 19 },
  { month: "May", "Dr Mocanu": 16, "Dr Bresden": 20, "Dr Burnier": 18, "Dr Dick": 17, "Dr Zina": 19, "Dr Pinard": 21 },
  { month: "Jun", "Dr Mocanu": 18, "Dr Bresden": 22, "Dr Burnier": 20, "Dr Dick": 19, "Dr Zina": 21, "Dr Pinard": 23 },
  { month: "Jul", "Dr Mocanu": 17, "Dr Bresden": 21, "Dr Burnier": 19, "Dr Dick": 18, "Dr Zina": 20, "Dr Pinard": 22 },
  { month: "Aug", "Dr Mocanu": 15, "Dr Bresden": 19, "Dr Burnier": 17, "Dr Dick": 16, "Dr Zina": 18, "Dr Pinard": 20 },
  { month: "Sep", "Dr Mocanu": 19, "Dr Bresden": 23, "Dr Burnier": 21, "Dr Dick": 20, "Dr Zina": 22, "Dr Pinard": 24 },
  { month: "Oct", "Dr Mocanu": 20, "Dr Bresden": 24, "Dr Burnier": 22, "Dr Dick": 21, "Dr Zina": 23, "Dr Pinard": 25 },
  { month: "Nov", "Dr Mocanu": 18, "Dr Bresden": 22, "Dr Burnier": 20, "Dr Dick": 19, "Dr Zina": 21, "Dr Pinard": 23 },
  { month: "Dec", "Dr Mocanu": 16, "Dr Bresden": 20, "Dr Burnier": 18, "Dr Dick": 17, "Dr Zina": 19, "Dr Pinard": 21 },
]

const dataRepartitionScores = [
  { name: "Performants (>85%)", value: 45, color: "#10b981" },
  { name: "À surveiller (70-85%)", value: 30, color: "#f59e0b" },
  { name: "En difficulté (<70%)", value: 25, color: "#ef4444" },
]

const dataNouveauPatient = [
  { month: "01", count: 8 },
  { month: "02", count: 11 },
  { month: "03", count: 14 },
  { month: "04", count: 12 },
  { month: "05", count: 18 },
  { month: "06", count: 16 },
  { month: "07", count: 19 },
  { month: "08", count: 15 },
  { month: "09", count: 20 },
  { month: "10", count: 17 },
  { month: "11", count: 21 },
  { month: "12", count: 14 },
]

const dataCAHoraires = [
  { month: "01", ca: 45, objectif: 55 },
  { month: "02", ca: 52, objectif: 55 },
  { month: "03", ca: 58, objectif: 55 },
  { month: "04", ca: 50, objectif: 55 },
  { month: "05", ca: 65, objectif: 55 },
  { month: "06", ca: 62, objectif: 55 },
  { month: "07", ca: 68, objectif: 55 },
  { month: "08", ca: 55, objectif: 55 },
  { month: "09", ca: 72, objectif: 55 },
  { month: "10", ca: 68, objectif: 55 },
  { month: "11", ca: 75, objectif: 55 },
  { month: "12", ca: 58, objectif: 55 },
]

const scoringData = [
  { nom: "Dr Bresden", score: 94 },
  { nom: "Dr Martin", score: 92 },
  { nom: "Dr Emmanuel (ER)", score: 88 },
  { nom: "Dr Jean-Claude (JC)", score: 87 },
  { nom: "Mireille", score: 76 },
]

export default function AnalysesPage() {
  const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
  const years = [2023, 2024, 2025, 2026]
  
  const [selectedMonth, setSelectedMonth] = useState("Décembre")
  const [selectedYear, setSelectedYear] = useState(2025)
  const [showMonthDropdown, setShowMonthDropdown] = useState(false)
  const [showYearDropdown, setShowYearDropdown] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  
  const { loading: aiLoading, error: aiError, analyzeCabinet } = useAI()

  const handleAIAnalysis = async () => {
    const globalCabinetData = {
      id: "global",
      nom: "Vue Globale - Tous les Cabinets",
      caActuel: 285000,
      caObjectif: 300000,
      nouveauxPatients: 125,
      absences: 8,
      devisEnvoyes: 95,
      devisConvertis: 57,
      traitements: [
        { nom: "Détartrage", nombre: 250 },
        { nom: "Dévitalisation", nombre: 85 },
        { nom: "Implant", nombre: 35 },
      ],
      periodicite: "mois",
    }

    const result = await analyzeCabinet(globalCabinetData)
    if (result) {
      setAnalysis(result)
    }
  }

  return (
    <div className="p-8 bg-[#030712] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Analyses Globales</h1>
          <p className="text-slate-400">Comparatifs des performances des cabinets - {selectedMonth} {selectedYear}</p>
        </div>

        {/* Filtres */}
        <div className="flex gap-4 mb-8 flex-wrap items-center">
          <div className="flex items-center gap-2 relative">
            <span className="text-slate-400 text-sm">Période :</span>
            <button 
              onClick={() => setShowMonthDropdown(!showMonthDropdown)}
              className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 text-sm flex items-center gap-2"
            >
              {selectedMonth} <ChevronDown className="w-4 h-4" />
            </button>
            {showMonthDropdown && (
              <div className="absolute top-12 left-0 bg-[#090E1A] border border-white/10 rounded-lg w-40 z-10">
                {months.map((month) => (
                  <button
                    key={month}
                    onClick={() => {
                      setSelectedMonth(month)
                      setShowMonthDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 border-b border-white/5 last:border-b-0"
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 relative">
            <button 
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 text-sm flex items-center gap-2"
            >
              {selectedYear} <ChevronDown className="w-4 h-4" />
            </button>
            {showYearDropdown && (
              <div className="absolute top-12 left-0 bg-[#090E1A] border border-white/10 rounded-lg w-24 z-10">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year)
                      setShowYearDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/10 border-b border-white/5 last:border-b-0"
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bouton IA */}
          <Button
            onClick={handleAIAnalysis}
            disabled={aiLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white gap-2"
          >
            {aiLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Zap size={18} />
                Analyse IA Globale
              </>
            )}
          </Button>
        </div>

        {/* Affichage analyse IA */}
        {analysis && (
          <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30 mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">🤖 Analyse IA Globale</h3>
              <div className="text-white/90 space-y-3 text-sm">
                {analysis.split('\n').map((line, idx) => (
                  <p key={idx} className={line.startsWith('**') ? 'font-semibold' : ''}>
                    {line.replace(/\*\*/g, '')}
                  </p>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAnalysis(null)}
                className="mt-4 border-purple-500/50"
              >
                Fermer
              </Button>
            </CardContent>
          </Card>
        )}

        {aiError && (
          <Card className="bg-red-900/20 border-red-500/30 mb-8">
            <CardContent className="p-4">
              <p className="text-red-400">{aiError}</p>
            </CardContent>
          </Card>
        )}

        {/* Cartes de résumé */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <Card className="bg-[#090E1A] border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">84%</div>
              <p className="text-sm text-slate-400">Bresden</p>
            </CardContent>
          </Card>
          <Card className="bg-[#090E1A] border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">92%</div>
              <p className="text-sm text-slate-400">Dr Martin</p>
            </CardContent>
          </Card>
          <Card className="bg-[#090E1A] border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">88%</div>
              <p className="text-sm text-slate-400">Dr Emmanuel</p>
            </CardContent>
          </Card>
          <Card className="bg-[#090E1A] border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">87%</div>
              <p className="text-sm text-slate-400">Dr J-Claude</p>
            </CardContent>
          </Card>
          <Card className="bg-[#090E1A] border-white/10">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">76%</div>
              <p className="text-sm text-slate-400">Mireille</p>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* CA Moyen par cabinet */}
          <Card className="bg-[#090E1A] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Chiffre d'affaires</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataCAMoyenParCabinet}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip contentStyle={{ backgroundColor: "#090E1A", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <Legend />
                  <Line type="monotone" dataKey="Dr Mocanu" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Dr Bresden" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="Dr Burnier" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="Dr Dick" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Dr Zina" stroke="#ec4899" strokeWidth={2} />
                  <Line type="monotone" dataKey="Dr Pinard" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* CA Horaires */}
          <Card className="bg-[#090E1A] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">CA horaires</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataCAHoraires}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip contentStyle={{ backgroundColor: "#090E1A", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <Legend />
                  <Bar dataKey="ca" fill="#3b82f6" />
                  <Bar dataKey="objectif" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Nb nouveau patient */}
          <Card className="bg-[#090E1A] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Nb nouveau patient</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataNouveauPatient}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip contentStyle={{ backgroundColor: "#090E1A", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Montant moyen des devis */}
          <Card className="bg-[#090E1A] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Montant moyen des devis proposés</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataNouveauPatient}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" />
                  <YAxis stroke="rgba(255,255,255,0.3)" />
                  <Tooltip contentStyle={{ backgroundColor: "#090E1A", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <Bar dataKey="count" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Scoring Performance */}
          <Card className="bg-[#090E1A] border-white/10 col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Scoring Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scoringData.map((item) => (
                  <div key={item.nom} className="flex items-center gap-4">
                    <span className="text-slate-300 w-32">{item.nom}</span>
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div className={`h-2 rounded-full ${item.score >= 90 ? "bg-green-500" : item.score >= 80 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${item.score}%` }} />
                    </div>
                    <span className="text-white font-bold w-12 text-right">{item.score}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Répartition des scores */}
        <Card className="bg-[#090E1A] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Répartition des Scores</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataRepartitionScores}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataRepartitionScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#090E1A", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
