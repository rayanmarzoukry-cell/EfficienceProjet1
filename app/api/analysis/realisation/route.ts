import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'Clientcordonnée');
    
    // Lire analyse-realisation.txt
    const realisationPath = path.join(dataDir, 'analyse-realisation.txt');
    const realisationContent = await fs.readFile(realisationPath, 'utf-8');
    const realisationLines = realisationContent.split('\n').slice(1); // Skip header
    
    const realisation = realisationLines
      .filter(line => line.trim())
      .map(line => {
        const [praticien, mois, nbPatients, montantFacture, montantEncaisse] = line.split('\t');
        return {
          praticien,
          mois,
          nbPatients: parseInt(nbPatients) || 0,
          montantFacture: parseFloat(montantFacture) || 0,
          montantEncaisse: parseFloat(montantEncaisse) || 0,
        };
      });

    return Response.json({ realisation }, { status: 200 });
  } catch (error) {
    console.error('Error reading realisation data:', error);
    return Response.json({ error: 'Failed to load realisation data' }, { status: 500 });
  }
}
