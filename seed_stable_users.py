#!/usr/bin/env python3
"""Créer les utilisateurs admin et user dans MongoDB"""

import os
import bcrypt
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv('.env.local')
mongodb_uri = os.getenv('MONGODB_URI')

client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
db = client['rayan_dev2']

# Vider la collection users
db.users.delete_many({})

# Données stables
users_data = [
    {
        "email": "admin@efficience-dentaire.fr",
        "password": bcrypt.hashpw(b"admin123", bcrypt.gensalt()).decode('utf-8'),
        "name": "Administrateur",
        "role": "admin",
        "isActive": True,
        "createdAt": "2026-01-17"
    },
    {
        "email": "user@efficience-dentaire.fr",
        "password": bcrypt.hashpw(b"user123", bcrypt.gensalt()).decode('utf-8'),
        "name": "Utilisateur Standard",
        "role": "user",
        "isActive": True,
        "createdAt": "2026-01-17"
    }
]

try:
    print("🚀 Création des utilisateurs stables...\n")
    
    result = db.users.insert_many(users_data)
    
    print("✅ Utilisateurs créés dans MongoDB!\n")
    print("="*70)
    print("📝 CREDENTIALS STABLES:\n")
    print("👤 ADMIN (Accès complet):")
    print("   Email: admin@efficience-dentaire.fr")
    print("   Mot de passe: admin123\n")
    print("👤 USER (Accès limité - dashboard, patients, rapports):")
    print("   Email: user@efficience-dentaire.fr")
    print("   Mot de passe: user123")
    print("="*70)
    
    client.close()
    
except Exception as e:
    print(f"❌ ERREUR: {str(e)}")
    exit(1)
