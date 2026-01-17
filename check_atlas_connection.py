#!/usr/bin/env python3
"""Afficher les détails de connexion MongoDB Atlas"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv('.env.local')
mongodb_uri = os.getenv('MONGODB_URI')

print("\n" + "="*90)
print("📡 DÉTAILS DE CONNEXION MONGODB")
print("="*90 + "\n")

# Parser l'URI pour l'afficher
if mongodb_uri:
    parts = mongodb_uri.split('@')
    
    print("🔗 URI MONGODB:")
    if len(parts) >= 2:
        cluster_info = parts[1].split('/')[0]
        print(f"   Serveur: {cluster_info}")
        print(f"   Type: 🌐 MongoDB Atlas CLOUD (pas local)")
    
    print(f"\n📍 Localisation: Internet / Cloud Atlas")
    print(f"🔐 Authentification: Oui (utilisateur + mot de passe)")

# Connecter et afficher les stats
try:
    client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    
    print(f"\n✅ Connexion: RÉUSSIE\n")
    
    # Afficher les bases de données
    db_list = client.list_database_names()
    print(f"💾 Bases de données disponibles ({len(db_list)}):")
    for db_name in db_list[:10]:  # Afficher les 10 premières
        print(f"   - {db_name}")
    
    # Afficher les collections dans rayan_dev2
    db = client['rayan_dev2']
    collections = db.list_collection_names()
    
    print(f"\n📂 Collections dans 'rayan_dev2' ({len(collections)}):")
    for col in collections:
        count = db[col].count_documents({})
        print(f"   - {col}: {count} documents")
    
    # Détails des utilisateurs
    print(f"\n👥 DÉTAILS DE LA COLLECTION 'users':")
    users = list(db.users.find({}, {"password": 0}))
    for user in users:
        print(f"   ✓ {user['email']} ({user['role']}) - {user.get('name', 'N/A')}")
    
    client.close()
    
    print("\n" + "="*90)
    print("✅ TOUS LES DONNÉES SONT DANS MONGODB ATLAS CLOUD")
    print("📊 Accessible 24/7 depuis: https://cloud.mongodb.com")
    print("="*90 + "\n")
    
except Exception as e:
    print(f"❌ Erreur connexion: {e}")
