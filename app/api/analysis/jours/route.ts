import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'Clientcordonnée');
    
    // Lire analyse-joursouverts.txt
    const joursPath = path.join(dataDir, 'analyse-joursouverts.txt');
    const joursContent = await fs.readFile(joursPath, 'utf-8');
    const joursLines = joursContent.split('\n').slice(1); // Skip header
    
    const jours = joursLines
      .filter(line => line.trim())
      .map(line => {
        const [praticien, mois, nbHeures] = line.split('\t');
        return {
          praticien,
          mois,
          nbHeures: parseInt(nbHeures) || 0,
        };
      });

    return Response.json({ jours }, { status: 200 });
  } catch (error) {
    console.error('Error reading jours data:', error);
    return Response.json({ error: 'Failed to load jours data' }, { status: 500 });
  }
}
