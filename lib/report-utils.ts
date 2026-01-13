// Utilitaires pour l'export et la génération PDF

export async function generatePDF(cabinetName: string, data: any) {
  try {
    // Simuler la génération d'un PDF
    const pdfContent = `
      RAPPORT ${cabinetName}
      Date: ${new Date().toLocaleDateString()}
      
      Analyse Chiffre d'Affaires:
      - CA Total: ${data.ca || "N/A"}
      - CA Horaire: ${data.caHoraire || "N/A"}
      - Objectif: ${data.objectif || "N/A"}
      
      Analyse Agenda:
      - Nouveaux patients: ${data.newPatients || "N/A"}
      - Patients traités: ${data.treatedPatients || "N/A"}
      - Sur l'agenda: ${data.scheduledPatients || "N/A"}
      
      Analyse Devis:
      - Nombre de devis: ${data.devisCount || "N/A"}
      - Montant moyen: ${data.devisMoyenne || "N/A"}
      - Taux d'acceptation: ${data.acceptanceRate || "N/A"}%
    `

    // Dans un vrai projet, utiliser une librairie comme jsPDF ou pdfkit
    return {
      success: true,
      filename: `rapport_${cabinetName.replace(/\s+/g, "_")}_${Date.now()}.pdf`,
      content: pdfContent,
    }
  } catch (error) {
    return {
      success: false,
      error: "Erreur lors de la génération du PDF",
    }
  }
}

export function exportToCSV(data: any[], filename: string) {
  try {
    if (!data || data.length === 0) {
      throw new Error("Aucune donnée à exporter")
    }

    // Créer les en-têtes
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            // Échapper les guillemets et entourer les valeurs avec des guillemets si nécessaire
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value
          })
          .join(",")
      ),
    ].join("\n")

    // Créer un blob et télécharger
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}_${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export function exportToJSON(data: any[], filename: string) {
  try {
    if (!data || data.length === 0) {
      throw new Error("Aucune donnée à exporter")
    }

    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}_${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export function sendEmailReport(email: string, cabinetName: string, pdfUrl: string) {
  // Simulation d'envoi d'email
  return {
    success: true,
    message: `Rapport de ${cabinetName} envoyé à ${email}`,
  }
}

export function scheduleReportGeneration(cabinetId: number, frequency: "daily" | "weekly" | "monthly") {
  // Simulation de programmation de rapport
  return {
    success: true,
    message: `Rapport programmé pour le cabinet ${cabinetId} - Fréquence: ${frequency}`,
  }
}
