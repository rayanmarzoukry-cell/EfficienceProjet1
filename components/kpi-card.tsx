"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KPICardProps {
  label: string
  value: string | number
  unit?: string
  trend?: number
  trendLabel?: string
  icon?: React.ReactNode
  color?: "blue" | "green" | "purple" | "orange" | "red"
  backgroundColor?: string
  compareValue?: string | number
}

export function KPICard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  icon,
  color = "blue",
  backgroundColor,
}: KPICardProps) {
  const colorMap = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    green: "text-green-400 bg-green-500/10 border-green-500/30",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    red: "text-red-400 bg-red-500/10 border-red-500/30",
  }

  const isTrendPositive = trend !== undefined && trend > 0

  return (
    <Card className={`${backgroundColor || colorMap[color]} border`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className={`text-sm font-semibold mb-2 ${color === "blue" ? "text-blue-400" : color === "green" ? "text-green-400" : color === "purple" ? "text-purple-400" : color === "orange" ? "text-orange-400" : "text-red-400"}`}>
              {label}
            </p>
            <p className="text-3xl font-bold text-white">
              {value}
              {unit && <span className="text-lg text-slate-400">{unit}</span>}
            </p>
          </div>
          {icon && <div className="text-3xl">{icon}</div>}
        </div>

        {trend !== undefined && (
          <div className={`flex items-center gap-2 ${isTrendPositive ? "text-green-400" : "text-red-400"}`}>
            {isTrendPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-semibold">
              {isTrendPositive ? "+" : ""}{trend}% {trendLabel || "vs mois dernier"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function KPIGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-4 gap-4">{children}</div>
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
      {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
    </div>
  )
}

export function StatBadge({ count, label, variant = "default" }: { count: number; label: string; variant?: "default" | "success" | "warning" | "danger" }) {
  const variants = {
    default: "bg-blue-500/20 text-blue-400",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    danger: "bg-red-500/20 text-red-400",
  }

  return (
    <div className={`${variants[variant]} px-4 py-3 rounded-lg border border-white/10`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  )
}
