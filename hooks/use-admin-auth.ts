'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface Admin {
  id: string
  email: string
  name: string
  role: 'admin'
}

export function useAdminAuth() {
  const router = useRouter()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/admin/verify')

        if (!response.ok) {
          setAdmin(null)
          setIsLoading(false)
          return
        }

        const data = await response.json()
        setAdmin(data.admin)
      } catch (err) {
        console.error('Erreur de vérification:', err)
        setAdmin(null)
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuth()
  }, [])

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true)
      setError(null)

      try {
        // Obtenir le port dynamiquement (3000 ou 3001)
        const port = window.location.port || (window.location.protocol === 'https:' ? '443' : '80')
        const baseUrl = `${window.location.protocol}//${window.location.hostname}:${port}`
        
        const response = await fetch(`${baseUrl}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          const data = await response.json()
          setError(data.error || 'Erreur de connexion')
          return false
        }

        const data = await response.json()
        setAdmin(data.admin)
        router.push('/admin/dashboard')
        return true
      } catch (err) {
        setError('Erreur serveur')
        console.error('Erreur login:', err)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  const logout = useCallback(async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      })

      setAdmin(null)
      router.push('/admin/login')
    } catch (err) {
      console.error('Erreur logout:', err)
    }
  }, [router])

  return {
    admin,
    isLoading,
    error,
    isAuthenticated: !!admin,
    login,
    logout,
  }
}
