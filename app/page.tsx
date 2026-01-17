"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Rediriger automatiquement vers le login
    router.push("/login")
  }, [router])

  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <h1>Redirection en cours...</h1>
      <p>Redirection vers la connexion</p>
    </main>
  )
}