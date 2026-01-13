import { NextRequest, NextResponse } from 'next/server';
import { generatePredictions, CabinetData } from '@/lib/openai-service';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cabinetData: CabinetData = body;

    if (!cabinetData.id || !cabinetData.nom) {
      return NextResponse.json(
        { error: 'Données cabinet invalides' },
        { status: 400 }
      );
    }

    const predictions = await generatePredictions(cabinetData);

    return NextResponse.json({
      success: true,
      data: predictions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erreur API predictions:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération des prédictions',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
