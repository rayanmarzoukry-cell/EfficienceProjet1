"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageCircle,
  Send,
  Minimize2,
  Maximize2,
  X,
  Bot,
  User,
  Loader2,
  Download,
  FileText,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  actions?: ChatAction[]
  data?: any
}

interface ChatAction {
  type: "quick_question" | "generate_report"
  label: string
  icon: React.ReactNode
  data?: any
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        type: "bot",
        content: isAuthenticated
          ? `Bonjour ${user?.nom || "Docteur"} ! 👋 Je suis l'assistant IA d'Efficience-Dentaire. Comment puis-je vous aider ?`
          : "Bonjour ! 👋 Je suis l'assistant IA d'Efficience-Dentaire. Posez-moi vos questions sur vos soins ou notre cabinet.",
        timestamp: new Date(),
        actions: [
          { type: "quick_question", label: "Urgences", icon: <MessageCircle className="h-4 w-4" />, data: "Procédures d'urgence ?" },
          { type: "quick_question", label: "Blanchiment", icon: <FileText className="h-4 w-4" />, data: "Le blanchiment dentaire ?" }
        ],
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length, isAuthenticated, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (textOverride?: string) => {
    const text = textOverride || inputValue.trim()
    if (!text || isLoading) return

    const userMessage: Message = { id: Date.now().toString(), type: "user", content: text, timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })
      const data = await response.json()
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: data.response || data.reply,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      setMessages((prev) => [...prev, { id: "err", type: "bot", content: "⚠️ Erreur de connexion au serveur Flask.", timestamp: new Date() }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportPDF = async () => {
    if (isExporting) return
    setIsExporting(true)

    try {
      const formattedMessages = messages.map(m => ({ role: m.type === "bot" ? "bot" : "user", content: m.content }))
      const response = await fetch("http://127.0.0.1:5001/api/export-chat-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formattedMessages }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Rapport_IA_${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
    } catch (err) {
      alert("Erreur lors de la génération du PDF.")
    } finally {
      setIsExporting(false)
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={() => {setIsOpen(true); setUnreadCount(0)}} className="h-14 w-14 rounded-full shadow-lg bg-blue-600 text-white">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl transition-all border-none overflow-hidden flex flex-col ${isMinimized ? "h-16" : "h-[550px]"}`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-blue-600 text-white shrink-0 space-y-0">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-sm font-bold">Assistant IA</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {!isMinimized && (
              <Button variant="ghost" size="sm" onClick={handleExportPDF} disabled={isExporting} className="h-8 text-white hover:bg-blue-700">
                {isExporting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                <span className="ml-1 text-[10px] font-bold">PDF</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="h-8 w-8 text-white">
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        {!isMinimized && (
          <>
            <ScrollArea className="flex-1 p-4 bg-slate-50">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2 mb-4 ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl text-sm ${m.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="p-4 border-t bg-white flex gap-2">
              <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Posez votre question..." className="rounded-xl bg-slate-100 border-none" />
              <Button onClick={() => handleSendMessage()} size="icon" className="bg-blue-600 rounded-xl">
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}