"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, Mail } from "lucide-react"

const reportsData = [
  {
    id: 1,
    cabinet: "Cabinet Dr. Martin",
    dateGeneration: "2024-12-01",
    periode: "Novembre 2024",
    statut: "envoyé",
    taille: "2.3 MB",
    emailEnvoye: true,
  },
  {
    id: 2,
    cabinet: "Dentaire Plus Lyon",
    dateGeneration: "2024-12-01",
    periode: "Novembre 2024",
    statut: "généré",
    taille: "1.8 MB",
    emailEnvoye: false,
  },
  {
    id: 3,
    cabinet: "Cabinet Sourire",
    dateGeneration: "2024-11-28",
    periode: "Novembre 2024",
    statut: "envoyé",
    taille: "2.1 MB",
    emailEnvoye: true,
  },
  {
    id: 4,
    cabinet: "Dental Care Bordeaux",
    dateGeneration: "2024-12-01",
    periode: "Novembre 2024",
    statut: "envoyé",
    taille: "2.5 MB",
    emailEnvoye: true,
  },
]

export function ReportsHistory() {
  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "envoyé":
        return <Badge className="bg-green-100 text-green-800">Envoyé</Badge>
      case "généré":
        return <Badge className="bg-blue-100 text-blue-800">Généré</Badge>
      case "erreur":
        return <Badge className="bg-red-100 text-red-800">Erreur</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Inconnu</Badge>
    }
  }

  const handleDownload = (reportId: number) => {
    // Simuler le téléchargement
    console.log(`Téléchargement du rapport ${reportId}`)
  }

  const handlePreview = (reportId: number) => {
    // Simuler l'aperçu
    console.log(`Aperçu du rapport ${reportId}`)
  }

  const handleResendEmail = (reportId: number) => {
    // Simuler le renvoi d'email
    console.log(`Renvoi email pour le rapport ${reportId}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des Rapports</CardTitle>
        <CardDescription>Liste des rapports générés et leur statut d'envoi</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cabinet</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Date de génération</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Taille</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportsData.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.cabinet}</TableCell>
                <TableCell>{report.periode}</TableCell>
                <TableCell>{new Date(report.dateGeneration).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>{getStatusBadge(report.statut)}</TableCell>
                <TableCell>{report.taille}</TableCell>
                <TableCell>
                  {report.emailEnvoye ? (
                    <Badge className="bg-green-100 text-green-800">✓ Envoyé</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Non envoyé</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handlePreview(report.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(report.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    {!report.emailEnvoye && (
                      <Button variant="ghost" size="sm" onClick={() => handleResendEmail(report.id)}>
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
