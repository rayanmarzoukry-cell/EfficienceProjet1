"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Download, Printer } from "lucide-react"

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
  align?: "left" | "center" | "right"
  width?: string
}

interface DataTableProps {
  title: string
  data: any[]
  columns: Column[]
  onRowClick?: (row: any) => void
  searchable?: boolean
  exportable?: boolean
}

export function DataTable({
  title,
  data,
  columns,
  onRowClick,
  searchable = true,
  exportable = true,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredData = searchable
    ? data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data

  const alignMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <Card className="bg-[#090E1A] border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">{title}</CardTitle>
        {exportable && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" variant="outline" className="border-white/10">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
          </div>
        )}
      </CardHeader>

      {searchable && (
        <CardContent className="pb-0">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>
        </CardContent>
      )}

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`py-4 px-4 text-slate-400 font-semibold ${alignMap[column.align || "left"]} ${column.width ? `w-${column.width}` : ""}`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-8 px-4 text-center text-slate-400">
                    Aucune donnée
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    onClick={() => onRowClick?.(row)}
                    style={{ cursor: onRowClick ? "pointer" : "default" }}
                  >
                    {columns.map((column) => (
                      <td
                        key={`${index}-${column.key}`}
                        className={`py-4 px-4 text-slate-300 ${alignMap[column.align || "left"]}`}
                      >
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

interface TableRowProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function TableRow({ children, onClick, className = "" }: TableRowProps) {
  return (
    <tr
      className={`border-b border-white/5 hover:bg-white/5 ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {children}
    </tr>
  )
}

interface TableCellProps {
  children: React.ReactNode
  align?: "left" | "center" | "right"
  className?: string
}

export function TableCell({ children, align = "left", className = "" }: TableCellProps) {
  const alignMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <td className={`py-4 px-4 text-slate-300 ${alignMap[align]} ${className}`}>
      {children}
    </td>
  )
}
