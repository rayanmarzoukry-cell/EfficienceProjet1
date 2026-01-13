"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"

interface Alert {
  id: number
  type: "warning" | "danger" | "info"
  title: string
  description: string
  cabinet: string
  time: string
}

interface AlertsPanelProps {
  alerts: Alert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getAlertColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
      case "danger":
        return "bg-red-500/10 border-red-500/30 text-red-400"
      case "info":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400"
      default:
        return "bg-slate-500/10 border-slate-500/30 text-slate-400"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <Clock className="w-5 h-5" />
      case "danger":
        return <AlertCircle className="w-5 h-5" />
      case "info":
        return <CheckCircle className="w-5 h-5" />
      default:
        return <AlertCircle className="w-5 h-5" />
    }
  }

  return (
    <Card className="bg-[#090E1A] border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Alertes & Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Aucune alerte</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`${getAlertColor(alert.type)} p-4 rounded-lg border flex gap-4`}>
                <div className="flex-shrink-0 pt-0.5">{getAlertIcon(alert.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white">{alert.title}</p>
                  <p className="text-sm text-slate-300 mt-1">{alert.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{alert.cabinet}</Badge>
                    <span className="text-xs text-slate-400">{alert.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
