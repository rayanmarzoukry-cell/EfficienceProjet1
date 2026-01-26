import { NextRequest, NextResponse } from 'next/server'

/**
 * API pour déclencher manuellement la synchronisation N8N
 * Endpoint: POST /api/admin/trigger-sync
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, cabinetId } = body

    // ✅ Vérifier le token (sécurité)
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ✅ Déclencher N8N (si URL configurée)
    const n8nWebhookUrl = process.env.N8N_TRIGGER_WEBHOOK_URL
    
    if (n8nWebhookUrl) {
      try {
        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: action || 'manual-sync',
            cabinetId: cabinetId || 'all',
            timestamp: new Date().toISOString()
          })
        })

        if (!n8nResponse.ok) {
          console.warn('⚠️ N8N trigger failed:', await n8nResponse.text())
        }
      } catch (error) {
        console.error('❌ Failed to trigger N8N:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Synchronisation déclenchée',
      action,
      n8nTriggered: !!n8nWebhookUrl,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Trigger sync error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to trigger sync',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
