"use client"

import React, { useState, useEffect } from "react"
import { FileUp, Upload, Code2, Zap, CheckCircle2, AlertCircle, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminSidebar from "@/components/admin-sidebar"

export default function AdminImport() {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("https://votredomaine.com")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWebhookUrl(window.location.origin)
    }
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.name.endsWith(".csv") || droppedFile.name.endsWith(".xlsx")) {
        setFile(droppedFile)
        setStatus("idle")
      } else {
        setStatus("error")
        setMessage("Format non supporté. Utilisez CSV ou Excel.")
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setStatus("idle")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setStatus("idle")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setStatus("success")
        setMessage(`✅ ${file.name} importé avec succès!`)
        setFile(null)
      } else {
        const error = await response.json()
        setStatus("error")
        setMessage(`❌ ${error.message || "Erreur lors de l'import"}`)
      }
    } catch (error) {
      setStatus("error")
      setMessage("Erreur lors de la connexion au serveur")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <AdminSidebar />
      
      <main className="flex-1 ml-72 p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <FileUp size={40} className="text-purple-600" />
            Import de Fichiers
          </h1>
          <p className="text-slate-600">Importer patients, cabinets et données financières</p>
        </div>

        {/* Upload Section */}
        <Card className="bg-white rounded-2xl border-0 shadow-sm">
          <CardContent className="p-8">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-3 border-dashed rounded-2xl p-12 text-center transition ${
                dragActive
                  ? "border-purple-500 bg-purple-50"
                  : "border-slate-300 bg-slate-50"
              }`}
            >
              <FileUp className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-black text-slate-900 mb-2">
                {file ? file.name : "Glissez-déposez un fichier ici"}
              </h3>
              <p className="text-slate-600 mb-6">ou</p>

              <label className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold cursor-pointer inline-block transition">
                Parcourir des fichiers
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>

              <p className="text-sm text-slate-600 mt-6">
                Format acceptés : CSV, Excel (.xlsx)
              </p>
            </div>

            {file && (
              <div className="mt-6 p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-600" size={24} />
                  <div>
                    <p className="font-bold text-slate-900">{file.name}</p>
                    <p className="text-sm text-slate-600">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            )}

            {status === "success" && (
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={24} />
                <p className="text-green-700 font-semibold">{message}</p>
              </div>
            )}

            {status === "error" && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
                <p className="text-red-700 font-semibold">{message}</p>
              </div>
            )}

            {file && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
              >
                <Upload size={20} />
                {uploading ? "En cours..." : "Importer le fichier"}
              </button>
            )}
          </CardContent>
        </Card>

        {/* N8N Integration Guide */}
        <Card className="bg-gradient-to-r from-orange-50 to-slate-50 rounded-2xl border-2 border-orange-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-black flex items-center gap-3">
              <Zap className="text-orange-600" size={32} />
              Automatisation avec N8N
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-orange-100">
              <h3 className="text-lg font-black text-slate-900 mb-4">📋 Flux automatisé proposé:</h3>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 font-bold text-orange-600">1</div>
                  <div>
                    <p className="font-bold text-slate-900">Surveiller un dossier</p>
                    <p className="text-sm text-slate-600">Dropbox, Google Drive, FTP, ou serveur local</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 font-bold text-orange-600">2</div>
                  <div>
                    <p className="font-bold text-slate-900">Détecter les fichiers CSV/Excel</p>
                    <p className="text-sm text-slate-600">Pour patients, cabinets, finances, etc.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 font-bold text-orange-600">3</div>
                  <div>
                    <p className="font-bold text-slate-900">Parser et valider les données</p>
                    <p className="text-sm text-slate-600">Vérifier format, types de données, etc.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 font-bold text-orange-600">4</div>
                  <div>
                    <p className="font-bold text-slate-900">Appeler le webhook Efficience</p>
                    <p className="text-sm text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded">POST /api/admin/import</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 font-bold text-orange-600">5</div>
                  <div>
                    <p className="font-bold text-slate-900">Insérer automatiquement dans MongoDB</p>
                    <p className="text-sm text-slate-600">Plus besoin d'importer manuellement</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-orange-100">
              <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <Code2 size={24} />
                Configuration N8N
              </h3>
              <p className="text-sm text-slate-700 mb-4">
                <strong>Webhook URL à utiliser dans N8N:</strong>
              </p>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                POST {webhookUrl}/api/admin/import
              </div>
              <p className="text-sm text-slate-600">
                ✅ Le webhook accepte des fichiers CSV/Excel et les insère dans MongoDB<br/>
                ✅ Retourne un statut de succès ou d'erreur<br/>
                ✅ Logs automatiques pour chaque import
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <h4 className="font-black text-slate-900 mb-2">💡 Modèles de fichiers CSV</h4>
              <p className="text-sm text-slate-700 mb-4">
                Téléchargez les modèles pour formater vos fichiers correctement:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <a href="#" className="bg-white hover:bg-slate-100 px-4 py-2 rounded-lg border border-blue-200 text-sm font-bold text-blue-600 text-center transition">
                  📥 Modèle Patients
                </a>
                <a href="#" className="bg-white hover:bg-slate-100 px-4 py-2 rounded-lg border border-blue-200 text-sm font-bold text-blue-600 text-center transition">
                  📥 Modèle Finances
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Format Guide */}
        <Card className="bg-white rounded-2xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-black">📋 Formats de fichier acceptés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-bold text-slate-900 mb-3">Patients (CSV/Excel)</h4>
              <p className="text-sm text-slate-600 font-mono bg-white p-3 rounded border border-slate-200">
                ID,Nom,Prénom,Email,Téléphone,CabinetID,DateCreation
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-bold text-slate-900 mb-3">Finances (CSV/Excel)</h4>
              <p className="text-sm text-slate-600 font-mono bg-white p-3 rounded border border-slate-200">
                ID,CabinetID,Mois,Revenus,Dépenses,Bénéfice
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-bold text-slate-900 mb-3">Production (CSV/Excel)</h4>
              <p className="text-sm text-slate-600 font-mono bg-white p-3 rounded border border-slate-200">
                ID,CabinetID,Praticien,Mois,Heures,NombreRDV,CA
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
