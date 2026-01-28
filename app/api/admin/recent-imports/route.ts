import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import mongoose from 'mongoose'

/**
 * API pour récupérer les importations récentes
 * Endpoint: GET /api/admin/recent-imports?minutes=5&limit=20&type=patients
 * 
 * ✅ Retourne les imports récents avec stats
 * ✅ Filtrage par type (patients, finances, production, appointments)
 * ✅ Filtrage par plage de temps
 * ✅ Agrégation des stats
 */

export async function GET(req: NextRequest) {
  try {
    // 📋 Récupérer les paramètres de requête
    const { searchParams } = new URL(req.url)
    const minutes = parseInt(searchParams.get('minutes') || '5')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') // Filtre optionnel: patients, finances, production, appointments
    const successOnly = searchParams.get('successOnly') !== 'false' // Par défaut true

    // 🔌 Connecter MongoDB
    await connectToDatabase()
    const collection = mongoose.connection.collection('webhook_logs')

    // ⏰ Calculer la plage de temps
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000)

    // 🔍 Construire la requête
    const query: any = {
      timestamp: { $gte: cutoffTime }
    }

    // Filtre optionnel par type
    if (type && ['patients', 'finances', 'production', 'appointments'].includes(type)) {
      query.type = type
    }

    // Filtre par succès
    if (successOnly) {
      query.success = true
    }

    // 📊 Récupérer les logs
    const recentImports = await collection
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray()

    // 🎯 Transformer les résultats
    const transformedImports = recentImports.map((imp: any) => ({
      id: imp._id?.toString() || '',
      type: imp.type || 'unknown',
      status: imp.success ? 'success' : 'error',
      recordsProcessed: imp.recordsProcessed || 0,
      message: imp.action || 'Import processed',
      timestamp: imp.timestamp?.toISOString() || new Date().toISOString(),
      timestampLocal: imp.timestamp ? new Date(imp.timestamp).toLocaleString('fr-FR') : new Date().toLocaleString('fr-FR'),
      cabinetId: imp.cabinetId || 'all',
      details: {
        inserted: imp.details?.inserted || 0,
        errors: imp.details?.errors || [],
        errorMessage: imp.details?.error || null
      }
    }))

    // 📈 Calculer les stats d'agrégation
    const stats = {
      totalImports: transformedImports.length,
      successCount: transformedImports.filter((i: any) => i.status === 'success').length,
      errorCount: transformedImports.filter((i: any) => i.status === 'error').length,
      totalRecords: transformedImports.reduce((sum: number, i: any) => sum + (i.recordsProcessed || 0), 0),
      totalInserted: transformedImports.reduce((sum: number, i: any) => sum + (i.details?.inserted || 0), 0),
      byType: {
        patients: transformedImports.filter((i: any) => i.type === 'patients').length,
        finances: transformedImports.filter((i: any) => i.type === 'finances').length,
        production: transformedImports.filter((i: any) => i.type === 'production').length,
        appointments: transformedImports.filter((i: any) => i.type === 'appointments').length
      },
      successRate: transformedImports.length > 0 
        ? Math.round((transformedImports.filter((i: any) => i.status === 'success').length / transformedImports.length) * 100)
        : 0
    }

    return NextResponse.json({
      success: true,
      imports: transformedImports,
      stats,
      query: {
        minutes,
        limit,
        type: type || 'all',
        successOnly,
        timeRange: {
          from: cutoffTime.toISOString(),
          to: new Date().toISOString()
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error fetching recent imports:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch recent imports',
        details: error instanceof Error ? error.message : 'Unknown error',
        imports: [],
        stats: {
          totalImports: 0,
          successCount: 0,
          errorCount: 0,
          totalRecords: 0,
          totalInserted: 0,
          byType: { patients: 0, finances: 0, production: 0, appointments: 0 },
          successRate: 0
        }
      },
      { status: 500 }
    )
  }
}
