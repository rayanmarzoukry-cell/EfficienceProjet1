"""
Script Python pour mettre à jour l'email du compte administrateur
De: admin@efficience-dentaire.fr
Vers: adminmrrobert@efficience.fr
"""

from pymongo import MongoClient
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration MongoDB
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://user:password@cluster.mongodb.net/rayan_dev2?retryWrites=true")
DATABASE_NAME = os.getenv("MONGODB_DB", "rayan_dev2")

def update_admin_email():
    """Met à jour l'email du compte administrateur"""
    
    print("=" * 60)
    print("Efficience - Admin Email Update Script")
    print("=" * 60)
    print()
    
    try:
        # Connexion à MongoDB
        print("Connexion à MongoDB...")
        client = MongoClient(MONGODB_URI)
        db = client[DATABASE_NAME]
        admins_collection = db["admins"]
        
        # Vérifier la connexion
        client.admin.command('ping')
        print("✓ Connexion MongoDB réussie!")
        print()
        
        # Rechercher le compte admin existant
        old_email = "admin@efficience-dentaire.fr"
        new_email = "adminmrrobert@efficience.fr"
        
        print(f"Recherche du compte admin avec l'email: {old_email}")
        admin = admins_collection.find_one({"email": old_email})
        
        if not admin:
            print(f"✗ Aucun compte admin trouvé avec l'email: {old_email}")
            print()
            print("Comptes admins existants:")
            for adm in admins_collection.find():
                print(f"  - {adm.get('email')} (Nom: {adm.get('name', 'N/A')})")
            return False
        
        print(f"✓ Compte trouvé!")
        print(f"  Email actuel: {admin.get('email')}")
        print(f"  Nom: {admin.get('name')}")
        print(f"  Rôle: {admin.get('role')}")
        print()
        
        # Demander confirmation
        confirmation = input(f"Êtes-vous sûr de vouloir mettre à jour l'email vers {new_email}? (oui/non): ").strip().lower()
        
        if confirmation not in ["oui", "o", "yes", "y"]:
            print("✗ Opération annulée")
            return False
        
        # Mettre à jour l'email
        print()
        print("Mise à jour en cours...")
        
        result = admins_collection.update_one(
            {"_id": admin["_id"]},
            {
                "$set": {
                    "email": new_email,
                    "updatedAt": __import__('datetime').datetime.now()
                }
            }
        )
        
        if result.modified_count > 0:
            print(f"✓ Email mis à jour avec succès!")
            print()
            print("Nouvelles informations de connexion:")
            print(f"  Email: {new_email}")
            print(f"  Mot de passe: (inchangé)")
            print()
            return True
        else:
            print("✗ Erreur: Le compte n'a pas pu être mis à jour")
            return False
    
    except Exception as e:
        print(f"✗ Erreur: {str(e)}")
        return False
    
    finally:
        if 'client' in locals():
            client.close()
            print("Connexion MongoDB fermée")

if __name__ == "__main__":
    success = update_admin_email()
    exit(0 if success else 1)
