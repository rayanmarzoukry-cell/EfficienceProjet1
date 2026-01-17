"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, File, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ImportResult {
  success: number
  failed: number
  errors: string[]
  summary: Record<string, number>
}

export default function AdminImport() {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [resourceType, setResourceType] = useState("patients")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState("")

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

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      setFile(droppedFile)
      setError("")
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError("")
    }
  }

  const handleImport = async () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("resourceType", resourceType)
      formData.append("adminEmail", JSON.parse(localStorage.getItem("admin_user") || "{}").email || "admin@efficience-dentaire.fr")

      const response = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erreur lors de l'import")
        return
      }

      setResult(data.data)
      setFile(null)
    } catch (err: any) {
      setError(err.message || "Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            Importation de Données
          </CardTitle>
          <CardDescription>
            Importez vos données patients, cabinets ou rendez-vous via CSV
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Resource Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Type de données</label>
            <Select value={resourceType} onValueChange={setResourceType}>
              <SelectTrigger className="border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patients">Patients</SelectItem>
                <SelectItem value="cabinets">Cabinets</SelectItem>
                <SelectItem value="rendezvous">Rendez-vous</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
              dragActive
                ? "border-blue-400 bg-blue-50"
                : "border-slate-300 hover:border-blue-400"
            }`}
          >
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 mb-2">
              Glissez-déposez votre fichier CSV ici
            </p>
            <p className="text-xs text-slate-500 mb-4">
              ou
            </p>
            <label>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button variant="outline" className="cursor-pointer border-slate-200">
                Sélectionner un fichier
              </Button>
            </label>
          </div>

          {/* Selected File Info */}
          {file && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFile(null)}
                className="border-slate-200"
              >
                Supprimer
              </Button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <p className="font-medium text-green-900">Import réussi!</p>
              </div>
              <div className="text-sm text-green-800 space-y-1">
                <p>✅ {result.success} enregistrements importés</p>
                {result.failed > 0 && <p>❌ {result.failed} enregistrements échoués</p>}
                {result.errors.length > 0 && (
                  <div className="mt-2 bg-white p-2 rounded border border-green-200">
                    <p className="font-medium text-xs mb-1">Erreurs:</p>
                    {result.errors.slice(0, 5).map((err, idx) => (
                      <p key={idx} className="text-xs text-red-700">
                        • {err}
                      </p>
                    ))}
                    {result.errors.length > 5 && (
                      <p className="text-xs text-slate-600 mt-1">
                        +{result.errors.length - 5} autres erreurs...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Import Button */}
          <Button
            onClick={handleImport}
            disabled={!file || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importation en cours...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Importer {file ? `(${file.name})` : ""}
              </>
            )}
          </Button>

          {/* Template Info */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-sm font-medium text-slate-900 mb-2">📋 Format attendu:</p>
            <div className="space-y-2 text-xs text-slate-600 font-mono">
              {resourceType === "patients" && (
                <p>name,email,phone,dateRDV,type,status,cabinetId</p>
              )}
              {resourceType === "cabinets" && (
                <p>nom,email,phone,caActuel,caObjectif,score</p>
              )}
              {resourceType === "rendezvous" && (
                <p>patientId,cabinetId,date,type,status,duration</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
