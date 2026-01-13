import { NextRequest, NextResponse } from 'next/server';
import { generateReportWithAI, generatePredictions, generateRecommendations, CabinetData } from '@/lib/openai-service';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cabinetName, cabinetData, period } = body;

    if (!cabinetName || !cabinetData || !period) {
      return NextResponse.json(
        { error: 'Paramètres manquants: cabinetName, cabinetData, period' },
        { status: 400 }
      );
    }

    // Générer les prédictions et recommandations
    const predictions = await generatePredictions(cabinetData);
    const recommendations = await generateRecommendations(cabinetData, predictions);
    
    // Générer le rapport complet
    const report = await generateReportWithAI(
      cabinetName,
      cabinetData,
      predictions,
      recommendations,
      period
    );

    return NextResponse.json({
      success: true,
      data: {
        report,
        predictions,
        recommendations,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Erreur API rapport IA:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération du rapport IA',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
