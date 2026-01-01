import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export default function ProductionWidget() {
  return (
    <Card className="rounded-[2.5rem] border-none shadow-sm bg-blue-600 text-white p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black uppercase opacity-70">Capacité Production</p>
          <h4 className="text-2xl font-black italic">94%</h4>
        </div>
        <TrendingUp className="w-8 h-8 opacity-30" />
      </div>
    </Card>
  )
}