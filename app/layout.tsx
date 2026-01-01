"use client"

// IMPORTATION DES STYLES
import "./globals.css" 

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { AppProvider } from "@/context/AppContext" // Importation du fournisseur de données
import { ChatWidget } from "@/components/chatbot/chat-widget" // IMPORTATION DU CHATBOT

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Définition des pages sans sidebar (Login, Register, Landing)
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/"

  return (
    <html lang="fr">
      <body className="antialiased bg-[#030712]">
        {/* L'étape cruciale : AppProvider enveloppe tout pour partager la mémoire */}
        <AppProvider>
          <div className="flex min-h-screen">
            {/* Sidebar fixe à gauche - Affichée uniquement si ce n'est pas une page d'auth */}
            {!isAuthPage && <Sidebar />}
            
            {/* Zone de contenu : pl-72 pour ne pas chevaucher la sidebar sur desktop */}
            <main className={`flex-1 transition-all duration-300 ${!isAuthPage ? "md:pl-72" : ""}`}>
              <div className="h-full w-full">
                {children}
              </div>
            </main>
          </div>

          {/* INTÉGRATION DU CHATBOT OLLAMA */}
          {/* Il est placé ici pour être visible sur toutes les pages du site */}
          <ChatWidget />
          
        </AppProvider>
      </body>
    </html>
  )
}