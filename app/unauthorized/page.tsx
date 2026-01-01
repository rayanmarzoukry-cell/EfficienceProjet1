"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogoutButton } from "@/components/auth/logout-button"
import { Shield, AlertTriangle, Home } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-red-900">Accès Non Autorisé</CardTitle>
          <CardDescription>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Cette section nécessite des privilèges administrateur ou un accès spécifique.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-2">
            <Button onClick={() => router.back()} variant="outline" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Retour
            </Button>

            <LogoutButton variant="default" className="w-full" showText={true} showIcon={true} />
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Besoin d'aide ?</p>
            <a href="mailto:support@efficience-dentaire.fr" className="text-blue-600 hover:underline">
              Contactez le support
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
