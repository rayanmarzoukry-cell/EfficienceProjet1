// data/rendezvous.ts

/**
 * STATISTIQUES GLOBALES
 * Utilisées pour : PieChart, ProductionChart et l'IA Ollama
 */
export const rdvData = {
  total: 180,
  objectif: 200,
  tauxPresence: 91,
  absences: 15,
  nouveauxPatients: 25,
  traitements: {
    consultations: 85,
    soins: 62,
    chirurgie: 18,
    orthodontie: 15,
  },
};

/**
 * LISTE DES RENDEZ-VOUS DU JOUR
 * Utilisée pour : RendezVousWidget (le planning visuel)
 */
export const PROCHAINS_RDV = [
  { 
    id: 1, 
    patient: "PATIENT 47", 
    heure: "11:15", 
    type: "CONSULTATION", 
    statut: "Confirmé" 
  },
  { 
    id: 2, 
    patient: "PATIENT 49", 
    heure: "14:30", 
    type: "SOINS", 
    statut: "Arrivé" 
  },
  { 
    id: 3, 
    patient: "PATIENT 53", 
    heure: "15:00", 
    type: "CHIRURGIE", 
    statut: "Confirmé" 
  },
  { 
    id: 4, 
    patient: "PATIENT 55", 
    heure: "16:45", 
    type: "ORTHODONTIE", 
    statut: "En attente" 
  },
];