// API pour les rendez-vous
import { initializeApp } from '@/lib/db';
import RendezVous from '@/models/RendezVous';

export async function GET(request: Request) {
  try {
    await initializeApp();

    // Récupérer les rendez-vous depuis MongoDB
    const rendezvous = await RendezVous.find().populate('patientId').lean();

    return Response.json({ rendezvous }, { status: 200 });
  } catch (error) {
    console.error('Erreur API /rendezvous:', error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initializeApp();

    const body = await request.json();
    const newRDV = new RendezVous(body);
    const savedRDV = await newRDV.save();

    return Response.json(savedRDV, { status: 201 });
  } catch (error) {
    console.error('Erreur création RDV:', error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
