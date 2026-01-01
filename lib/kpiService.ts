// lib/kpiService.ts

// --- Types (pour garantir la sécurité du code) ---

export interface KpiDetail {
  valeur: number;
  score: 'Bon' | 'Moyen' | 'Faible' | 'Alerte Critique';
  reco: string;
  cible: number;
}

export interface KpiApiResponse {
  cabinetId: string;
  mois: string;
  resultsCount: number;
  kpis: Record<string, KpiDetail>;
  message: string;
}

// --- Fonction d'appel API ---

const API_BASE_URL = '/api/kpis';

/**
 * Récupère les données KPI pour un cabinet donné.
 * @param cabinetId L'identifiant du cabinet (ex: 'demo').
 * @returns Les données KPI structurées.
 */
export async function fetchKpis(cabinetId: string): Promise<KpiApiResponse | null> {
  try {
    const url = `${API_BASE_URL}/${cabinetId}`;
    
    // Utilisation de la méthode fetch native de Next.js/Browser
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // Cache désactivé pour s'assurer que nous obtenons toujours les dernières données en dev
        cache: 'no-store' 
    });

    if (!response.ok) {
      // Gérer les erreurs (comme le 404 que nous avons configuré)
      if (response.status === 404) {
        console.warn(`[KPIService] 404: Aucun KPI trouvé pour le cabinet ${cabinetId}.`);
        return null;
      }
      // Gérer les autres erreurs serveur (500)
      throw new Error(`Erreur API: ${response.statusText}`);
    }

    const data: KpiApiResponse = await response.json();
    return data;

  } catch (error) {
    console.error(`Erreur lors de la récupération des KPIs pour ${cabinetId}:`, error);
    // Retourner null ou rejeter l'erreur, selon la gestion que vous souhaitez
    return null;
  }
}