import { NextRequest, NextResponse } from 'next/server';
import { generateRecommendations, generatePredictions, CabinetData, PredictionResult } from '@/lib/openai-service';

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

    // D'abord générer les prédictions
    const predictions = await generatePredictions(cabinetData);
    
    // Ensuite générer les recommandations basées sur les prédictions
    const recommendations = await generateRecommendations(cabinetData, predictions);

    return NextResponse.json({
      success: true,
      data: {
        predictions,
        recommendations,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erreur API recommandations:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération des recommandations',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
