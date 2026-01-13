"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, X, Send } from "lucide-react"

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="bg-white w-80 h-96 rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
            <span className="font-black italic text-sm">Assistant IA Martin</span>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="hover:bg-slate-800 text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 p-4 text-xs text-slate-500 italic">
            Bonjour ! Je vois que votre production est de 45 000€. Comment puis-je vous aider à atteindre l'objectif de 50 000€ ?
          </div>
          <div className="p-4 border-t flex gap-2">
            <input type="text" placeholder="Posez une question..." className="flex-1 bg-slate-50 rounded-full px-4 py-2 text-xs outline-none" />
            <Button size="icon" className="rounded-full bg-orange-500 hover:bg-orange-600">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-slate-900 shadow-2xl hover:scale-110 transition-transform group"
        >
          <MessageSquare className="w-6 h-6 text-orange-500 group-hover:rotate-12 transition-transform" />
        </Button>
      )}
    </div>
  )
}