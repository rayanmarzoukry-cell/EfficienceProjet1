import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export default function RecommendationWidget() {
  return (
    <Card className="rounded-[2rem] border-none shadow-sm bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-black flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500" /> Optimisation IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-slate-500 italic">
          Analyse des données en cours... Augmentez les traitements esthétiques pour atteindre l'objectif de 50k€.
        </p>
      </CardContent>
    </Card>
  )
}