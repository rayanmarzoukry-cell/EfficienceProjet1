"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Mail, RotateCcw, Eye, Trash2, Zap } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AIReportGenerator } from "@/components/ai-report-generator"

// Données mock rapports
const rapportsData = [
  {
    id: 1,
    cabinet: "Dental Care Bordeaux",
    email: "contact@cabinetb.fr",
    periode: "Décembre",
    statut: "Envoyé",
    dateGeneration: "01/04",
    dateEnvoi: "02/12/2025",
  },
  {
    id: 2,
    cabinet: "Cabinet Dr. Martin",
    email: "dr.martin@cabinet.fr",
    periode: "2025",
    statut: "Envoyé",
    dateGeneration: "01/04",
    dateEnvoi: "02/12/2025",
  },
  {
    id: 3,
    cabinet: "Dr. Emmanuel (ER)",
    email: "emmanuel@cabinet.fr",
    periode: "Février",
    statut: "Généré",
    dateGeneration: "01/12/2023",
  },
  {
    id: 4,
    cabinet: "Dr. Jean-Claude (JC)",
    email: "jc@cabinet.fr",
    periode: "Avril",
    statut: "Envoyé",
    dateGeneration: "10/12/2025",
    dateEnvoi: "12/12/2025",
  },
  {
    id: 5,
    cabinet: "Cabinet Sourire",
    email: "sourire@cabinet.fr",
    periode: "Avril",
    statut: "Non généré",
  },
]

const statsRapports = [
  { label: "Rapports envoyés", count: 18, color: "bg-blue-500" },
  { label: "Rapports générés mais non envoyés", count: 4, color: "bg-purple-500" },
  { label: "Rapports non générés", count: 2, color: "bg-green-500" },
]

export default function RapportsPage() {
  const searchParams = useSearchParams()
  const cabinetFilter = searchParams.get("cabinet")
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRapport, setSelectedRapport] = useState<typeof rapportsData[0] | null>(null)
  const [generatingId, setGeneratingId] = useState<number | null>(null)
  const [generatedReports, setGeneratedReports] = useState<number[]>([])

  let filteredRapports = rapportsData.filter(
    (rapport) =>
      rapport.cabinet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rapport.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (cabinetFilter) {
    filteredRapports = filteredRapports.filter(
      (rapport) => rapport.id === parseInt(cabinetFilter)
    )
  }

  const handleGenerateReport = async (id: number) => {
    setGeneratingId(id)
    // Simulation d'une génération de rapport (2 secondes)
    setTimeout(() => {
      setGeneratedReports([...generatedReports, id])
      setGeneratingId(null)
      alert(`✅ Rapport généré avec succès pour le cabinet ${id}`)
    }, 2000)
  }

  const handleDownloadReport = (cabinetName: string) => {
    alert(`📥 Téléchargement du rapport pour ${cabinetName}...`)
  }

  const handleSendReport = (email: string, cabinetName: string) => {
    alert(`📧 Envoi du rapport pour ${cabinetName} à ${email}...`)
  }

  const handleResendReport = (email: string, cabinetName: string) => {
    alert(`🔄 Renvoi du rapport pour ${cabinetName} à ${email}...`)
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Envoyé":
        return "bg-green-500/20 text-green-400"
      case "Généré":
        return "bg-yellow-500/20 text-yellow-400"
      case "Non généré":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  return (
    <div className="p-8 bg-[#030712] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Rapports</h1>
        </div>

        {/* Vues rapides */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {statsRapports.map((stat) => (
            <Card key={stat.label} className="bg-[#090E1A] border-white/10 cursor-pointer hover:border-white/20">
              <CardContent className="p-6">
                <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filtres et recherche */}
        <Card className="bg-[#090E1A] border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <Input
                  placeholder="Rechercher un cabinet ou un cabinet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Filtres</Button>
              <Button variant="outline" className="border-white/10">Période</Button>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des rapports */}
        <Card className="bg-[#090E1A] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Tableau récapitulatif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-slate-400 font-semibold">PRATICIEN / CABINET</th>
                    <th className="text-left py-4 px-4 text-slate-400 font-semibold">PÉRIODE</th>
                    <th className="text-left py-4 px-4 text-slate-400 font-semibold">STATUT</th>
                    <th className="text-left py-4 px-4 text-slate-400 font-semibold">GÉNÉRÉ</th>
                    <th className="text-left py-4 px-4 text-slate-400 font-semibold">ENVOYÉ</th>
                    <th className="text-left py-4 px-4 text-slate-400 font-semibold">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRapports.map((rapport) => (
                    <tr key={rapport.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white font-medium">{rapport.cabinet}</p>
                          <p className="text-slate-500 text-xs">{rapport.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{rapport.periode}</td>
                      <td className="py-4 px-4">
                        <Badge className={getStatutColor(rapport.statut)}>{rapport.statut}</Badge>
                      </td>
                      <td className="py-4 px-4 text-slate-300">{rapport.dateGeneration}</td>
                      <td className="py-4 px-4 text-slate-300">{rapport.dateEnvoi || "-"}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-400 hover:text-blue-400"
                                onClick={() => setSelectedRapport(rapport)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#090E1A] border-white/10 max-w-4xl max-h-96 overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-white">Aperçu PDF - {rapport.cabinet}</DialogTitle>
                              </DialogHeader>
                              <div className="bg-white/5 p-6 rounded-lg border border-white/10 text-slate-300 font-mono text-sm">
                                <div className="text-red-400 font-bold mb-4">CABINET B - RAPPORT AVRIL 2026</div>
                                <div className="space-y-2">
                                  <p>Statut : Généré - non envoyé</p>
                                  <p>Généré le : 01/04</p>
                                  <p>Destinataire : {rapport.email}</p>
                                  <p className="mt-4">Actions :</p>
                                  <p className="ml-4">👁️ Voir PDF | 📤 Envoyer | 🔄 Régénérer</p>
                                  <p className="mt-4">Historique :</p>
                                  <p className="ml-4">- 01/04 : Rapport généré</p>
                                  <p className="ml-4 text-red-400">- 01/04 : Envoi échoué (SMTP timeout)</p>
                                  <p className="mt-4">Note interne :</p>
                                  <p className="ml-4">Ajouter une note consultant</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-slate-400 hover:text-green-400"
                            onClick={() => handleDownloadReport(rapport.cabinet)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          {rapport.statut === "Généré" ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-slate-400 hover:text-purple-400"
                              onClick={() => handleSendReport(rapport.email, rapport.cabinet)}
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          ) : rapport.statut === "Envoyé" ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-slate-400 hover:text-yellow-400"
                              onClick={() => handleResendReport(rapport.email, rapport.cabinet)}
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-slate-400 hover:text-blue-400"
                              onClick={() => handleGenerateReport(rapport.id)}
                              disabled={generatingId === rapport.id}
                            >
                              {generatingId === rapport.id ? "⏳" : "⚙️"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex gap-4 mt-8 justify-center flex-wrap">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full"
            onClick={() => {
              const nonGenerated = rapportsData.filter(r => r.statut === "Non généré")[0]
              if (nonGenerated) {
                handleGenerateReport(nonGenerated.id)
              } else {
                alert("Tous les rapports sont déjà générés!")
              }
            }}
          >
            Générer rapport →
          </Button>

          {/* Bouton IA - Génération intelligente */}
          <AIReportGenerator
            data={{
              cabinetName: rapportsData[0]?.cabinet || "Cabinet",
              cabinetData: {
                id: "cabinet-1",
                nom: rapportsData[0]?.cabinet || "Cabinet",
                caActuel: 45000,
                caObjectif: 50000,
                nouveauxPatients: 12,
                absences: 2,
                devisEnvoyes: 15,
                devisConvertis: 9,
                traitements: [
                  { nom: "Détartrage", nombre: 25 },
                  { nom: "Détartrage", nombre: 18 },
                  { nom: "Dévitalisation", nombre: 8 },
                  { nom: "Implant", nombre: 3 },
                ],
                periodicite: "mois",
              },
              period: "Décembre 2025",
            }}
          />

          <Button 
            variant="outline" 
            className="border-white/10 px-8 py-3 rounded-full"
            onClick={() => alert("📊 Historique des rapports générés...")}
          >
            Historique →
          </Button>
        </div>
      </div>
    </div>
  )
}
