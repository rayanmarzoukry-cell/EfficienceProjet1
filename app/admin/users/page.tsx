"use client"

import React, { useState, useEffect } from "react"
import { Users, Trash2, Plus, Edit2, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface User {
  _id: string
  email: string
  name: string
  role: "admin" | "user"
  isActive: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newUser, setNewUser] = useState({ email: "", password: "", name: "", role: "user" })
  const [token, setToken] = useState("")

  // Charger le token du localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token")
    if (storedToken) {
      setToken(storedToken)
      loadUsers(storedToken)
    }
  }, [])

  const loadUsers = async (authToken: string) => {
    try {
      setLoading(true)
      const res = await fetch("/api/auth/users", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      const data = await res.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Erreur chargement users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      })

      const data = await res.json()
      if (res.ok) {
        setNewUser({ email: "", password: "", name: "", role: "user" })
        setShowForm(false)
        loadUsers(token)
        alert("Utilisateur créé avec succès!")
      } else {
        alert(`Erreur: ${data.error}`)
      }
    } catch (error) {
      console.error("Erreur création user:", error)
      alert("Erreur lors de la création")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur?")) return

    try {
      const res = await fetch(`/api/auth/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (res.ok) {
        loadUsers(token)
        alert("Utilisateur supprimé!")
      } else {
        alert(`Erreur: ${data.error}`)
      }
    } catch (error) {
      console.error("Erreur suppression user:", error)
      alert("Erreur lors de la suppression")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
              <Users size={40} className="text-blue-600" />
              Gestion des Utilisateurs
            </h1>
            <p className="text-slate-600 mt-2">Admin Panel - Créez et gérez les utilisateurs</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 h-12 px-6 rounded-lg"
          >
            <Plus size={20} />
            Nouvel Utilisateur
          </Button>
        </div>

        {/* Formulaire création user */}
        {showForm && (
          <Card className="bg-white rounded-2xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black text-slate-900">Créer un nouvel utilisateur</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Email</label>
                    <Input
                      type="email"
                      placeholder="utilisateur@cabinet.fr"
                      required
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Nom</label>
                    <Input
                      type="text"
                      placeholder="Jean Dupont"
                      required
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Mot de passe</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      required
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Rôle</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "user" })}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-slate-900 font-medium"
                    >
                      <option value="user">Utilisateur Standard</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 bg-slate-200 text-slate-900 rounded-lg font-bold hover:bg-slate-300 transition"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Liste des users */}
        <Card className="bg-white rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-black text-slate-900">
              Utilisateurs ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Chargement...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-slate-500">Aucun utilisateur</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b-2 border-slate-200">
                    <tr className="text-left">
                      <th className="pb-3 font-bold text-slate-700">Nom</th>
                      <th className="pb-3 font-bold text-slate-700">Email</th>
                      <th className="pb-3 font-bold text-slate-700">Rôle</th>
                      <th className="pb-3 font-bold text-slate-700">Statut</th>
                      <th className="pb-3 font-bold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 font-medium text-slate-900">{user.name}</td>
                        <td className="py-4 text-slate-600">{user.email}</td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.role === "admin"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.role === "admin" ? "Administrateur" : "Utilisateur"}
                          </span>
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {user.isActive ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td className="py-4 flex gap-2">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info de sécurité */}
        <Card className="bg-blue-50 rounded-2xl border border-blue-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Lock className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Sécurité</h3>
                <p className="text-sm text-slate-700">
                  ✓ Les mots de passe sont hachés avec bcrypt<br />
                  ✓ Les admins peuvent créer et supprimer les utilisateurs<br />
                  ✓ Les tokens JWT expirent après 30 jours<br />
                  ✓ Au moins un admin doit toujours exister
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
