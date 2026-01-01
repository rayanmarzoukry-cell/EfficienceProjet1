"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const monthlyEvolution = [
  { month: "Juil", ca: 42000, rdv: 175, presence: 89 },
  { month: "Août", ca: 38000, rdv: 160, presence: 91 },
  { month: "Sept", ca: 44000, rdv: 185, presence: 88 },
  { month: "Oct", ca: 43000, rdv: 178, presence: 90 },
  { month: "Nov", ca: 45000, rdv: 180, presence: 92 },
]

const traitementData = [
  { name: "Consultations", value: 120, color: "#3b82f6" },
  { name: "Soins", value: 45, color: "#10b981" },
  { name: "Chirurgie", value: 10, color: "#f59e0b" },
  { name: "Orthodontie", value: 5, color: "#ef4444" },
]

const objectifsData = [
  { categorie: "Chiffre d'Affaires", realise: 90, objectif: 100 },
  { categorie: "Rendez-vous", realise: 90, objectif: 100 },
  { categorie: "Nouveaux Patients", realise: 125, objectif: 100 },
  { categorie: "Taux de Présence", realise: 105, objectif: 100 },
]

interface CabinetPerformanceProps {
  cabinetId: number
}

export function CabinetPerformance({ cabinetId }: CabinetPerformanceProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Évolution Mensuelle */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Évolution de vos Performances</CardTitle>
          <CardDescription>Suivi de vos indicateurs clés sur 5 mois</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyEvolution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="ca" fill="#3b82f6" name="CA (€)" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="presence"
                stroke="#10b981"
                strokeWidth={2}
                name="Présence (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Répartition des Traitements */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des Traitements</CardTitle>
          <CardDescription>Distribution de vos actes ce mois</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={traitementData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {traitementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Objectifs vs Réalisé */}
      <Card>
        <CardHeader>
          <CardTitle>Objectifs vs Réalisé</CardTitle>
          <CardDescription>Votre performance par rapport aux objectifs</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={objectifsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 150]} />
              <YAxis dataKey="categorie" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="objectif" fill="#e5e7eb" name="Objectif" />
              <Bar dataKey="realise" fill="#3b82f6" name="Réalisé" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommandations */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Recommandations Personnalisées</CardTitle>
          <CardDescription>Conseils pour améliorer vos performances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-blue-900">Optimisation du Chiffre d'Affaires</h4>
                <p className="text-sm text-blue-700">
                  Vous êtes à 90% de votre objectif. Considérez proposer plus de traitements esthétiques ou
                  d'orthodontie pour atteindre les 100%.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-green-900">Excellent Taux de Présence</h4>
                <p className="text-sm text-green-700">
                  Votre taux de présence de 92% est excellent ! Continuez avec votre système de rappel.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-yellow-900">Planification des Rendez-vous</h4>
                <p className="text-sm text-yellow-700">
                  Optimisez vos créneaux de fin de journée pour atteindre votre objectif de 200 RDV/mois.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
