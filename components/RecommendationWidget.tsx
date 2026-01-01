import React from "react"
import { BrainCircuit } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function AIInsightsPanel({ analysis }: { analysis: string }) {
  return (
    <Card className="p-8 rounded-[2.5rem] border-none shadow-sm bg-white text-left">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
          <BrainCircuit size={20} />
        </div>
        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Analyse Prédictive</h3>
      </div>
      <p className="text-slate-600 text-xs leading-relaxed font-medium">
        {analysis}
      </p>
    </Card>
  )
}