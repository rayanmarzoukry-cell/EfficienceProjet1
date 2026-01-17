// app/api/seed/test.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Test basique pour vérifier que l'endpoint existe
    return NextResponse.json({
      message: 'Endpoint seed/test fonctionne!',
      time: new Date().toISOString(),
      mongodbUri: process.env.MONGODB_URI ? '✅ Configuré' : '❌ Manquant',
      mongodbDb: process.env.MONGODB_DB || 'efficience-db',
      nodeEnv: process.env.NODE_ENV,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
