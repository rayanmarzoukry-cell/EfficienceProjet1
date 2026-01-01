import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'Clientcordonnée');
    
    // Lire analyse-rendezvous.txt
    const rdvPath = path.join(dataDir, 'analyse-rendezvous.txt');
    const rdvContent = await fs.readFile(rdvPath, 'utf-8');
    const rdvLines = rdvContent.split('\n').slice(1); // Skip header
    
    const rdv = rdvLines
      .filter(line => line.trim())
      .map(line => {
        const [praticien, mois, nbRdv, dureeTotale, nbPatients, nbNouveaux] = line.split('\t');
        return {
          praticien,
          mois,
          nbRdv: parseInt(nbRdv) || 0,
          dureeTotale: parseInt(dureeTotale) || 0,
          nbPatients: parseInt(nbPatients) || 0,
          nbNouveaux: parseInt(nbNouveaux) || 0,
        };
      });

    return Response.json({ rdv }, { status: 200 });
  } catch (error) {
    console.error('Error reading RDV data:', error);
    return Response.json({ error: 'Failed to load RDV data' }, { status: 500 });
  }
}
