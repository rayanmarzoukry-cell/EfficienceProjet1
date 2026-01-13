// Configuration des KPI et seuils pour EFFICIENCE ANALYTICS

export const KPI_CONFIG = {
  // Seuils de performance
  PERFORMANCE_THRESHOLDS: {
    EXCELLENT: 90,
    GOOD: 75,
    WARNING: 60,
    DANGER: 0,
  },

  // Objectifs par défaut
  OBJECTIVES: {
    CA_MONTHLY: 150000,
    CA_HOURLY: 600,
    NEW_PATIENTS_MONTHLY: 15,
    CONSULTATION_RATE: 85,
    EMAIL_SEND_RATE: 95,
    REPORT_GENERATION_RATE: 100,
  },

  // Couleurs pour les statuts
  COLORS: {
    EXCELLENT: "#10b981", // green
    GOOD: "#3b82f6", // blue
    WARNING: "#f59e0b", // orange
    DANGER: "#ef4444", // red
    NEUTRAL: "#6b7280", // gray
  },

  // Catégories de cabinets
  CABINET_STATUS: {
    PERFORMANT: {
      label: "Performant",
      color: "#10b981",
      minScore: 85,
    },
    SURVEILLER: {
      label: "À surveiller",
      color: "#f59e0b",
      minScore: 70,
    },
    ATTENTION: {
      label: "En attention",
      color: "#ef4444",
      minScore: 0,
    },
  },

  // Types de rapports
  REPORT_TYPES: {
    MONTHLY: "Mensuel",
    QUARTERLY: "Trimestriel",
    ANNUAL: "Annuel",
    CUSTOM: "Personnalisé",
  },

  // Métriques à suivre
  METRICS: {
    CA: {
      label: "Chiffre d'affaires",
      unit: "€",
      type: "currency",
    },
    CA_HOURLY: {
      label: "CA horaire",
      unit: "€/h",
      type: "currency",
    },
    NEW_PATIENTS: {
      label: "Nouveaux patients",
      unit: "",
      type: "number",
    },
    TREATED_PATIENTS: {
      label: "Patients traités",
      unit: "",
      type: "number",
    },
    SCHEDULED_PATIENTS: {
      label: "Patients sur l'agenda",
      unit: "",
      type: "number",
    },
    QUOTES_PROPOSED: {
      label: "Devis proposés",
      unit: "",
      type: "number",
    },
    QUOTES_ACCEPTED: {
      label: "Devis acceptés",
      unit: "",
      type: "number",
    },
    ACCEPTANCE_RATE: {
      label: "Taux d'acceptation",
      unit: "%",
      type: "percentage",
    },
    CONSULTATION_SCORE: {
      label: "Score de consultation",
      unit: "%",
      type: "percentage",
    },
    WORK_HOURS: {
      label: "Heures travaillées",
      unit: "h",
      type: "number",
    },
    HP_HOURS: {
      label: "Heures HP",
      unit: "h",
      type: "number",
    },
  },

  // Fréquences de génération de rapports
  REPORT_FREQUENCIES: {
    DAILY: "Quotidien",
    WEEKLY: "Hebdomadaire",
    MONTHLY: "Mensuel",
    QUARTERLY: "Trimestriel",
  },

  // Canaux d'alerte
  ALERT_CHANNELS: {
    EMAIL: "Email",
    SMS: "SMS",
    DASHBOARD: "Dashboard",
    PUSH: "Notification Push",
  },

  // Périodes de rapport
  REPORT_PERIODS: {
    JANUARY: "Janvier",
    FEBRUARY: "Février",
    MARCH: "Mars",
    APRIL: "Avril",
    MAY: "Mai",
    JUNE: "Juin",
    JULY: "Juillet",
    AUGUST: "Août",
    SEPTEMBER: "Septembre",
    OCTOBER: "Octobre",
    NOVEMBER: "Novembre",
    DECEMBER: "Décembre",
  },
}

// Configuration des graphiques
export const CHART_CONFIG = {
  COLORS: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"],
  DEFAULT_HEIGHT: 300,
  TOOLTIP_BG: "#090E1A",
  GRID_COLOR: "rgba(255,255,255,0.1)",
  AXIS_COLOR: "rgba(255,255,255,0.3)",
}

// Configuration de pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  SMALL_PAGE_SIZE: 5,
  LARGE_PAGE_SIZE: 25,
}

// Configuration des alertes
export const ALERT_CONFIG = {
  CA_BELOW_OBJECTIVE: {
    type: "warning",
    title: "CA < Objectif",
    threshold: 0.9, // 90% de l'objectif
  },
  HIGH_ABSENCE_RATE: {
    type: "warning",
    title: "Absences élevées",
    threshold: 0.15, // 15%
  },
  REPORTS_NOT_SENT: {
    type: "danger",
    title: "Rapports non envoyés",
    threshold: 1, // Au moins 1 rapport non envoyé
  },
  LOW_CONSULTATION_SCORE: {
    type: "danger",
    title: "Score de consultation bas",
    threshold: 0.7, // 70%
  },
}
