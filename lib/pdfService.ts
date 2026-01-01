// lib/pdfService.ts
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Génère un rapport PDF à partir d'un élément HTML.
 * @param elementId L'ID de l'élément HTML à capturer.
 * @param fileName Le nom du fichier PDF à télécharger.
 */
export async function generatePdfReport(elementId: string, fileName: string = 'Rapport_Cabinet.pdf') {
  const input = document.getElementById(elementId);

  if (!input) {
    console.error(`L'élément avec l'ID "${elementId}" n'a pas été trouvé.`);
    return;
  }

  try {
    // Capture de l'élément HTML en image
    const canvas = await html2canvas(input, {
      scale: 2, // Augmente la résolution pour une meilleure qualité dans le PDF
      useCORS: true, // Important si vous avez des images externes (ex: Google Maps)
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' pour portrait, 'mm' pour millimètres, 'a4' pour le format
    
    const imgWidth = 210; // Largeur de l'A4 en mm
    const pageHeight = 297; // Hauteur de l'A4 en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Ajout de l'image au PDF, gestion des pages multiples si nécessaire
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName); // Télécharge le PDF
    console.log("Rapport PDF généré avec succès !");

  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
  }
}