import { NextRequest, NextResponse } from 'next/server';
import { analyzeCabinet, CabinetData } from '@/lib/openai-service';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Vérifier que la clé API est configurée
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY non configuré');
      return NextResponse.json(
        { 
          error: 'Clé OpenAI non configurée',
          details: 'Veuillez ajouter OPENAI_API_KEY dans .env.local'
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const cabinetData: CabinetData = body;

    if (!cabinetData.id || !cabinetData.nom) {
      return NextResponse.json(
        { error: 'Données cabinet invalides' },
        { status: 400 }
      );
    }

    console.log('Analysing cabinet:', cabinetData.nom);
    const analysis = await analyzeCabinet(cabinetData);

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        cabinetName: cabinetData.nom,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Erreur API analyse cabinet:', errorMsg);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'analyse du cabinet',
        details: errorMsg
      },
      { status: 500 }
    );
  }
}
