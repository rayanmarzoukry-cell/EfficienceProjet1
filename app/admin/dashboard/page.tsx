"use client"

import React, { useState, useEffect } from "react"
import { Shield, Users, Building2, Database, Activity, FileUp, LogOut } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminSidebar from "@/components/admin-sidebar"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCabinets: 0,
    totalPatients: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Mock data - à remplacer par des vrais appels API
        setStats({
          totalUsers: 2,
          totalCabinets: 5,
          totalPatients: 150,
        })
      } catch (error) {
        console.error("Erreur:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <AdminSidebar />
      
      <main className="flex-1 ml-72 p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <Shield size={40} className="text-red-600" />
            Dashboard Administrateur
          </h1>
          <p className="text-slate-600">Gestion système et supervision globale de Efficience</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white rounded-2xl border-0 shadow-sm hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Utilisateurs Totaux</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-2">{stats.totalUsers}</h3>
                  <p className="text-xs text-slate-500 mt-1">Admin + Utilisateurs</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl border-0 shadow-sm hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Cabinets Suivis</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-2">{stats.totalCabinets}</h3>
                  <p className="text-xs text-slate-500 mt-1">Pratiques dentaires</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="text-green-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl border-0 shadow-sm hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Patients Total</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-2">{stats.totalPatients}</h3>
                  <p className="text-xs text-slate-500 mt-1">Tous les cabinets</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Database className="text-purple-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl border-0 shadow-sm hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Statut Système</p>
                  <h3 className="text-xl font-black text-green-600 mt-2 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    En ligne
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Opérationnel</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="text-green-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <Shield className="text-red-600" size={24} />
              Actions Rapides - Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/admin/users"
                className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-md transition group"
              >
                <Users className="text-blue-600 mb-3 group-hover:scale-110 transition" size={28} />
                <h4 className="font-black text-slate-900 text-lg">Gestion Utilisateurs</h4>
                <p className="text-sm text-slate-600 mt-1">Créer, modifier, supprimer des accès</p>
              </a>

              <a
                href="/admin/cabinets"
                className="p-5 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-md transition group"
              >
                <Building2 className="text-green-600 mb-3 group-hover:scale-110 transition" size={28} />
                <h4 className="font-black text-slate-900 text-lg">Gestion Cabinets</h4>
                <p className="text-sm text-slate-600 mt-1">Ajouter et configurer cabinets</p>
              </a>

              <a
                href="/admin/import"
                className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:shadow-md transition group"
              >
                <FileUp className="text-purple-600 mb-3 group-hover:scale-110 transition" size={28} />
                <h4 className="font-black text-slate-900 text-lg">Import Fichiers</h4>
                <p className="text-sm text-slate-600 mt-1">Importer données + intégration N8N</p>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Architecture Admin/User Explanation */}
        <Card className="bg-gradient-to-r from-red-50 to-slate-50 rounded-2xl border-2 border-red-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <Shield className="text-red-600" size={24} />
              Architecture Admin vs User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Users size={20} className="text-blue-600" />
                  Interface Utilisateur (User)
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>✓ Dashboard personnel</li>
                  <li>✓ Gestion patients</li>
                  <li>✓ Analyses cabinet</li>
                  <li>✓ Rapports financiers</li>
                  <li>✓ Consultations</li>
                  <li>✓ Paramètres personnels</li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Shield size={20} className="text-red-600" />
                  Interface Admin (Admin)
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>✓ Dashboard système</li>
                  <li>✓ Gestion des utilisateurs</li>
                  <li>✓ Gestion des cabinets</li>
                  <li>✓ Import de fichiers</li>
                  <li>✓ Configuration système</li>
                  <li>✓ Logs et monitoring</li>
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-red-100 mt-4">
              <p className="text-sm text-slate-700">
                <strong>Accès actuel:</strong> Vous êtes administrateur • Vous voyez le dashboard admin • Les users voient leur propre dashboard
              </p>
            </div>
          </CardContent>
        </Card>

        {/* N8N Integration Info */}
        <Card className="bg-gradient-to-r from-orange-50 to-slate-50 rounded-2xl border-2 border-orange-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <FileUp className="text-orange-600" size={24} />
              Intégration N8N (Automatisation)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <p>
              <strong>N8N</strong> est un outil d'automatisation sans code qui permet d'importer automatiquement des fichiers.
            </p>
            <div className="bg-white rounded-lg p-4 space-y-2 border border-orange-100">
              <p><strong>Flux N8N proposé:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Surveiller un dossier partagé (Dropbox, Google Drive, FTP)</li>
                <li>Détecter les fichiers CSV/Excel pour patients/cabinets</li>
                <li>Parser et valider les données</li>
                <li>Appeler webhook Efficience: <code className="bg-slate-200 px-2 py-1 rounded text-xs">POST /api/admin/import</code></li>
                <li>Insérer dans MongoDB automatiquement</li>
              </ol>
            </div>
            <p className="text-orange-700 font-semibold">
              📌 À configurer en <a href="/admin/import" className="underline hover:text-orange-900">Import Fichiers</a>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
