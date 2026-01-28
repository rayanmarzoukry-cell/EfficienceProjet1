import { NextRequest, NextResponse } from 'next/server'
import { initializeApp } from '@/lib/db'
import mongoose from 'mongoose'

/**
 * Webhook pour N8N
 * N8N envoie les données importées ici après validation
 * Endpoint: POST /api/admin/webhook-n8n
 */

export async function POST(req: NextRequest) {
  try {
    // Vérifier le token webhook (de sécurité)
    const authHeader = req.headers.get('authorization')
    const webhookToken = process.env.N8N_WEBHOOK_TOKEN || 'default-webhook-token'
    
    if (authHeader !== `Bearer ${webhookToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { type, cabinetId, data, action } = body

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type, data' },
        { status: 400 }
      )
    }

    const db = await initializeApp()
    const timestamp = new Date()
    let result: any = {}

    // ============================================
    // TRAITEMENT PAR TYPE DE DONNÉES
    // ============================================

    switch (type) {
      // ✅ PATIENTS
      case 'patients':
        result = await importPatients(db, cabinetId, data, timestamp)
        break

      // ✅ DONNÉES FINANCIÈRES (CA, revenus, etc)
      case 'finances':
        result = await importFinances(db, cabinetId, data, timestamp)
        break

      // ✅ PRODUCTION (heures praticiens, actes)
      case 'production':
        result = await importProduction(db, cabinetId, data, timestamp)
        break

      // ✅ RDV ET PLANNING
      case 'appointments':
        result = await importAppointments(db, cabinetId, data, timestamp)
        break

      default:
        return NextResponse.json(
          { error: `Unknown data type: ${type}` },
          { status: 400 }
        )
    }

    // ✅ Logger le webhook dans MongoDB pour audit
    await logWebhookAction(db, {
      type,
      cabinetId,
      action: action || 'import',
      recordsProcessed: Array.isArray(data) ? data.length : 1,
      success: result.success,
      timestamp,
      details: result
    })

    return NextResponse.json({
      success: true,
      message: `${result.inserted || 0} records imported successfully`,
      type,
      timestamp,
      ...result
    })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// ============================================
// FONCTIONS D'IMPORT PAR TYPE
// ============================================

async function importPatients(db: any, cabinetId: string, data: any[], timestamp: Date) {
  try {
    const collection = mongoose.connection.collection('patients')
    
    // Valider les données
    const validData = data.map(patient => ({
      nom: patient.nom || patient.name || 'Unknown',
      prenom: patient.prenom || patient.firstName || '',
      email: patient.email || '',
      telephone: patient.telephone || patient.phone || '',
      dateNaissance: patient.dateNaissance || patient.dob || '',
      cabinetId: cabinetId || patient.cabinetId,
      createdAt: timestamp,
      updatedAt: timestamp,
      source: 'n8n-import'
    }))

    // Insérer sans doublons (par email)
    const result = await collection.insertMany(validData, { ordered: false }).catch((err: any) => {
      if (err.code === 11000) {
        console.warn('⚠️ Duplicates detected, but some records inserted')
      }
      return { insertedCount: 0 }
    })

    return {
      success: true,
      inserted: result.insertedCount || validData.length,
      collection: 'patients',
      type: 'patients'
    }
  } catch (error) {
    throw error
  }
}

async function importFinances(db: any, cabinetId: string, data: any[], timestamp: Date) {
  try {
    const collection = mongoose.connection.collection('donnees_cabinet')
    
    const validData = data.map(finance => ({
      cabinetId: cabinetId || finance.cabinetId,
      periode: finance.periode || finance.month || new Date().toISOString().slice(0, 7),
      chiffreAffaires: parseFloat(finance.chiffreAffaires || finance.revenue || 0),
      revenus: parseFloat(finance.revenus || finance.revenue || 0),
      depenses: parseFloat(finance.depenses || finance.expenses || 0),
      benefice: parseFloat(finance.benefice || 0) || 
                (parseFloat(finance.chiffreAffaires || 0) - parseFloat(finance.depenses || 0)),
      createdAt: timestamp,
      updatedAt: timestamp,
      source: 'n8n-import'
    }))

    const result = await collection.insertMany(validData, { ordered: false }).catch((err: any) => {
      if (err.code === 11000) console.warn('⚠️ Duplicates detected')
      return { insertedCount: 0 }
    })

    return {
      success: true,
      inserted: result.insertedCount || validData.length,
      collection: 'donnees_cabinet',
      type: 'finances'
    }
  } catch (error) {
    throw error
  }
}

async function importProduction(db: any, cabinetId: string, data: any[], timestamp: Date) {
  try {
    const collection = mongoose.connection.collection('production')
    
    const validData = data.map(prod => ({
      cabinetId: cabinetId || prod.cabinetId,
      praticien: prod.praticien || prod.dentist || 'Unknown',
      periode: prod.periode || prod.month || new Date().toISOString().slice(0, 7),
      heures: parseFloat(prod.heures || prod.hours || 0),
      actes: parseInt(prod.actes || prod.procedures || 0),
      revenus: parseFloat(prod.revenus || prod.revenue || 0),
      createdAt: timestamp,
      updatedAt: timestamp,
      source: 'n8n-import'
    }))

    const result = await collection.insertMany(validData, { ordered: false }).catch((err: any) => {
      if (err.code === 11000) console.warn('⚠️ Duplicates detected')
      return { insertedCount: 0 }
    })

    return {
      success: true,
      inserted: result.insertedCount || validData.length,
      collection: 'production',
      type: 'production'
    }
  } catch (error) {
    throw error
  }
}

async function importAppointments(db: any, cabinetId: string, data: any[], timestamp: Date) {
  try {
    const collection = mongoose.connection.collection('rendezvous')
    
    const validData = data.map(appt => ({
      cabinetId: cabinetId || appt.cabinetId,
      patientNom: appt.patientNom || appt.patientName || '',
      date: appt.date || appt.dateRDV || new Date().toISOString(),
      heure: appt.heure || appt.time || '09:00',
      type: appt.type || 'CONTRÔLE',
      praticien: appt.praticien || appt.dentist || '',
      duree: parseInt(appt.duree || appt.duration || 30),
      status: appt.status || 'PLANIFIE',
      createdAt: timestamp,
      updatedAt: timestamp,
      source: 'n8n-import'
    }))

    const result = await collection.insertMany(validData, { ordered: false }).catch((err: any) => {
      if (err.code === 11000) console.warn('⚠️ Duplicates detected')
      return { insertedCount: 0 }
    })

    return {
      success: true,
      inserted: result.insertedCount || validData.length,
      collection: 'rendezvous',
      type: 'appointments'
    }
  } catch (error) {
    throw error
  }
}

// ============================================
// LOGGING POUR AUDIT
// ============================================

async function logWebhookAction(db: any, logData: any) {
  try {
    const collection = mongoose.connection.collection('webhook_logs')
    await collection.insertOne({
      ...logData,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('❌ Error logging webhook:', error)
  }
}
