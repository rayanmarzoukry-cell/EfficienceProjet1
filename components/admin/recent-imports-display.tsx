"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock, Database, BarChart3 } from "lucide-react"

interface ImportRecord {
  id: string
  type: 'patients' | 'finances' | 'production' | 'appointments'
  status: 'success' | 'error'
  recordsProcessed: number
  message: string
  timestamp: string
  timestampLocal: string
  cabinetId: string
  details: {
    inserted: number
    errors: string[]
    errorMessage: string | null
  }
}

interface Stats {
  totalImports: number
  successCount: number
  errorCount: number
  totalRecords: number
  totalInserted: number
  byType: {
    patients: number
    finances: number
    production: number
    appointments: number
  }
  successRate: number
}

export default function RecentImportsDisplay() {
  const [imports, setImports] = useState<ImportRecord[]>([])
  const [stats, setStats] = useState<Stats>({
    totalImports: 0,
    successCount: 0,
    errorCount: 0,
    totalRecords: 0,
    totalInserted: 0,
    byType: { patients: 0, finances: 0, production: 0, appointments: 0 },
    successRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // 🔄 Récupérer les imports toutes les 10 secondes
  useEffect(() => {
    const fetchImports = async () => {
      try {
        const response = await fetch('/api/admin/recent-imports?minutes=5&limit=15')
        const data = await response.json()

        if (data.success) {
          setImports(data.imports)
          setStats(data.stats)
          setLastUpdate(new Date())
        }
      } catch (error) {
        console.error('❌ Error fetching imports:', error)
      } finally {
        setLoading(false)
      }
    }

    // Fetch initial data
    fetchImports()

    // Set up interval for polling
    const interval = setInterval(fetchImports, 10000) // 10 secondes

    return () => clearInterval(interval)
  }, [])

  // 🎨 Mapper les types vers des icônes et couleurs
  const getTypeConfig = (type: string) => {
    const configs: Record<string, { icon: string; color: string; label: string }> = {
      patients: { icon: '👥', color: 'bg-blue-50 border-blue-200', label: 'Patients' },
      finances: { icon: '💰', color: 'bg-green-50 border-green-200', label: 'Finances' },
      production: { icon: '⚙️', color: 'bg-purple-50 border-purple-200', label: 'Production' },
      appointments: { icon: '📅', color: 'bg-orange-50 border-orange-200', label: 'RDV' }
    }
    return configs[type] || { icon: '📦', color: 'bg-gray-50', label: 'Autre' }
  }

  return (
    <div className="space-y-6">
      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Imports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalImports}</div>
            <p className="text-xs text-slate-500 mt-1">Dernières 5 min</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700">✅ Réussis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.successCount}</div>
            <p className="text-xs text-green-600 mt-1">{stats.successRate}% de succès</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-700">❌ Erreurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.errorCount}</div>
            <p className="text-xs text-red-600 mt-1">À investiguer</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700">📊 Enregistrements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalInserted}</div>
            <p className="text-xs text-blue-600 mt-1">Insérés dans MongoDB</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Last Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-mono text-slate-600">
              {lastUpdate.toLocaleTimeString('fr-FR')}
            </div>
            <p className="text-xs text-slate-500 mt-2">Auto-refresh: 10s</p>
          </CardContent>
        </Card>
      </div>

      {/* 📈 Répartition par type */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Répartition par type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['patients', 'finances', 'production', 'appointments'].map((type) => (
              <div key={type} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="text-lg font-bold text-slate-900">
                  {stats.byType[type as keyof typeof stats.byType]}
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  {getTypeConfig(type).icon} {getTypeConfig(type).label}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 📝 Liste des imports récents */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Historique des imports (5 dernières minutes)
          </CardTitle>
          <CardDescription>
            {loading ? 'Chargement...' : `${imports.length} imports`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-24">
              <div className="animate-pulse text-slate-500">Chargement des données...</div>
            </div>
          ) : imports.length === 0 ? (
            <div className="flex items-center justify-center h-24 text-slate-500">
              Aucun import détecté dans les 5 dernières minutes
            </div>
          ) : (
            <div className="space-y-3">
              {imports.map((imp) => {
                const typeConfig = getTypeConfig(imp.type)
                return (
                  <div
                    key={imp.id}
                    className={`border-2 rounded-lg p-4 ${typeConfig.color} transition-all hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Icône du type */}
                        <div className="text-2xl mt-1">{typeConfig.icon}</div>

                        {/* Contenu */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-900">
                              {typeConfig.label}
                            </span>
                            <Badge
                              variant={imp.status === 'success' ? 'default' : 'destructive'}
                              className={
                                imp.status === 'success'
                                  ? 'bg-green-600'
                                  : 'bg-red-600'
                              }
                            >
                              {imp.status === 'success' ? '✅ Succès' : '❌ Erreur'}
                            </Badge>
                            <span className="text-xs text-slate-600">
                              Cabinet: {imp.cabinetId}
                            </span>
                          </div>

                          <p className="text-sm text-slate-700 mt-2">
                            {imp.message}
                          </p>

                          {/* Détails */}
                          <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <Database className="w-4 h-4" />
                              {imp.details.inserted} enregistrements insérés
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {imp.timestampLocal}
                            </span>
                          </div>

                          {/* Erreurs si présentes */}
                          {imp.details.errorMessage && (
                            <div className="mt-2 text-xs bg-red-100 text-red-700 p-2 rounded border border-red-300">
                              <div className="flex items-start gap-1">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{imp.details.errorMessage}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
