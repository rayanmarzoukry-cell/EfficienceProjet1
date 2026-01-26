"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, TrendingUp } from "lucide-react"

interface RealtimeUpdate {
  type: 'patients' | 'finances' | 'production' | 'appointments'
  count: number
  timestamp: Date
  message: string
}

export default function RealtimeDataUpdates() {
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([])
  const [lastSync, setLastSync] = useState<Date | null>(null)

  // ✅ Écouter les changements en temps réel via polling
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const response = await fetch('/api/admin/recent-imports')
        const data = await response.json()

        if (data.imports && data.imports.length > 0) {
          const newUpdates = data.imports.map((imp: any) => ({
            type: imp.type,
            count: imp.recordsProcessed,
            timestamp: new Date(imp.timestamp),
            message: `${imp.recordsProcessed} ${imp.type} importés`
          }))

          setUpdates(newUpdates)
          setLastSync(new Date())
        }
      } catch (error) {
        console.error('Error checking for updates:', error)
      }
    }

    // Vérifier toutes les 10 secondes
    const interval = setInterval(checkForUpdates, 10000)
    checkForUpdates() // Vérifier immédiatement

    return () => clearInterval(interval)
  }, [])

  if (updates.length === 0) {
    return null
  }

  return (
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-slate-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Mises à jour en temps réel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {updates.map((update, idx) => (
          <Alert key={idx} className="bg-white border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="ml-2">
              <span className="font-semibold">{update.message}</span>
              <br />
              <span className="text-xs text-slate-600">
                {update.timestamp.toLocaleTimeString('fr-FR')}
              </span>
            </AlertDescription>
          </Alert>
        ))}
        
        {lastSync && (
          <p className="text-xs text-slate-500 text-center mt-4">
            Dernière vérification: {lastSync.toLocaleTimeString('fr-FR')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
