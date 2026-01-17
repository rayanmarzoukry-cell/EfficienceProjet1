// API pour les statistiques globales du dashboard
import { NextResponse } from 'next/server';
import { initializeApp } from '@/lib/db';
import Patient from '@/models/Patient';
import Cabinet from '@/models/Cabinet';
import RendezVous from '@/models/RendezVous';

export async function GET() {
  try {
    await initializeApp();

    // Récupérer les patients
    const patients = await Patient.find().lean();
    const patientCount = patients.length;

    // Récupérer les cabinets
    const cabinets = await Cabinet.find().lean();
    
    // Calculer le CA total et objectif
    const totalCA = cabinets.reduce((sum, c) => sum + (c.caActuel || 0), 0);
    const totalObjectif = cabinets.reduce((sum, c) => sum + (c.caObjectif || 0), 0);

    // Récupérer les RDV
    const rendezvous = await RendezVous.find().lean();
    const rdvCount = rendezvous.length;

    // Calculer la progression
    const progression = totalObjectif > 0 
      ? Math.round((totalCA / totalObjectif) * 100) 
      : 0;

    return NextResponse.json({
      nouveauxPatients: patientCount,
      caActuel: totalCA,
      caObjectif: totalObjectif,
      progression: progression,
      rdvCount: rdvCount,
      cabinets: cabinets,
      patients: patients,
      rendezvous: rendezvous,
    });
  } catch (error) {
    console.error('Erreur API /stats:', error);
    return NextResponse.json({ 
      error: "Erreur serveur",
      nouveauxPatients: 0,
      caActuel: 0,
      caObjectif: 0,
      progression: 0,
      rdvCount: 0,
      cabinets: [],
      patients: [],
      rendezvous: [],
    }, { status: 500 });
  }
}