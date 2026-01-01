"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  email: string
  nom: string
  role: "admin" | "user"
  cabinetId?: number
  cabinetNom?: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
  })
  const router = useRouter()

  // 🔄 Renouvellement automatique du token
  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          localStorage.setItem("accessToken", data.data.accessToken)
          setAuthState((prev) => ({
            ...prev,
            accessToken: data.data.accessToken,
          }))
          return true
        }
      }
      return false
    } catch (error) {
      console.error("Erreur renouvellement token:", error)
      return false
    }
  }, [])

  // 🔍 Vérification de l'authentification au chargement
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("accessToken")
        const storedUser = localStorage.getItem("user")

        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser)

          // Vérifier si le token est encore valide
          const response = await fetch("/api/user/reports", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          })

          if (response.ok) {
            // Token valide
            setAuthState({
              user,
              accessToken: storedToken,
              isLoading: false,
              isAuthenticated: true,
            })
          } else if (response.status === 401) {
            // Token expiré, essayer de le renouveler
            const refreshed = await refreshToken()
            if (refreshed) {
              setAuthState({
                user,
                accessToken: localStorage.getItem("accessToken"),
                isLoading: false,
                isAuthenticated: true,
              })
            } else {
              // Échec du renouvellement
              logout()
            }
          } else {
            logout()
          }
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error("Erreur initialisation auth:", error)
        setAuthState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    initAuth()
  }, [refreshToken])

  // 🚪 Déconnexion
  const logout = useCallback(async () => {
    try {
      // Appeler l'API de déconnexion
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Erreur déconnexion:", error)
    } finally {
      // Nettoyer le localStorage
      localStorage.removeItem("accessToken")
      localStorage.removeItem("user")

      // Réinitialiser l'état
      setAuthState({
        user: null,
        accessToken: null,
        isLoading: false,
        isAuthenticated: false,
      })

      // Rediriger vers la page de connexion
      router.push("/login")

      // Optionnel: recharger la page pour nettoyer complètement l'état
      window.location.reload()
    }
  }, [router])

  // 🔐 Connexion
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success && data.data) {
        localStorage.setItem("accessToken", data.data.accessToken)
        localStorage.setItem("user", JSON.stringify(data.data.user))

        setAuthState({
          user: data.data.user,
          accessToken: data.data.accessToken,
          isLoading: false,
          isAuthenticated: true,
        })

        return { success: true, user: data.data.user }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: "Erreur de connexion" }
    }
  }, [])

  // 🛡️ Vérification des permissions
  const hasPermission = useCallback(
    (requiredRole: "admin" | "user") => {
      if (!authState.user) return false

      const roleHierarchy = { admin: 2, user: 1 }
      return roleHierarchy[authState.user.role] >= roleHierarchy[requiredRole]
    },
    [authState.user],
  )

  // 🏢 Vérification d'accès au cabinet
  const canAccessCabinet = useCallback(
    (cabinetId: number) => {
      if (!authState.user) return false
      if (authState.user.role === "admin") return true
      return authState.user.cabinetId === cabinetId
    },
    [authState.user],
  )

  // 📡 Requête authentifiée
  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (!authState.accessToken) {
        throw new Error("Non authentifié")
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${authState.accessToken}`,
        },
      })

      // Si le token est expiré, essayer de le renouveler
      if (response.status === 401) {
        const refreshed = await refreshToken()
        if (refreshed) {
          // Retry avec le nouveau token
          return fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          })
        } else {
          logout()
          throw new Error("Session expirée")
        }
      }

      return response
    },
    [authState.accessToken, refreshToken, logout],
  )

  return {
    ...authState,
    login,
    logout,
    refreshToken,
    hasPermission,
    canAccessCabinet,
    authenticatedFetch,
  }
}
