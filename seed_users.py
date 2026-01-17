#!/usr/bin/env python3
"""Créer l'admin par défaut dans MongoDB"""

import os
import bcrypt
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv('.env.local')
mongodb_uri = os.getenv('MONGODB_URI')

client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
db = client['rayan_dev2']

# Données admin et users de test
users_data = [
    {
        "email": "admin@efficience-dentaire.fr",
        "password": bcrypt.hashpw(b"admin123", bcrypt.gensalt()).decode('utf-8'),
        "name": "Administrateur",
        "role": "admin",
        "isActive": True,
    },
    {
        "email": "praticien@efficience-dentaire.fr",
        "password": bcrypt.hashpw(b"user123", bcrypt.gensalt()).decode('utf-8'),
        "name": "Praticien JC",
        "role": "user",
        "isActive": True,
    },
    {
        "email": "assistant@efficience-dentaire.fr",
        "password": bcrypt.hashpw(b"user123", bcrypt.gensalt()).decode('utf-8'),
        "name": "Assistant Dentaire",
        "role": "user",
        "isActive": True,
    }
]

try:
    print("🚀 Création des utilisateurs par défaut...\n")
    
    # Vider la collection users existante
    db.users.delete_many({})
    
    # Insérer les users
    result = db.users.insert_many(users_data)
    
    print(f"✅ {len(result.inserted_ids)} utilisateurs créés!\n")
    
    print("📊 Utilisateurs créés:")
    print("=" * 60)
    print(f"👤 ADMIN:")
    print(f"   Email: admin@efficience-dentaire.fr")
    print(f"   Mot de passe: admin123")
    print(f"   Accès: TOUT (gestion des users)")
    print("\n👤 USER 1 (Praticien):")
    print(f"   Email: praticien@efficience-dentaire.fr")
    print(f"   Mot de passe: user123")
    print(f"   Accès: Dashboard, Patients, Rapports")
    print("\n👤 USER 2 (Assistant):")
    print(f"   Email: assistant@efficience-dentaire.fr")
    print(f"   Mot de passe: user123")
    print(f"   Accès: Dashboard, Patients, Rapports")
    print("=" * 60)
    
    client.close()
    
except Exception as e:
    print(f"❌ ERREUR: {str(e)}")
    exit(1)
