import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'

/**
 * API pour récupérer les importations récentes
 * Endpoint: GET /api/admin/recent-imports
 */

export async function GET() {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('webhook_logs')

    // Récupérer les imports des 5 dernières minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

    const recentImports = await collection
      .find({
        timestamp: { $gte: fiveMinutesAgo },
        success: true
      })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray()

    return NextResponse.json({
      success: true,
      imports: recentImports,
      count: recentImports.length,
      checkTime: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error fetching recent imports:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch recent imports',
        imports: []
      },
      { status: 500 }
    )
  }
}
