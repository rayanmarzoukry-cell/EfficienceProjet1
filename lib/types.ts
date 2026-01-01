export interface Cabinet {
  id: number
  nom: string
  ville: string
  email: string
  telephone?: string
  adresse?: string
  dateCreation: string
  objectifs: {
    chiffreAffaires: number
    nombreRendezVous: number
    tauxAbsence: number
  }
  statut: "actif" | "inactif" | "attention"
}

export interface DonneesCabinet {
  cabinetId: number
  periode: string
  chiffreAffaires: number
  nombreRendezVous: number
  nombreAbsences: number
  nouveauxPatients: number
  traitements: {
    consultations: number
    soins: number
    chirurgie: number
    orthodontie: number
  }
  dateImport: string
}

export interface AnalysePerformance {
  cabinetId: number
  periode: string
  scoreGlobal: number
  metriques: {
    performanceCA: number
    performanceRDV: number
    tauxAbsence: number
  }
  analyse: string
  recommandations: string[]
  dateAnalyse: string
}

export interface Rapport {
  id: number
  cabinetId: number
  periode: string
  dateGeneration: string
  statut: "généré" | "envoyé" | "erreur"
  contenu: {
    resume: {
      scoreGlobal: number
      chiffreAffaires: number
      objectifCA: number
      nombreRDV: number
      tauxAbsence: number
    }
    analyses: string[]
    recommandations: string[]
  }
  fichierPDF: string
}

export interface Email {
  id: number
  cabinetId: number
  destinataire: string
  sujet: string
  dateEnvoi: string
  statut: "envoyé" | "erreur" | "en_attente"
  messageId?: string
}

export interface TacheAutomatisee {
  nom: string
  description: string
  frequence: "quotidienne" | "hebdomadaire" | "mensuelle"
  prochaineLancement: string
  derniereLancement?: string
  statut: "active" | "inactive" | "erreur"
}
