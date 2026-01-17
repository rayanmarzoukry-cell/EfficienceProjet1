"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Building2, Upload, Settings, LogOut, Activity, Shield } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()
  const [role, setRole] = useState("")

  useEffect(() => {
    const userRole = localStorage.getItem("user_role")
    setRole(userRole || "")
  }, [])

  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard Admin", href: "/admin/dashboard" },
    { icon: Users, label: "Gestion Utilisateurs", href: "/admin/users" },
    { icon: Building2, label: "Gestion Cabinets", href: "/admin/cabinets" },
    { icon: Upload, label: "Import Fichiers", href: "/admin/import" },
    { icon: Shield, label: "Configuration", href: "/admin/configuration" },
    { icon: Settings, label: "Système & Logs", href: "/admin/system" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_role")
    window.location.href = "/login"
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-red-900/20 to-slate-900 border-r border-red-500/20 flex flex-col z-50">
      <div className="p-8 mb-10 border-b border-red-500/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-lg font-black italic uppercase tracking-tighter leading-none">ADMIN</span>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Connecté</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {adminMenuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
              pathname === item.href
                ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                : "text-slate-400 hover:bg-red-500/10 hover:text-slate-200"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-red-500/20 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-red-600/20 text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
