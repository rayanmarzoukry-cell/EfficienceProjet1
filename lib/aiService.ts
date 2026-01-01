// lib/aiService.ts
import { DonneesCabinet } from './types'; 

export async function askOllamaForAnalysis(data: DonneesCabinet): Promise<string> {
  // AJOUT : Consignes de formatage pour éviter les bavardages de l'IA
  const prompt = `
    Tu es un expert en gestion de cabinet dentaire. 
    Analyse les données suivantes :
    - Chiffre d'Affaires : ${data.chiffreAffaires}€
    - Nouveaux Patients : ${data.nouveauxPatients}
    - Nombre d'Absences : ${data.nombreAbsences}
    - Répartition des soins : ${JSON.stringify(data.traitements)}
    
    Réponds de manière concise en français. 
    Donne un score de performance sur 100.
    Propose 3 recommandations concrètes sous forme de liste.
    IMPORTANT : Ne fais pas d'introduction, réponds directement par l'analyse.
  `;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3", 
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7 // AJOUT : Pour des réponses stables et professionnelles
        }
      })
    });

    if (!response.ok) throw new Error("Ollama n'a pas répondu.");
    
    const result = await response.json();
    
    // AJOUT : .trim() pour enlever les espaces vides au début/fin
    return result.response.trim(); 
  } catch (error) {
    console.error("Erreur IA:", error);
    // Message plus pro pour l'utilisateur
    return "Analyse indisponible : Assurez-vous qu'Ollama (Llama 3) est lancé sur le port 11434.";
  }
}