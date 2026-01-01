"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, Calendar, FileText } from "lucide-react"

const reportsData = [
  {
    id: 1,
    periode: "Novembre 2024",
    dateGeneration: "2024-12-01",
    scoreGlobal: 87,
    statut: "disponible",
    taille: "2.3 MB",
    highlights: ["Performance CA: 90%", "Taux présence: 92%", "25 nouveaux patients"],
  },
  {
    id: 2,
    periode: "Octobre 2024",
    dateGeneration: "2024-11-01",
    scoreGlobal: 84,
    statut: "disponible",
    taille: "2.1 MB",
    highlights: ["Performance CA: 86%", "Taux présence: 90%", "22 nouveaux patients"],
  },
  {
    id: 3,
    periode: "Septembre 2024",
    dateGeneration: "2024-10-01",
    scoreGlobal: 89,
    statut: "disponible",
    taille: "2.4 MB",
    highlights: ["Performance CA: 88%", "Taux présence: 88%", "28 nouveaux patients"],
  },
]

interface CabinetReportsProps {
  cabinetId: number
}

export function CabinetReports({ cabinetId }: CabinetReportsProps) {
  const [selectedReport, setSelectedReport] = useState<number | null>(null)

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (score >= 80) return <Badge className="bg-blue-100 text-blue-800">Bon</Badge>
    if (score >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Moyen</Badge>
    return <Badge className="bg-red-100 text-red-800">À améliorer</Badge>
  }

  const handleDownload = (reportId: number) => {
    console.log(`Téléchargement du rapport ${reportId}`)
    // Ici, déclencher le téléchargement du PDF
  }

  const handlePreview = (reportId: number) => {
    setSelectedReport(reportId)
    console.log(`Aperçu du rapport ${reportId}`)
  }

  return (
    <div className="space-y-6">
      {/* Rapport du Mois */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">Rapport du Mois</CardTitle>
              <CardDescription className="text-blue-700">
                Votre rapport de performance pour Novembre 2024
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-900">87/100</div>
              {getScoreBadge(87)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">90%</div>
              <div className="text-sm text-gray-600">Performance CA</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">92%</div>
              <div className="text-sm text-gray-600">Taux de Présence</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">25</div>
              <div className="text-sm text-gray-600">Nouveaux Patients</div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={() => handlePreview(1)} className="flex-1">
              <Eye className="mr-2 h-4 w-4" />
              Consulter
            </Button>
            <Button onClick={() => handleDownload(1)} variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Télécharger PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historique des Rapports */}
      <Card>
        <CardHeader>
          <CardTitle>Historique de vos Rapports</CardTitle>
          <CardDescription>Consultez vos rapports des mois précédents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Période</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportsData.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{report.periode}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{report.scoreGlobal}/100</span>
                      {getScoreBadge(report.scoreGlobal)}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(report.dateGeneration).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>{report.taille}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handlePreview(report.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(report.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Aperçu du Rapport Sélectionné */}
      {selectedReport && (
        <Card>
          <CardHeader>
            <CardTitle>Aperçu du Rapport</CardTitle>
            <CardDescription>Rapport de {reportsData.find((r) => r.id === selectedReport)?.periode}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Rapport Mensuel d'Analyse</h3>
                <p className="text-gray-600">Cabinet Dr. Martin - Paris</p>
                <p className="text-sm text-gray-500">{reportsData.find((r) => r.id === selectedReport)?.periode}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">
                    {reportsData.find((r) => r.id === selectedReport)?.scoreGlobal}/100
                  </div>
                  <div className="text-sm text-gray-600">Score Global</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">45 000€</div>
                  <div className="text-sm text-gray-600">Chiffre d'Affaires</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">180</div>
                  <div className="text-sm text-gray-600">Rendez-vous</div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Ceci est un aperçu. Téléchargez le PDF complet pour voir l'analyse détaillée et toutes les
                  recommandations.
                </p>
                <Button onClick={() => handleDownload(selectedReport)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Télécharger le Rapport Complet
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
