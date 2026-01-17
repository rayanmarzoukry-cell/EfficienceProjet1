"""
Script Python pour initialiser le premier administrateur
Utilise requests pour appeler l'API Next.js
"""

import requests
import json
import sys
import getpass
from typing import Optional

# Configuration
API_URL = "http://localhost:3000/api/admin/init"
INIT_KEY = "your-init-secret-key-change-this"

def init_admin():
    """Initialise le premier administrateur"""
    
    print("=" * 50)
    print("Efficience - Admin Initialization Script")
    print("=" * 50)
    print()
    
    # Demander les détails admin
    print("Veuillez entrer les détails de l'administrateur:")
    
    admin_email = input("Email (admin@efficience-dentaire.fr): ").strip()
    if not admin_email:
        admin_email = "admin@efficience-dentaire.fr"
    
    admin_name = input("Nom (Admin Efficience): ").strip()
    if not admin_name:
        admin_name = "Admin Efficience"
    
    # Valider l'email
    if "@" not in admin_email or "." not in admin_email:
        print("✗ Email invalide")
        sys.exit(1)
    
    # Demander le mot de passe
    admin_password = getpass.getpass("Mot de passe (min 8 caractères): ")
    
    # Valider le mot de passe
    if len(admin_password) < 8:
        print("✗ Le mot de passe doit contenir au moins 8 caractères")
        sys.exit(1)
    
    # Créer l'utilisateur admin
    print()
    print("Création du compte administrateur...")
    
    headers = {
        "Content-Type": "application/json",
        "x-init-key": INIT_KEY
    }
    
    payload = {
        "email": admin_email,
        "name": admin_name,
        "password": admin_password
    }
    
    try:
        response = requests.post(API_URL, json=payload, headers=headers, timeout=10)
        
        if response.status_code in [200, 201]:
            data = response.json()
            if data.get("success"):
                print()
                print("✓ Administrateur créé avec succès!")
                print()
                print("Informations de connexion:")
                print(f"URL: http://localhost:3000/admin/login")
                print(f"Email: {admin_email}")
                print(f"Mot de passe: (celui que vous avez entré)")
                print()
                print("Vous pouvez maintenant vous connecter!")
                return True
        
        print("✗ Erreur lors de la création:")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
        sys.exit(1)
        
    except requests.exceptions.ConnectionError:
        print("✗ Erreur: Impossible de se connecter au serveur")
        print("Assurez-vous que le serveur Next.js est en cours d'exécution sur http://localhost:3000")
        sys.exit(1)
    except Exception as e:
        print(f"✗ Erreur: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    init_admin()
