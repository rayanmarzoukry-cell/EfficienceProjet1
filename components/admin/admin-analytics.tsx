"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Database, Zap } from "lucide-react"

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      {/* Info Section */}
      <Card className="border-slate-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <BarChart3 className="w-5 h-5" />
            Analyse Avancée - Préparation Power BI
          </CardTitle>
          <CardDescription className="text-blue-800">
            Cette section se connectera à Power BI pour afficher des analyses approfondies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Data Status */}
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-green-600" />
                <p className="text-sm font-medium text-slate-900">Données disponibles</p>
              </div>
              <p className="text-2xl font-bold text-slate-900">✅ OK</p>
              <p className="text-xs text-slate-500 mt-1">
                Tous les data sources sont synchronisés
              </p>
            </div>

            {/* Power BI Status */}
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <p className="text-sm font-medium text-slate-900">Power BI</p>
              </div>
              <p className="text-2xl font-bold text-slate-900">⏳ Préparation</p>
              <p className="text-xs text-slate-500 mt-1">
                Intégration en cours de développement
              </p>
            </div>

            {/* Connection */}
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-medium text-slate-900">Connection Status</p>
              </div>
              <p className="text-2xl font-bold text-slate-900">🔌 Prêt</p>
              <p className="text-xs text-slate-500 mt-1">
                MongoDB Atlas synchronisé
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Metrics */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Métriques Clés</CardTitle>
          <CardDescription>
            Statistiques en attente de synchronisation Power BI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "CA Total",
                metric: "Chargement...",
                icon: "💰",
              },
              {
                title: "Nombre de Patients",
                metric: "Chargement...",
                icon: "👥",
              },
              {
                title: "Taux de Conversion",
                metric: "Chargement...",
                icon: "📊",
              },
              {
                title: "Performance Moyenne",
                metric: "Chargement...",
                icon: "⭐",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-4 rounded-lg border border-slate-200"
              >
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <span>{item.icon}</span>
                  {item.title}
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {item.metric}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Power BI Setup Instructions */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>📋 Procédure d'Intégration Power BI</CardTitle>
          <CardDescription>
            Suivez ces étapes pour connecter Power BI à vos données
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[
              {
                step: 1,
                title: "Ouvrir Power BI Desktop",
                desc: "Téléchargez et installez Power BI Desktop",
              },
              {
                step: 2,
                title: "Nouvelle Source de Données",
                desc: "Data → MongoDB → Saisissez vos credentials MongoDB Atlas",
              },
              {
                step: 3,
                title: "Sélectionner Collections",
                desc: "Choisissez: patients, cabinets, rendezvous, audit_logs",
              },
              {
                step: 4,
                title: "Créer les Dashboards",
                desc: "Construisez vos visualisations (Pie Charts, KPI cards, etc)",
              },
              {
                step: 5,
                title: "Publier en ligne",
                desc: "File → Publish → Partagez le rapport en ligne",
              },
              {
                step: 6,
                title: "Intégrer ici",
                desc: "Récupérez l'iframe et l'ajouter à cette page",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-yellow-900">
              <strong>💡 Conseil:</strong> Réservez 1-2 heures pour la configuration initiale. 
              Une fois faite, les mises à jour de données se feront automatiquement.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Connection Details */}
      <Card className="border-slate-200 bg-slate-50">
        <CardHeader>
          <CardTitle>🔌 Détails de Connexion MongoDB</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 font-mono text-sm bg-white p-4 rounded-lg border border-slate-200">
            <div>
              <p className="text-slate-600">Serveur MongoDB:</p>
              <p className="text-slate-900 font-bold">MongoDB Atlas Cloud</p>
            </div>
            <div>
              <p className="text-slate-600">Cluster:</p>
              <p className="text-slate-900 font-bold">efficienceprojet</p>
            </div>
            <div>
              <p className="text-slate-600">Collections:</p>
              <div className="text-slate-900 space-y-1 mt-1">
                <p>• patients</p>
                <p>• cabinets</p>
                <p>• rendezvous</p>
                <p>• audit_logs</p>
              </div>
            </div>
            <div>
              <p className="text-slate-600">Connection String (à utiliser dans Power BI):</p>
              <p className="text-slate-900 break-all text-xs">
                mongodb+srv://[user]:[password]@cluster.mongodb.net/efficience
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-4">
            ℹ️ Utilisez les credentials de votre compte MongoDB Atlas pour la connexion.
          </p>
        </CardContent>
      </Card>

      {/* Embedded Power BI (Future) */}
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>📊 Tableau de Bord Power BI</CardTitle>
          <CardDescription>
            Les rapports Power BI s'afficheront ici une fois intégrés
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-96 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 mb-2">Power BI Dashboard (À intégrer)</p>
            <p className="text-sm text-slate-500">
              Le rapport Power BI s'affichera ici après configuration
            </p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700" disabled>
              Configuration Power BI
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
