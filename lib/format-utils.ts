// Utilitaires de formatting pour EFFICIENCE ANALYTICS

export function formatCurrency(value: number, currency = "€"): string {
  return `${value.toLocaleString("fr-FR")} ${currency}`
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString("fr-FR", { maximumFractionDigits: decimals })
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatDate(date: Date | string, format = "DD/MM/YYYY"): string {
  const d = typeof date === "string" ? new Date(date) : date
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()

  switch (format) {
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`
    default:
      return d.toLocaleDateString("fr-FR")
  }
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

export function getStatusLabel(score: number): string {
  if (score >= 85) return "Performant"
  if (score >= 70) return "À surveiller"
  return "En difficulté"
}

export function getTrendLabel(current: number, previous: number): { value: number; isPositive: boolean } {
  const difference = current - previous
  const percentage = (difference / previous) * 100
  return {
    value: Number(percentage.toFixed(1)),
    isPositive: difference > 0,
  }
}

export function shortifyName(name: string, maxLength = 20): string {
  return name.length > maxLength ? name.substring(0, maxLength) + "..." : name
}

export function getCabinetInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

export function formatMonthYear(date: Date): string {
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

export function getMonthLabel(monthIndex: number): string {
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]
  return months[monthIndex] || ""
}

export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export function getColorByScore(score: number): string {
  if (score >= 85) return "#10b981" // green
  if (score >= 70) return "#f59e0b" // orange
  return "#ef4444" // red
}

export function formatUptime(percentage: number): string {
  if (percentage >= 99.9) return "Excellent"
  if (percentage >= 99) return "Très bon"
  if (percentage >= 95) return "Bon"
  if (percentage >= 90) return "Acceptable"
  return "Faible"
}

export function convertToHours(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h${mins}m`
}

export function roundNumber(value: number, decimals = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function generateCSVContent(data: any[], columns: string[]): string {
  const headers = columns.join(",")
  const rows = data.map((row) => columns.map((col) => `"${row[col]}"`).join(","))
  return [headers, ...rows].join("\n")
}

export function getTimeSince(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (seconds < 60) return "À l'instant"
  if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} minutes`
  if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} heures`
  if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)} jours`
  return `Il y a ${Math.floor(seconds / 604800)} semaines`
}
