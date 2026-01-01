"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Mail, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const cabinetsData = [
  {
    id: 1,
    nom: "Cabinet Dr. Martin",
    ville: "Paris",
    email: "contact@cabinet-martin.fr",
    dernierRapport: "2024-12-01",
    performance: 92,
    statut: "actif",
    chiffreAffaires: 45000,
  },
  {
    id: 2,
    nom: "Dentaire Plus Lyon",
    ville: "Lyon",
    email: "admin@dentaire-plus.fr",
    dernierRapport: "2024-12-01",
    performance: 88,
    statut: "actif",
    chiffreAffaires: 38000,
  },
  {
    id: 3,
    nom: "Cabinet Sourire",
    ville: "Marseille",
    email: "info@cabinet-sourire.fr",
    dernierRapport: "2024-11-28",
    performance: 76,
    statut: "attention",
    chiffreAffaires: 32000,
  },
  {
    id: 4,
    nom: "Dental Care Bordeaux",
    ville: "Bordeaux",
    email: "contact@dentalcare-bdx.fr",
    dernierRapport: "2024-12-01",
    performance: 94,
    statut: "actif",
    chiffreAffaires: 52000,
  },
]

export function CabinetsTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCabinets = cabinetsData.filter(
    (cabinet) =>
      cabinet.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cabinet.ville.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getPerformanceBadge = (performance: number) => {
    if (performance >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (performance >= 80) return <Badge className="bg-blue-100 text-blue-800">Bon</Badge>
    if (performance >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Moyen</Badge>
    return <Badge className="bg-red-100 text-red-800">Faible</Badge>
  }

  const handleGenerateReport = async (cabinetId: number) => {
    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cabinetId }),
      })

      if (response.ok) {
        alert("Rapport généré avec succès!")
      }
    } catch (error) {
      console.error("Erreur lors de la génération:", error)
    }
  }

  const handleSendEmail = async (cabinetId: number) => {
    try {
      const response = await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cabinetId }),
      })

      if (response.ok) {
        alert("Email envoyé avec succès!")
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Cabinets</CardTitle>
        <CardDescription>Liste des cabinets dentaires et leurs performances</CardDescription>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un cabinet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cabinet</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>CA Mensuel</TableHead>
              <TableHead>Dernier Rapport</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCabinets.map((cabinet) => (
              <TableRow key={cabinet.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{cabinet.nom}</div>
                    <div className="text-sm text-muted-foreground">{cabinet.email}</div>
                  </div>
                </TableCell>
                <TableCell>{cabinet.ville}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{cabinet.performance}%</span>
                    {getPerformanceBadge(cabinet.performance)}
                  </div>
                </TableCell>
                <TableCell>{cabinet.chiffreAffaires.toLocaleString("fr-FR")}€</TableCell>
                <TableCell>{new Date(cabinet.dernierRapport).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleGenerateReport(cabinet.id)}>
                        <Download className="mr-2 h-4 w-4" />
                        Générer rapport
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendEmail(cabinet.id)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Envoyer email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
