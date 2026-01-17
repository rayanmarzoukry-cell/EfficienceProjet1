// app/api/seed/kpis.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const runtime = 'nodejs';

// Support GET et POST
export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get('action');
  
  if (action === 'seed') {
    return handleSeed();
  }
  
  return NextResponse.json({
    message: 'Seed API is ready',
    usage: 'POST /api/seed/kpis or GET /api/seed/kpis?action=seed',
    mongodbUri: process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing',
  });
}

export async function POST(request: NextRequest) {
  return handleSeed();
}

async function handleSeed() {
  try {
    console.log('🔄 Starting seed...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    const client = await clientPromise;
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('efficience-db');
    const collection = db.collection('kpiresults');

    // Données initiales
    const seedData = [
      {
        cabinetName: 'Dr Mocanu',
        caActuel: 45000,
        caObjectif: 55000,
        volumePatients: 342,
        performanceMoyenne: 82,
        rapportsGenerés: 156,
        emailsEnvoyes: 142,
        absences: 2,
        dateCreation: new Date(),
      },
      {
        cabinetName: 'Dr Bresdin',
        caActuel: 52000,
        caObjectif: 60000,
        volumePatients: 287,
        performanceMoyenne: 87,
        rapportsGenerés: 142,
        emailsEnvoyes: 128,
        absences: 1,
        dateCreation: new Date(),
      },
      {
        cabinetName: 'Dr Burnier',
        caActuel: 38000,
        caObjectif: 50000,
        volumePatients: 215,
        performanceMoyenne: 76,
        rapportsGenerés: 98,
        emailsEnvoyes: 95,
        absences: 3,
        dateCreation: new Date(),
      },
      {
        cabinetName: 'Dr Dick',
        caActuel: 41000,
        caObjectif: 52000,
        volumePatients: 278,
        performanceMoyenne: 79,
        rapportsGenerés: 112,
        emailsEnvoyes: 110,
        absences: 2,
        dateCreation: new Date(),
      },
      {
        cabinetName: 'Dr Zina',
        caActuel: 48000,
        caObjectif: 58000,
        volumePatients: 312,
        performanceMoyenne: 83,
        rapportsGenerés: 134,
        emailsEnvoyes: 125,
        absences: 1,
        dateCreation: new Date(),
      },
    ];

    console.log('📝 Inserting', seedData.length, 'documents...');
    const result = await collection.insertMany(seedData);

    console.log('✅ Inserted successfully:', result.insertedCount);

    return NextResponse.json(
      {
        success: true,
        message: `✅ ${result.insertedCount} documents insérés dans MongoDB!`,
        insertedCount: result.insertedCount,
        cabinets: seedData.map(d => d.cabinetName),
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ Erreur seed KPIs:', errorMsg);
    
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
        hint: 'Vérifie que MONGODB_URI est dans .env.local et accessible',
      },
      { status: 500 }
    );
  }
}
