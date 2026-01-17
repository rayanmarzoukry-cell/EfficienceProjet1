"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Données mock pour analyses de consultations
const consultationsData = [
  {
    id: 1,
    cabinet: "Dental Care Bordeaux",
    email: "contact@cabinetb.fr",
    consultations: 145,
    enregistrements: 130,
    analyseIA: "89%",
    scoreMoyen: 85,
    dateAnalyse: "10/12/2025",
  },
  {
    id: 2,
    cabinet: "Cabinet Dr. Martin",
    email: "dr.martin@cabinet.fr",
    consultations: 98,
    enregistrements: 76,
    analyseIA: "78%",
    scoreMoyen: 74,
    dateAnalyse: "12/12/2025",
  },
  {
    id: 3,
    cabinet: "Dr. Emmanuel (ER)",
    email: "emmanuel@cabinet.fr",
    consultations: 122,
    enregistrements: 122,
    analyseIA: "100%",
    scoreMoyen: 81,
    dateAnalyse: "09/12/2025",
  },
  {
    id: 4,
    cabinet: "Dr. Jean-Claude (JC)",
    email: "jc@cabinet.fr",
    consultations: 87,
    enregistrements: 54,
    analyseIA: "62%",
    scoreMoyen: 69,
    dateAnalyse: "08/12/2025",
  },
  {
    id: 5,
    cabinet: "Cabinet Sourire",
    email: "sourire@cabinet.fr",
    consultations: 110,
    enregistrements: 85,
    analyseIA: "77%",
    scoreMoyen: 72,
    dateAnalyse: "11/12/2025",
  },
]

const detailConsultationsData = [
  { date: "01/12", duree: "12m", type: "Consultation", intervenant: "Dr Martin", devis: "Oui", score: 85 },
  { date: "01/12", duree: "18m", type: "Soin", intervenant: "Assistante", devis: "Non", score: 92 },
  { date: "02/12", duree: "15m", type: "Consultation", intervenant: "Dr Martin", devis: "Oui", score: 78 },
  { date: "02/12", duree: "25m", type: "Chirurgie", intervenant: "Dr Martin", devis: "Oui", score: 88 },
  { date: "03/12", duree: "10m", type: "Consultation", intervenant: "Assistante", devis: "Non", score: 72 },
]

const dataChartConsultations = [
  { date: "01", new: 8, treated: 7, scheduled: 15 },
  { date: "02", new: 10, treated: 9, scheduled: 18 },
  { date: "03", new: 12, treated: 11, scheduled: 20 },
  { date: "04", new: 9, treated: 8, scheduled: 16 },
  { date: "05", new: 15, treated: 14, scheduled: 25 },
  { date: "06", new: 13, treated: 12, scheduled: 22 },
  { date: "07", new: 16, treated: 15, scheduled: 28 },
  { date: "08", new: 11, treated: 10, scheduled: 19 },
  { date: "09", new: 18, treated: 17, scheduled: 30 },
  { date: "10", new: 14, treated: 13, scheduled: 24 },
  { date: "11", new: 19, treated: 18, scheduled: 32 },
  { date: "12", new: 12, treated: 11, scheduled: 21 },
]

export default function ConsultationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCabinet, setSelectedCabinet] = useState<typeof consultationsData[0] | null>(null)

  const filteredConsultations = consultationsData.filter(
    (consultation) =>
      consultation.cabinet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Analyse des consultations</h1>
          <p className="text-slate-600">Comparatifs des performances des cabinets</p>
        </div>

        {/* Recherche */}
        <Card className="bg-white border-slate-200 mb-8 rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <Input
                  placeholder="Rechercher un praticien ou un cabinet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau global des cabinets */}
        <Card className="bg-white border-slate-200 mb-8 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Tableau globale des cabinets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-4 px-4 text-slate-600 font-semibold">PRATICIEN / CABINET</th>
                    <th className="text-left py-4 px-4 text-slate-600 font-semibold">NB CONSULTATIONS</th>
                    <th className="text-left py-4 px-4 text-slate-600 font-semibold">NB ENREGISTREMENT</th>
                    <th className="text-left py-4 px-4 text-slate-600 font-semibold">% ANALYSÉ</th>
                    <th className="text-left py-4 px-4 text-slate-600 font-semibold">SCORE MOYEN</th>
                    <th className="text-left py-4 px-4 text-slate-600 font-semibold">DATE DE DERNIÈRE ANALYSE</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConsultations.map((consultation) => (
                    <Dialog key={consultation.id}>
                      <DialogTrigger asChild>
                        <tr
                          className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                          onClick={() => setSelectedCabinet(consultation)}
                        >
                          <td className="py-4 px-4">
                            <div>
                              <p className="text-slate-900 font-medium">{consultation.cabinet}</p>
                              <p className="text-slate-500 text-xs">{consultation.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-slate-600">{consultation.consultations}</td>
                          <td className="py-4 px-4 text-slate-600">{consultation.enregistrements}</td>
                          <td className="py-4 px-4">
                            <Badge className="bg-green-500/20 text-green-400">{consultation.analyseIA}</Badge>
                          </td>
                          <td className="py-4 px-4 text-slate-600 font-semibold">{consultation.scoreMoyen}%</td>
                          <td className="py-4 px-4 text-slate-600">{consultation.dateAnalyse}</td>
                        </tr>
                      </DialogTrigger>

                      <DialogContent className="bg-white border-slate-200 max-w-5xl max-h-96 overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-slate-900">Cabinet : {consultation.cabinet}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Tableau des consultations */}
                          <div>
                            <h3 className="text-slate-900 font-bold mb-4">Tableau des consultations par cabinet</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-slate-200">
                                    <th className="text-left py-2 px-2 text-slate-600">DATE & HEURE</th>
                                    <th className="text-left py-2 px-2 text-slate-600">DURÉE</th>
                                    <th className="text-left py-2 px-2 text-slate-600">TYPE</th>
                                    <th className="text-left py-2 px-2 text-slate-600">INTERVENANT</th>
                                    <th className="text-left py-2 px-2 text-slate-600">DEVIS ÉVOQUÉ</th>
                                    <th className="text-left py-2 px-2 text-slate-600">SCORE GLOBAL</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {detailConsultationsData.map((item, idx) => (
                                    <tr key={idx} className="border-b border-slate-100">
                                      <td className="py-2 px-2 text-slate-600">{item.date}</td>
                                      <td className="py-2 px-2 text-slate-600">{item.duree}</td>
                                      <td className="py-2 px-2 text-slate-600">{item.type}</td>
                                      <td className="py-2 px-2 text-slate-600">{item.intervenant}</td>
                                      <td className="py-2 px-2 text-slate-600">{item.devis}</td>
                                      <td className="py-2 px-2 text-slate-600 font-semibold">{item.score}%</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Graphiques d'analyses */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <Card className="bg-white border-slate-200 col-span-3 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Nombre de nouveaux patients</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataChartConsultations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0" }} />
                  <Bar dataKey="new" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 text-sm">Nombre de patients traités</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dataChartConsultations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0" }} />
                  <Bar dataKey="treated" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 text-sm">Nombre de patients sur l'agenda</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dataChartConsultations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0" }} />
                  <Bar dataKey="scheduled" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 text-sm">Score moyen</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-56">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400">82%</div>
                <p className="text-slate-600 text-sm mt-2">Moyen</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
