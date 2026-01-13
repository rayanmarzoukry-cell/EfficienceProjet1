"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface PerformanceMetricProps {
  label: string
  value: number
  target: number
  unit?: string
  trend?: number
  status?: "good" | "warning" | "danger"
}

export function PerformanceMetric({
  label,
  value,
  target,
  unit = "",
  trend,
  status = "good",
}: PerformanceMetricProps) {
  const percentage = (value / target) * 100
  const isTrendPositive = trend !== undefined && trend > 0

  const statusColor = {
    good: "text-green-400",
    warning: "text-yellow-400",
    danger: "text-red-400",
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm">{label}</span>
        <span className={`font-semibold ${statusColor[status]}`}>
          {value}
          {unit}
        </span>
      </div>
      <Progress value={Math.min(percentage, 100)} className="h-2" />
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Objectif: {target}{unit}</span>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 ${isTrendPositive ? "text-green-400" : "text-red-400"}`}>
            {isTrendPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isTrendPositive ? "+" : ""}{trend}%
          </span>
        )}
      </div>
    </div>
  )
}

interface ScoreBadgeProps {
  score: number
  maxScore?: number
}

export function ScoreBadge({ score, maxScore = 100 }: ScoreBadgeProps) {
  let color = "bg-red-500/20 text-red-400"
  if (score >= 85) color = "bg-green-500/20 text-green-400"
  else if (score >= 70) color = "bg-yellow-500/20 text-yellow-400"

  return (
    <Badge className={`${color} text-lg px-3 py-1`}>
      {score}
      {maxScore && `/${maxScore}`}%
    </Badge>
  )
}

interface MetricComparisonProps {
  current: number
  previous: number
  label: string
  unit?: string
}

export function MetricComparison({
  current,
  previous,
  label,
  unit = "",
}: MetricComparisonProps) {
  const difference = current - previous
  const percentageChange = ((difference / previous) * 100).toFixed(1)
  const isPositive = difference > 0

  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-4">
        <p className="text-slate-400 text-sm mb-2">{label}</p>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-white">
            {current}
            {unit}
          </span>
          <span className={`text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
            {isPositive ? "+" : ""}
            {percentageChange}%
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Précédent: {previous}
          {unit}
        </p>
      </CardContent>
    </Card>
  )
}

interface RankingItemProps {
  rank: number
  name: string
  value: number
  unit?: string
  percentage: number
}

export function RankingItem({
  rank,
  name,
  value,
  unit = "",
  percentage,
}: RankingItemProps) {
  const rankColor = {
    1: "bg-yellow-500 text-yellow-900",
    2: "bg-gray-300 text-gray-900",
    3: "bg-orange-500 text-orange-900",
  }

  return (
    <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/10">
      <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${rankColor[rank as keyof typeof rankColor] || "bg-slate-500 text-white"}`}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{name}</p>
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-slate-400">
            {value}
            {unit}
          </p>
          <div className="w-32 bg-slate-700 rounded-full h-2">
            <div
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
