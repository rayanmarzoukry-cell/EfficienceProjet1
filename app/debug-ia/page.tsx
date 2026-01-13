// app/debug-ia/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react"

interface DiagnosticData {
  openaiKeyExists: boolean
  openaiKeyValid: boolean
  openaiKeyLength: number
  openaiTest: {
    success: boolean
    message?: string
    error?: string
  }
  timestamp: string
}

export default function DebugIAPage() {
  const [diagnostic, setDiagnostic] = useState<DiagnosticData | null>(null)
  const [loading, setLoading] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  const runDiagnostic = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/test')
      const data = await response.json()
      setDiagnostic(data.diagnostics)
    } catch (error) {
      setTestResult(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setLoading(false)
    }
  }

  const testAnalyzeAPI = async () => {
    setLoading(true)
    setTestResult(null)
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'test',
          nom: 'Cabinet Test',
          caActuel: 40000,
          caObjectif: 50000,
          nouveauxPatients: 10,
          absences: 2,
          devisEnvoyes: 15,
          devisConvertis: 9,
          traitements: [
            { nom: 'Détartrage', nombre: 20 },
            { nom: 'Dévitalisation', nombre: 5 },
          ],
          periodicite: 'mois',
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setTestResult(`✅ API Fonctionnelle!\n\n${data.data.analysis.substring(0, 200)}...`)
      } else {
        setTestResult(`❌ Erreur API:\n\n${JSON.stringify(data, null, 2)}`)
      }
    } catch (error) {
      setTestResult(`❌ Erreur réseau:\n\n${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostic()
  }, [])

  return (
    <div className="p-8 bg-[#030712] min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">🔍 Debug IA</h1>
          <p className="text-slate-400">Diagnostic de la configuration OpenAI</p>
        </div>

        {/* Diagnostic Configuration */}
        {diagnostic && (
          <Card className="bg-[#090E1A] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <span>Configuration OpenAI</span>
                {diagnostic.openaiTest.success ? (
                  <Badge className="bg-green-600">OK</Badge>
                ) : (
                  <Badge className="bg-red-600">Erreur</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <CheckItem
                  label="OPENAI_API_KEY existe"
                  status={diagnostic.openaiKeyExists}
                />
                <CheckItem
                  label="Commence par sk-proj-"
                  status={diagnostic.openaiKeyValid}
                />
                <CheckItem
                  label={`Longueur clé: ${diagnostic.openaiKeyLength} caractères`}
                  status={diagnostic.openaiKeyLength > 40}
                />
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-start gap-3">
                  {diagnostic.openaiTest.success ? (
                    <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                  ) : (
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                  )}
                  <div>
                    <p className="text-white font-semibold">
                      {diagnostic.openaiTest.success ? 'Connexion API OK ✅' : 'Erreur Connexion ❌'}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      {diagnostic.openaiTest.message || diagnostic.openaiTest.error}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={runDiagnostic}
                disabled={loading}
                variant="outline"
                className="w-full border-white/10"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin mr-2' : 'mr-2'} />
                Rafraîchir
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Solutions */}
        {diagnostic && !diagnostic.openaiTest.success && (
          <Card className="bg-red-900/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-400">⚠️ Solutions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-red-300">
              {!diagnostic.openaiKeyExists && (
                <div>
                  <p className="font-semibold">1️⃣ OPENAI_API_KEY non trouvée</p>
                  <p className="ml-4 text-xs mt-1">
                    Crée un fichier <code className="bg-black/50 px-2 py-1 rounded">.env.local</code> à la racine avec:
                  </p>
                  <pre className="bg-black/50 p-2 rounded mt-2 text-xs overflow-x-auto">
                    OPENAI_API_KEY=sk-proj-...
                  </pre>
                </div>
              )}

              {diagnostic.openaiKeyExists && !diagnostic.openaiKeyValid && (
                <div>
                  <p className="font-semibold">2️⃣ Format de clé invalide</p>
                  <p className="ml-4 text-xs mt-1">
                    La clé doit commencer par <code className="bg-black/50 px-1">sk-proj-</code>
                  </p>
                </div>
              )}

              {diagnostic.openaiKeyValid && !diagnostic.openaiTest.success && (
                <div>
                  <p className="font-semibold">3️⃣ Clé invalide ou expirée</p>
                  <p className="ml-4 text-xs mt-1">
                    Vérifie la clé sur{' '}
                    <a href="https://platform.openai.com/api-keys" className="underline text-blue-400">
                      platform.openai.com/api-keys
                    </a>
                  </p>
                  <p className="ml-4 text-xs mt-2">Assure-toi que:</p>
                  <ul className="ml-6 list-disc text-xs space-y-1 mt-1">
                    <li>La clé n'est pas expirée</li>
                    <li>Ton compte a des crédits</li>
                    <li>La clé n'a pas été révoquée</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Test API */}
        <Card className="bg-[#090E1A] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Test API Analyse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-400">Teste l'endpoint /api/ai/analyze directement</p>
            <Button
              onClick={testAnalyzeAPI}
              disabled={loading || !diagnostic?.openaiKeyValid}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin mr-2" />
                  Test en cours...
                </>
              ) : (
                '🚀 Tester API'
              )}
            </Button>

            {testResult && (
              <div
                className={`p-4 rounded-lg font-mono text-xs whitespace-pre-wrap overflow-x-auto ${
                  testResult.startsWith('✅')
                    ? 'bg-green-900/20 text-green-300 border border-green-500/30'
                    : 'bg-red-900/20 text-red-300 border border-red-500/30'
                }`}
              >
                {testResult}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prochaines étapes */}
        {diagnostic?.openaiTest.success && (
          <Card className="bg-green-900/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400">✅ Configuration OK</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-green-300 space-y-2">
              <p>Tout est configuré correctement!</p>
              <p>Tu peux maintenant:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>
                  Aller à <a href="/analyses" className="underline text-blue-400">
                    /analyses
                  </a>{' '}
                  et cliquer sur "Analyse IA Globale"
                </li>
                <li>
                  Aller à <a href="/rapports" className="underline text-blue-400">
                    /rapports
                  </a>{' '}
                  et cliquer sur "Générer avec IA"
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function CheckItem({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {status ? (
        <CheckCircle2 className="text-green-500" size={18} />
      ) : (
        <AlertCircle className="text-red-500" size={18} />
      )}
      <span className={status ? 'text-slate-300' : 'text-red-400'}>{label}</span>
    </div>
  )
}
