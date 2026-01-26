"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, RefreshCw, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SyncStatus {
  status: 'idle' | 'syncing' | 'success' | 'error'
  message: string
  details?: any
  timestamp?: string
}

export default function N8nSyncButton() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    status: 'idle',
    message: 'Cliquez pour synchroniser les données'
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSync = async () => {
    setIsLoading(true)
    setSyncStatus({
      status: 'syncing',
      message: 'Synchronisation en cours...',
      timestamp: new Date().toLocaleTimeString('fr-FR')
    })

    try {
      // ✅ Appeler le webhook N8N ou déclencher une synchronisation manuelle
      const response = await fetch('/api/admin/trigger-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_WEBHOOK_TOKEN || 'default'}`
        },
        body: JSON.stringify({
          action: 'manual-sync',
          timestamp: new Date().toISOString()
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSyncStatus({
          status: 'success',
          message: `✅ Synchronisation réussie! ${result.message}`,
          details: result,
          timestamp: new Date().toLocaleTimeString('fr-FR')
        })

        // ✅ Rafraîchir le dashboard après 2 secondes
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        throw new Error(result.error || 'Erreur de synchronisation')
      }
    } catch (error) {
      setSyncStatus({
        status: 'error',
        message: `❌ Erreur: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toLocaleTimeString('fr-FR')
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-slate-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-blue-600" />
          Synchronisation N8N
        </CardTitle>
        <CardDescription>
          Mettre à jour les données depuis vos fichiers importés
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bouton de synchronisation */}
        <Button
          onClick={handleSync}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 text-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Synchronisation en cours...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              Synchroniser maintenant
            </>
          )}
        </Button>

        {/* Status Message */}
        {syncStatus.status !== 'idle' && (
          <Alert 
            className={syncStatus.status === 'success' 
              ? 'bg-green-50 border-green-200' 
              : syncStatus.status === 'error' 
              ? 'bg-red-50 border-red-200' 
              : 'bg-blue-50 border-blue-200'
            }
          >
            <div className="flex items-start gap-3">
              {syncStatus.status === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              )}
              {syncStatus.status === 'error' && (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              {syncStatus.status === 'syncing' && (
                <Loader2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0 animate-spin" />
              )}
              
              <div className="flex-1">
                <AlertDescription 
                  className={
                    syncStatus.status === 'success' 
                      ? 'text-green-800' 
                      : syncStatus.status === 'error' 
                      ? 'text-red-800' 
                      : 'text-blue-800'
                  }
                >
                  <p className="font-semibold">{syncStatus.message}</p>
                  {syncStatus.timestamp && (
                    <p className="text-sm mt-1 opacity-75">{syncStatus.timestamp}</p>
                  )}
                  {syncStatus.details?.inserted && (
                    <p className="text-sm mt-2">
                      📊 {syncStatus.details.inserted} enregistrements importés
                    </p>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {/* Info */}
        <div className="bg-white/50 rounded-lg p-3 text-sm text-slate-600">
          <p className="font-semibold mb-2">ℹ️ Comment ça marche?</p>
          <ul className="space-y-1 text-xs list-disc list-inside">
            <li>Détecte les fichiers CSV/Excel mis à jour</li>
            <li>Valide et importe automatiquement les données</li>
            <li>Met à jour MongoDB en temps réel</li>
            <li>Rafraîchit le dashboard avec les nouvelles données</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
