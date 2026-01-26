import { NextRequest, NextResponse } from "next/server"
import { initializeApp } from "@/lib/db"
import Patient from "@/models/Patient"
import Cabinet from "@/models/Cabinet"
import RendezVous from "@/models/RendezVous"
import AuditLog from "@/models/AuditLog"

interface ImportResult {
  success: number
  failed: number
  errors: string[]
  summary: {
    patients?: number
    cabinets?: number
    rendezvous?: number
  }
}

export async function POST(request: NextRequest) {
  let auditId: string | null = null
  
  try {
    console.log("📥 Import started")
    await initializeApp()
    console.log("✅ MongoDB connected")

    // Récupérer les données du formulaire
    const formData = await request.formData()
    const file = formData.get("file") as File
    const resourceType = formData.get("resourceType") as string
    const adminEmail = formData.get("adminEmail") as string

    console.log(`📋 File: ${file?.name}, Type: ${resourceType}, Admin: ${adminEmail}`)

    if (!file || !resourceType || !adminEmail) {
      console.log("❌ Missing required fields")
      return NextResponse.json(
        { error: "Fichier, type de ressource et email admin requis" },
        { status: 400 }
      )
    }

    // Créer un log d'audit
    const auditLog = new AuditLog({
      adminId: adminEmail,
      adminEmail,
      action: "import_data",
      resource: resourceType,
      status: "pending",
      fileInfo: {
        fileName: file.name,
        fileSize: file.size,
      },
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    })
    
    await auditLog.save()
    auditId = auditLog._id.toString()

    // Lire le fichier
    const buffer = await file.arrayBuffer()
    const text = new TextDecoder().decode(buffer)
    const lines = text.split("\n").filter(line => line.trim())

    if (lines.length === 0) {
      throw new Error("Le fichier est vide")
    }

    // Parser le CSV
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase())
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
      summary: {},
    }

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(",").map(v => v.trim())
        const row: Record<string, string> = {}

        headers.forEach((header, index) => {
          row[header] = values[index] || ""
        })

        // Importer selon le type de ressource
        if (resourceType === "patients") {
          await importPatient(row)
          result.success++
        } else if (resourceType === "cabinets") {
          await importCabinet(row)
          result.success++
        } else if (resourceType === "rendezvous") {
          await importRendezVous(row)
          result.success++
        }
      } catch (error: any) {
        result.failed++
        result.errors.push(`Ligne ${i}: ${error.message}`)
      }
    }

    result.summary = {
      patients: resourceType === "patients" ? result.success : undefined,
      cabinets: resourceType === "cabinets" ? result.success : undefined,
      rendezvous: resourceType === "rendezvous" ? result.success : undefined,
    }

    // Mettre à jour le log d'audit
    await AuditLog.findByIdAndUpdate(auditId, {
      status: "success",
      recordsAffected: result.success,
      details: result,
      fileInfo: {
        fileName: file.name,
        fileSize: file.size,
        rows: lines.length - 1,
      },
    })

    return NextResponse.json({
      message: "✅ Import réussi",
      data: result,
      auditId,
    })
  } catch (error: any) {
    // Mettre à jour le log d'audit avec erreur
    if (auditId) {
      await AuditLog.findByIdAndUpdate(auditId, {
        status: "error",
        errorMessage: error.message,
      }).catch(() => {})
    }

    console.error("❌ Erreur import:", error)
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'import" },
      { status: 500 }
    )
  }
}

async function importPatient(row: Record<string, string>) {
  const { name, email, phone, daterdv, type, status, cabinetid } = row

  if (!name || !email) {
    throw new Error("Nom et email requis pour un patient")
  }

  // Upsert patient
  await Patient.findOneAndUpdate(
    { email: email } as any,
    {
      name,
      email,
      phone: phone || "",
      dateRDV: daterdv ? new Date(daterdv) : new Date(),
      time: "09:00",
      type: type || "CONTRÔLE",
      status: status || "ATTENTE",
      cabinetId: cabinetid || "default",
    },
    { upsert: true, new: true }
  )
}

async function importCabinet(row: Record<string, string>) {
  const { nom, email, phone, caactuel, caobjectif, score } = row

  if (!nom) {
    throw new Error("Nom du cabinet requis")
  }

  // Upsert cabinet
  await Cabinet.findOneAndUpdate(
    { nom } as any,
    {
      nom,
      email: email || "",
      phone: phone || "",
      caActuel: parseFloat(caactuel) || 0,
      caObjectif: parseFloat(caobjectif) || 0,
      score: parseFloat(score) || 0,
    },
    { upsert: true, new: true }
  )
}

async function importRendezVous(row: Record<string, string>) {
  const { patientid, cabinetid, date, type, status, duration } = row

  if (!patientid || !cabinetid || !date) {
    throw new Error("Patient ID, Cabinet ID et date requis")
  }

  // Upsert rendez-vous
  await RendezVous.findOneAndUpdate(
    { 
      patientId: patientid, 
      cabinetId: cabinetid, 
      dateRDV: new Date(date) 
    } as any,
    {
      patientId: patientid,
      cabinetId: cabinetid,
      dateRDV: new Date(date),
      time: "14:00",
      type: type || "CONTRÔLE",
      status: status || "SCHEDULED",
      duration: parseInt(duration) || 30,
    } as any,
    { upsert: true, new: true }
  )
}
