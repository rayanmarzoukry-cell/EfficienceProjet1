"use client"

import { useState, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"

interface ChatbotState {
  isOpen: boolean
  isMinimized: boolean
  unreadCount: number
  isLoading: boolean
}

export function useChatbot() {
  const [state, setState] = useState<ChatbotState>({
    isOpen: false,
    isMinimized: false,
    unreadCount: 0,
    isLoading: false,
  })

  const { isAuthenticated, authenticatedFetch } = useAuth()

  const toggleChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
      unreadCount: prev.isOpen ? prev.unreadCount : 0,
    }))
  }, [])

  const toggleMinimize = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isMinimized: !prev.isMinimized,
    }))
  }, [])

  const sendMessage = useCallback(
    async (message: string, conversationHistory: any[]) => {
      setState((prev) => ({ ...prev, isLoading: true }))

      try {
        const fetchFn = isAuthenticated ? authenticatedFetch : fetch

        const response = await fetchFn("/api/chatbot/conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            conversationHistory: conversationHistory.slice(-5),
          }),
        })

        const data = await response.json()
        return data
      } catch (error) {
        console.error("Erreur envoi message:", error)
        return {
          success: false,
          error: "Erreur de communication",
        }
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    },
    [isAuthenticated, authenticatedFetch],
  )

  const executeAction = useCallback(
    async (action: any) => {
      setState((prev) => ({ ...prev, isLoading: true }))

      try {
        const fetchFn = isAuthenticated ? authenticatedFetch : fetch

        const response = await fetchFn("/api/chatbot/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: action.type, data: action.data }),
        })

        const data = await response.json()
        return data
      } catch (error) {
        console.error("Erreur exécution action:", error)
        return {
          success: false,
          error: "Erreur d'exécution",
        }
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    },
    [isAuthenticated, authenticatedFetch],
  )

  const incrementUnread = useCallback(() => {
    setState((prev) => ({
      ...prev,
      unreadCount: prev.unreadCount + 1,
    }))
  }, [])

  return {
    ...state,
    toggleChat,
    toggleMinimize,
    sendMessage,
    executeAction,
    incrementUnread,
  }
}
