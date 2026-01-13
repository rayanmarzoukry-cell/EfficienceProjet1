import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("efficience-db");
    
    // On récupère les dernières stats de la collection kpiresults
    const stats = await db.collection("kpiresults")
      .find({})
      .sort({ _id: -1 }) // Les plus récents en premier
      .limit(1)
      .toArray();
    
    return NextResponse.json(stats[0] || {});
  } catch (e) {
    console.error("Erreur API Stats:", e);
    return NextResponse.json({ error: "Erreur de connexion base de données" }, { status: 500 });
  }
}