"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Clock, Download } from "lucide-react"

interface AuditEntry {
  _id: string
  adminEmail: string
  action: string
  resource: string
  status: "success" | "error" | "pending"
  recordsAffected: number
  timestamp: string
  fileInfo?: {
    fileName: string
    fileSize: number
    rows: number
  }
  errorMessage?: string
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/admin/audit")
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error("Erreur fetch logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Succès</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Erreur</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
      default:
        return null
    }
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      import_data: "📥 Import de données",
      create_admin: "👤 Création admin",
      update_admin: "✏️ Modification admin",
      delete_admin: "🗑️ Suppression admin",
      export_data: "📥 Export données",
      view_stats: "📊 Consultation stats",
    }
    return labels[action] || action
  }

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-600" />
          Journal d'Audit
        </CardTitle>
        <CardDescription>
          Historique des opérations d'administration ({logs.length} entrées)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-slate-500">Chargement...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-slate-500">Aucune opération enregistrée</div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log._id}
                className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(log.status)}
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">
                        {getActionLabel(log.action)}
                      </p>
                      <p className="text-xs text-slate-500">
                        Admin: {log.adminEmail} • Resource: {log.resource}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(log.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pl-7">
                  <div>
                    📅 {new Date(log.timestamp).toLocaleString("fr-FR")}
                  </div>
                  {log.recordsAffected > 0 && (
                    <div>
                      ✅ {log.recordsAffected} enregistrements affectés
                    </div>
                  )}
                  {log.fileInfo && (
                    <div>
                      📁 {log.fileInfo.fileName} ({(log.fileInfo.fileSize / 1024).toFixed(2)} KB)
                    </div>
                  )}
                  {log.fileInfo?.rows && (
                    <div>
                      📊 {log.fileInfo.rows} lignes
                    </div>
                  )}
                  {log.errorMessage && (
                    <div className="col-span-2 text-red-600">
                      ❌ Erreur: {log.errorMessage}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
