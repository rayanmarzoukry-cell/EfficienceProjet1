"use client"

import React from "react"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartData {
  [key: string]: any
}

interface MultiLineChartProps {
  title: string
  data: ChartData[]
  lines: Array<{
    key: string
    name: string
    color: string
  }>
  height?: number
}

export function MultiLineChart({ title, data, lines, height = 300 }: MultiLineChartProps) {
  return (
    <Card className="bg-[#090E1A] border-white/10">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" />
            <YAxis stroke="rgba(255,255,255,0.3)" />
            <Tooltip contentStyle={{ backgroundColor: "#090E1A", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Legend />
            {lines.map((line) => (
              <Line key={line.key} type="monotone" dataKey={line.key} name={line.name} stroke={line.color} strokeWidth={2} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface SimpleBarChartProps {
  title: string
  data: ChartData[]
  dataKey: string
  height?: number
  color?: string
}

export function SimpleBarChart({ title, data, dataKey, height = 300, color = "#3b82f6" }: SimpleBarChartProps) {
  return (
    <Card className="bg-[#090E1A] border-white/10">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" />
            <YAxis stroke="rgba(255,255,255,0.3)" />
            <Tooltip contentStyle={{ backgroundColor: "#090E1A", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface DonutChartProps {
  title: string
  data: Array<{
    name: string
    value: number
    color: string
  }>
}

export function DonutChart({ title, data }: DonutChartProps) {
  return (
    <Card className="bg-[#090E1A] border-white/10">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#090E1A", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface AreaChartProps {
  title: string
  data: ChartData[]
  dataKey: string
  height?: number
  color?: string
}

export function AreaChartComponent({ title, data, dataKey, height = 300, color = "#3b82f6" }: AreaChartProps) {
  return (
    <Card className="bg-[#090E1A] border-white/10">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" />
            <YAxis stroke="rgba(255,255,255,0.3)" />
            <Tooltip contentStyle={{ backgroundColor: "#090E1A", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Area type="monotone" dataKey={dataKey} fill={color} stroke={color} fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
