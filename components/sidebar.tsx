"use client"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BarChart3, PieChart, Users, FileText, MessageSquare, Settings, Activity } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard général", href: "/dashboard" },
    { icon: BarChart3, label: "Analyses", href: "/analyses" },
    { icon: PieChart, label: "Gestion clients", href: "/cabinets" },
    { icon: FileText, label: "Rapports", href: "/rapports" },
    { icon: MessageSquare, label: "Consultations", href: "/consultations" },
    { icon: Users, label: "PATIENTS", href: "/patients" },
    { icon: Settings, label: "RÉGLAGES", href: "/settings" },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#090E1A] border-r border-white/5 flex flex-col z-50">
      <div className="p-8 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Activity className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-lg font-black italic uppercase tracking-tighter leading-none">TEMPS RÉEL</span>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Connecté</span>
            </div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${pathname === item.href ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"}`}>
            <item.icon className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
export default Sidebar;