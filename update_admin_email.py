#!/usr/bin/env python
"""Update admin email in MongoDB - users collection"""

from pymongo import MongoClient
from datetime import datetime

MONGODB_URI = "mongodb+srv://rayan_dev2:weshwesh123AA--@efficienceprojet.s1rcmkw.mongodb.net/rayan_dev2?retryWrites=true&w=majority&appName=efficienceprojet"
DATABASE_NAME = "rayan_dev2"

print("=" * 60)
print("Efficience - Update Admin Email")
print("=" * 60)
print()

try:
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    db = client[DATABASE_NAME]
    users_collection = db["users"]
    
    client.admin.command('ping')
    print("✓ Connexion MongoDB réussie!")
    print()
    
    # First, let's list all users with admin role
    print("Recherche des comptes administrateurs...")
    admins = list(users_collection.find({"role": {"$in": ["admin", "super-admin"]}}))
    
    if not admins:
        print("✗ Aucun compte administrateur trouvé avec role 'admin' ou 'super-admin'")
        print()
        print("Tous les utilisateurs existants:")
        for user in users_collection.find():
            print(f"  - Email: {user.get('email')}, Role: {user.get('role')}, Nom: {user.get('name')}")
    else:
        print(f"✓ Trouvé {len(admins)} compte(s) administrateur(s):")
        for admin in admins:
            print(f"  - Email: {admin.get('email')}, Rôle: {admin.get('role')}")
        print()
        
        # Update all admin accounts with old email to new email
        old_email = "admin@efficience-dentaire.fr"
        new_email = "adminmrrobert@efficience.fr"
        
        print(f"Mise à jour de {old_email} vers {new_email}...")
        result = users_collection.update_one(
            {"email": old_email},
            {"$set": {"email": new_email, "updatedAt": datetime.now()}}
        )
        
        if result.modified_count > 0:
            print(f"✓ Email mis à jour avec succès!")
            print(f"  Documents modifiés: {result.modified_count}")
        else:
            print(f"✗ Aucun utilisateur trouvé avec l'email: {old_email}")
            print("  Les comptes admin actuels sont probablement avec un autre email.")

except Exception as e:
    print(f"✗ Erreur: {str(e)}")
    import traceback
    traceback.print_exc()

finally:
    if 'client' in locals():
        client.close()
        print()
        print("Connexion MongoDB fermée")
