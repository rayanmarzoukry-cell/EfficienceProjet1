"use client"

import { useState, useEffect } from "react"
import ProtectedLayout from "@/components/layout/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, BarChart3, Users, FileText, CheckCircle2, History, Settings, Activity } from "lucide-react"
import AdminImport from "@/components/admin/admin-import"
import AuditLog from "@/components/admin/audit-log"
import AdminAnalytics from "@/components/admin/admin-analytics"
import N8nSyncButton from "@/components/admin/n8n-sync-button"
import RecentImportsDisplay from "@/components/admin/recent-imports-display"

interface AdminStats {
  totalCabinets: number
  totalPatients: number
  totalAppointments: number
  lastUpdate: string
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalCabinets: 0,
    totalPatients: 0,
    totalAppointments: 0,
    lastUpdate: new Date().toLocaleString("fr-FR"),
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      const [patientsRes, cabinetsRes, rendezvousRes] = await Promise.all([
        fetch("/api/patients"),
        fetch("/api/cabinets"),
        fetch("/api/rendezvous"),
      ])

      const patients = await patientsRes.json()
      const cabinets = await cabinetsRes.json()
      const rendezvous = await rendezvousRes.json()

      setStats({
        totalCabinets: cabinets.length || 0,
        totalPatients: patients.length || 0,
        totalAppointments: rendezvous.length || 0,
        lastUpdate: new Date().toLocaleString("fr-FR"),
      })
    } catch (error) {
      console.error("❌ Erreur chargement stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Panneau d'Administration
          </h1>
          <p className="text-slate-600">
            Gestion sécurisée des données, importation et analyses
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="w-full">
          <div className="grid w-full grid-cols-5 border-b border-slate-200 bg-transparent p-0">
            <button
              onClick={() => setActiveTab("overview")}
              className={`border-b-2 rounded-none px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Accueil
            </button>
            <button
              onClick={() => setActiveTab("import")}
              className={`border-b-2 rounded-none px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === "import"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Upload className="w-4 h-4" />
              Importation
            </button>
            <button
              onClick={() => setActiveTab("recent")}
              className={`border-b-2 rounded-none px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === "recent"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Activity className="w-4 h-4" />
              Imports en Temps Réel
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`border-b-2 rounded-none px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === "audit"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <History className="w-4 h-4" />
              Audit
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`border-b-2 rounded-none px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === "analytics"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Settings className="w-4 h-4" />
              Analyses
            </button>
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-8 mt-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-slate-200 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Cabinets
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats.totalCabinets}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Cabinets enregistrés
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Patients
                  </CardTitle>
                  <Users className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats.totalPatients}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Patients en base de données
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Rendez-vous
                  </CardTitle>
                  <FileText className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    {stats.totalAppointments}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Rendez-vous planifiés
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* N8N Sync Button */}
            <div className="grid grid-cols-1 gap-6">
              <N8nSyncButton />
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Data Import Section */}
              <Card className="border-slate-200 bg-white lg:col-span-2">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-blue-600" />
                    Accès Rapide
                  </CardTitle>
                  <CardDescription>
                    Actions principales disponibles
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => setActiveTab("import")}
                      className="bg-blue-600 hover:bg-blue-700 text-white h-24 flex flex-col items-center justify-center gap-2"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-center">
                        Importer des données<br />
                        <span className="text-xs">CSV/Excel</span>
                      </span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab("audit")}
                      variant="outline"
                      className="border-slate-200 h-24 flex flex-col items-center justify-center gap-2"
                    >
                      <History className="w-6 h-6" />
                      <span className="text-center">
                        Journal d'audit<br />
                        <span className="text-xs">Historique</span>
                      </span>
                    </Button>
                    <Button
                      onClick={() => setActiveTab("analytics")}
                      variant="outline"
                      className="border-slate-200 h-24 flex flex-col items-center justify-center gap-2"
                    >
                      <BarChart3 className="w-6 h-6" />
                      <span className="text-center">
                        Analyses Power BI<br />
                        <span className="text-xs">Rapports</span>
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    État du Système
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600">Statut MongoDB</p>
                    <p className="text-sm font-medium text-green-600">
                      ✅ Connecté
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Dernière mise à jour</p>
                    <p className="text-sm font-medium text-slate-900">
                      {stats.lastUpdate}
                    </p>
                  </div>
                  <Button
                    onClick={fetchAdminStats}
                    variant="outline"
                    className="w-full text-slate-700 border-slate-200"
                    disabled={loading}
                  >
                    Actualiser les données
                  </Button>
                </CardContent>
              </Card>

              {/* Security Info */}
              <Card className="border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-base">Sécurité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-600">Authentification</p>
                    <p className="text-slate-900 font-medium">JWT (24h)</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Accès</p>
                    <p className="text-slate-900 font-medium">Admin uniquement</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Base de données</p>
                    <p className="text-slate-900 font-medium">MongoDB Atlas</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
                <CardDescription>
                  Historique des opérations d'administration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-slate-600">Connexion admin</span>
                    <span className="text-slate-500">{new Date().toLocaleTimeString("fr-FR")}</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-slate-600">MongoDB synchronisé</span>
                    <span className="text-slate-500">Il y a quelques secondes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Système prêt</span>
                    <span className="text-green-600 font-medium">Actif</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {/* IMPORT TAB */}
          {activeTab === "import" && (
            <div className="mt-8">
            <AdminImport />
            </div>
          )}

          {/* RECENT IMPORTS TAB */}
          {activeTab === "recent" && (
            <div className="mt-8">
            <RecentImportsDisplay />
            </div>
          )}

          {/* AUDIT TAB */}
          {activeTab === "audit" && (
            <div className="mt-8">
            <AuditLog />
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <div className="mt-8">
            <AdminAnalytics />
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  )
}