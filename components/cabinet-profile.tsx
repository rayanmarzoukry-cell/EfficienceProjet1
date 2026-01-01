"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, Calendar, Target, Edit, Save, X, CheckCircle } from "lucide-react"

interface Cabinet {
  id: number
  nom: string
  ville: string
  email: string
  telephone: string
  adresse: string
}

interface CabinetProfileProps {
  cabinet: Cabinet
}

export function CabinetProfile({ cabinet }: CabinetProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(cabinet)

  const objectifs = {
    chiffreAffaires: 50000,
    nombreRendezVous: 200,
    tauxAbsence: 10,
    nouveauxPatients: 20,
  }

  const handleSave = () => {
    // Ici, envoyer les données modifiées à l'API
    console.log("Sauvegarde des données:", formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(cabinet)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Informations du Cabinet */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Informations du Cabinet</CardTitle>
              <CardDescription>Gérez les informations de votre cabinet</CardDescription>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm">
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="mr-2 h-4 w-4" />
                    Annuler
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du Cabinet</Label>
              {isEditing ? (
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{cabinet.nom}</span>
                  <Badge variant="secondary">Actif</Badge>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ville">Ville</Label>
              {isEditing ? (
                <Input
                  id="ville"
                  value={formData.ville}
                  onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{cabinet.ville}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{cabinet.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              {isEditing ? (
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{cabinet.telephone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            {isEditing ? (
              <Textarea
                id="adresse"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                rows={2}
              />
            ) : (
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <span>{cabinet.adresse}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Objectifs */}
      <Card>
        <CardHeader>
          <CardTitle>Vos Objectifs</CardTitle>
          <CardDescription>Objectifs mensuels définis pour votre cabinet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium text-blue-900">Chiffre d'Affaires</div>
                <div className="text-2xl font-bold text-blue-600">
                  {objectifs.chiffreAffaires.toLocaleString("fr-FR")}€
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium text-green-900">Rendez-vous</div>
                <div className="text-2xl font-bold text-green-600">{objectifs.nombreRendezVous}</div>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <div className="font-medium text-yellow-900">Taux d'Absence Max</div>
                <div className="text-2xl font-bold text-yellow-600">{objectifs.tauxAbsence}%</div>
              </div>
              <X className="h-8 w-8 text-yellow-500" />
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <div className="font-medium text-purple-900">Nouveaux Patients</div>
                <div className="text-2xl font-bold text-purple-600">{objectifs.nouveauxPatients}</div>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres de Notification */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Gérez vos préférences de notification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Rapport mensuel</div>
              <div className="text-sm text-gray-500">Recevoir le rapport par email chaque début de mois</div>
            </div>
            <Badge className="bg-green-100 text-green-800">Activé</Badge>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Alertes de performance</div>
              <div className="text-sm text-gray-500">Notifications en cas de baisse significative des performances</div>
            </div>
            <Badge className="bg-green-100 text-green-800">Activé</Badge>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Rappels d'objectifs</div>
              <div className="text-sm text-gray-500">Rappels hebdomadaires sur l'avancement de vos objectifs</div>
            </div>
            <Badge variant="secondary">Désactivé</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
