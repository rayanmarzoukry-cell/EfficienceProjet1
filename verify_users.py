#!/usr/bin/env python3
"""Vérifier les utilisateurs dans MongoDB"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv('.env.local')
mongodb_uri = os.getenv('MONGODB_URI')

client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
db = client['rayan_dev2']

print("🔍 Vérification des utilisateurs dans MongoDB\n")
print("="*70)

users = list(db.users.find({}, {"password": 0}))  # Masquer les hash

if not users:
    print("❌ Aucun utilisateur trouvé!")
else:
    print(f"✅ {len(users)} utilisateurs trouvés:\n")
    
    for i, user in enumerate(users, 1):
        print(f"{i}. {user.get('name', 'N/A')}")
        print(f"   📧 Email: {user['email']}")
        print(f"   🔐 Rôle: {user['role'].upper()}")
        print(f"   ✓ Actif: {user.get('isActive', False)}")
        print(f"   📅 Créé: {user.get('createdAt', 'N/A')}")
        print()

print("="*70)
print("\n💾 Base: MongoDB Atlas - Collection 'users'")
print("🔒 Mots de passe: Hachés avec bcrypt (jamais en clair)")
print("✅ Accès Login: http://localhost:3002/login")
print("✅ Accès Admin: http://localhost:3002/admin/users")

client.close()
