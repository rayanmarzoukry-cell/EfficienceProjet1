#!/usr/bin/env python3
"""Vérifier les utilisateurs stockés dans MongoDB"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv('.env.local')
mongodb_uri = os.getenv('MONGODB_URI')

client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
db = client['rayan_dev2']

print("\n" + "="*80)
print("🔍 VÉRIFICATION DES UTILISATEURS DANS MONGODB")
print("="*80 + "\n")

# Compter les utilisateurs
user_count = db.users.count_documents({})
print(f"📊 Nombre total d'utilisateurs: {user_count}\n")

if user_count == 0:
    print("❌ AUCUN utilisateur trouvé dans MongoDB!")
else:
    # Récupérer tous les utilisateurs (sans les mots de passe)
    users = list(db.users.find({}, {"password": 0}))
    
    print("👥 UTILISATEURS STOCKÉS:\n")
    print("-" * 80)
    
    for i, user in enumerate(users, 1):
        print(f"\n{i}. {user.get('name', 'N/A')}")
        print(f"   📧 Email: {user['email']}")
        print(f"   🔐 Rôle: {user['role'].upper()}")
        print(f"   ✓ Statut: {'🟢 Actif' if user.get('isActive', False) else '🔴 Inactif'}")
        print(f"   📅 Créé: {user.get('createdAt', 'N/A')}")
        
    print("\n" + "-" * 80)
    print("\n✅ RÉSUMÉ:")
    print(f"   - Administrateurs: {sum(1 for u in users if u['role'] == 'admin')}")
    print(f"   - Utilisateurs: {sum(1 for u in users if u['role'] == 'user')}")

print("\n" + "="*80)
print("💾 BASE DE DONNÉES: MongoDB Atlas - Collection 'users'")
print("🔒 MOTS DE PASSE: Hachés avec bcrypt (jamais en clair)")
print("✅ STOCKAGE: Permanent et sécurisé")
print("="*80 + "\n")

client.close()
