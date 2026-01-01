"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mail, Lock, Shield, User, Building } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulation de l'authentification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Vérifier les identifiants
      if (email === "admin@efficience-dentaire.fr" && password === "admin123") {
        // Connexion admin
        localStorage.setItem("accessToken", "admin-token-123")
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            email: "admin@efficience-dentaire.fr",
            nom: "Administrateur",
            role: "admin",
          }),
        )
        router.push("/admin")
      } else if (email === "cabinet@test.fr" && password === "demo123") {
        // Connexion cabinet
        localStorage.setItem("accessToken", "cabinet-token-123")
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: 2,
            email: "cabinet@test.fr",
            nom: "Dr. Martin",
            role: "user",
            cabinetId: 1,
            cabinetNom: "Cabinet Dr. Martin",
          }),
        )
        router.push("/cabinet")
      } else {
        setError("Email ou mot de passe incorrect")
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    {
      role: "admin",
      email: "admin@efficience-dentaire.fr",
      password: "admin123",
      description: "Accès administrateur complet",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      role: "user",
      email: "cabinet@test.fr",
      password: "demo123",
      description: "Cabinet Dr. Martin - Paris",
      icon: <Building className="h-4 w-4" />,
    },
  ]

  const fillDemoAccount = (account: (typeof demoAccounts)[0]) => {
    setEmail(account.email)
    setPassword(account.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Efficience-Dentaire</h1>
          <p className="text-gray-600 mt-2">Plateforme d'Analyse & Reporting</p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Connexion
            </CardTitle>
            <CardDescription>Accédez à votre espace personnel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Se connecter
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Comptes de démonstration */}
        <Card className="mt-6 border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4" />
              Comptes de Démonstration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => fillDemoAccount(account)}
              >
                <div className="flex items-center gap-3">
                  {account.icon}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{account.email}</span>
                      <Badge variant={account.role === "admin" ? "default" : "secondary"} className="text-xs">
                        {account.role === "admin" ? "Admin" : "Cabinet"}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">{account.description}</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  Utiliser
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Support */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Besoin d'aide ?</p>
          <a href="mailto:support@efficience-dentaire.fr" className="text-blue-600 hover:underline">
            support@efficience-dentaire.fr
          </a>
        </div>
      </div>
    </div>
  )
}
