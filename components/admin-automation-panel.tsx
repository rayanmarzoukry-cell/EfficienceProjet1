"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, Pause, RotateCcw, Clock, CheckCircle, AlertTriangle, Settings, Activity } from "lucide-react"

interface JobStatus {
  running: boolean
  scheduled: boolean
}

interface SchedulerStatus {
  scheduler: string
  jobs: Record<string, JobStatus>
  lastUpdate: string
}

export function AdminAutomationPanel() {
  const [status, setStatus] = useState<SchedulerStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastAction, setLastAction] = useState<string>("")

  const jobsConfig = {
    "monthly-reports": {
      name: "Rapports Mensuels",
      description: "Génération automatique des rapports PDF",
      schedule: "1er de chaque mois à 00:00",
      icon: "📊",
    },
    "monthly-emails": {
      name: "Envoi Emails",
      description: "Envoi automatique des rapports par email",
      schedule: "1er de chaque mois à 01:00",
      icon: "📧",
    },
    "daily-import": {
      name: "Import Quotidien",
      description: "Import automatique des données cabinets",
      schedule: "Tous les jours à 23:00",
      icon: "📊",
    },
    "alerts-check": {
      name: "Vérification Alertes",
      description: "Contrôle des seuils et alertes",
      schedule: "Toutes les heures",
      icon: "🚨",
    },
    cleanup: {
      name: "Nettoyage",
      description: "Nettoyage fichiers temporaires",
      schedule: "Dimanche à 02:00",
      icon: "🧹",
    },
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000) // Refresh toutes les 30s
    return () => clearInterval(interval)
  }, [])

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/automation/scheduler")
      const data = await response.json()
      if (data.success) {
        setStatus(data.data)
      }
    } catch (error) {
      console.error("Erreur récupération statut:", error)
    }
  }

  const executeAction = async (action: string, jobName?: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/automation/scheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, jobName }),
      })

      const result = await response.json()
      if (result.success) {
        setLastAction(result.message)
        await fetchStatus()
      } else {
        setLastAction(`Erreur: ${result.error}`)
      }
    } catch (error) {
      setLastAction(`Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const toggleJob = async (jobName: string, currentlyRunning: boolean) => {
    const action = currentlyRunning ? "stop-job" : "start-job"
    await executeAction(action, jobName)
  }

  if (!status) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Chargement du statut d'automatisation...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statut Global */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Automatisation Système
              </CardTitle>
              <CardDescription>Contrôle et monitoring des tâches automatisées</CardDescription>
            </div>
            <Badge
              variant={status.scheduler === "active" ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {status.scheduler === "active" ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <AlertTriangle className="h-3 w-3" />
              )}
              {status.scheduler === "active" ? "Actif" : "Inactif"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Dernière mise à jour: {new Date(status.lastUpdate).toLocaleString("fr-FR")}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => executeAction("start-all")} disabled={loading} size="sm" variant="outline">
                <Play className="h-4 w-4 mr-1" />
                Tout Démarrer
              </Button>
              <Button onClick={() => executeAction("stop-all")} disabled={loading} size="sm" variant="outline">
                <Pause className="h-4 w-4 mr-1" />
                Tout Arrêter
              </Button>
            </div>
          </div>

          {lastAction && (
            <Alert className="mb-4">
              <AlertDescription>{lastAction}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Tâches Individuelles */}
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(jobsConfig).map(([jobKey, config]) => {
          const jobStatus = status.jobs[jobKey]
          const isRunning = jobStatus?.running || false

          return (
            <Card key={jobKey}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <CardTitle className="text-base">{config.name}</CardTitle>
                      <CardDescription className="text-sm">{config.description}</CardDescription>
                    </div>
                  </div>
                  <Switch checked={isRunning} onCheckedChange={() => toggleJob(jobKey, isRunning)} disabled={loading} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Planification:</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {config.schedule}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Statut:</span>
                    <Badge variant={isRunning ? "default" : "secondary"} className="text-xs">
                      {isRunning ? "En cours" : "Arrêté"}
                    </Badge>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => executeAction("execute-now", jobKey)}
                      disabled={loading}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Exécuter Maintenant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Logs Récents */}
      <Card>
        <CardHeader>
          <CardTitle>Logs d'Activité</CardTitle>
          <CardDescription>Dernières exécutions des tâches automatisées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span>✅ Rapports mensuels générés avec succès</span>
              <span className="text-muted-foreground">Il y a 2h</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span>📧 24 emails envoyés automatiquement</span>
              <span className="text-muted-foreground">Il y a 3h</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
              <span>⚠️ 2 alertes détectées et envoyées</span>
              <span className="text-muted-foreground">Il y a 5h</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>🧹 Nettoyage automatique effectué</span>
              <span className="text-muted-foreground">Hier</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
