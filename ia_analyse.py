import json
import os
import re

# 1. Configuration des chemins
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'public', 'data')

def extraire_montant(texte):
    """Petite fonction pour trouver les nombres dans vos fichiers texte"""
    chiffres = re.findall(r"[-+]?\d*\.\d+|\d+", texte)
    return sum([float(n) for n in chiffres]) if chiffres else 0.0

def charger_donnees(nom_fichier):
    path = os.path.join(DATA_DIR, nom_fichier)
    if not os.path.exists(path):
        print(f"Fichier manquant: {nom_fichier}")
        return ""
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def analyser_ia():
    print("Analyse des fichiers en cours...")

    # 2. Lecture réelle de vos fichiers copiés
    txt_realisation = charger_donnees('analyse-realisation.txt')
    txt_devis = charger_donnees('analyse-devis.txt')
    
    # On calcule des totaux simples pour l'exemple
    total_realise = extraire_montant(txt_realisation)
    total_devis = extraire_montant(txt_devis)

    # 3. Préparation des résultats pour le Dashboard React
    resultats = [
        {
            "id": "dr-er",
            "nom": "Docteur ER",
            "ca_actuel": round(total_realise, 2),
            "taux_conv": 65.0, # Vous pourrez affiner ce calcul plus tard
            "potentiel": round(total_realise + total_devis, 2),
            "agenda": 12,
            "prediction_ca": round(total_realise * 1.2, 2),
            "conseil": "Bonne progression. Continuez à transformer vos devis."
        }
    ]

    # 4. Sauvegarde dans le JSON que lit votre site
    output_path = os.path.join(DATA_DIR, 'ia_results.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(resultats, f, indent=4, ensure_ascii=False)

    print(f"SUCCES : ia_results.json mis à jour dans {DATA_DIR}")

if __name__ == "__main__":
    analyser_ia()