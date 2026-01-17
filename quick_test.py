#!/usr/bin/env python3
"""Test rapide: Vérifier connexion MongoDB depuis .env.local"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Charger .env.local
load_dotenv('.env.local')

mongodb_uri = os.getenv('MONGODB_URI')

print("📋 Test de connexion MongoDB\n")
print(f"URI chargée depuis .env.local:\n{mongodb_uri}\n")

if not mongodb_uri or "xxxx" in mongodb_uri:
    print("❌ ERREUR: URI invalide ou contient 'xxxx'")
    exit(1)

try:
    print("🔄 Connexion en cours...")
    client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("✅ SUCCÈS: Connecté à MongoDB!\n")
    
    db = client['rayan_dev2']
    patients = db.patients.count_documents({})
    print(f"📊 Patients dans la BD: {patients}")
    
    client.close()
except Exception as e:
    print(f"❌ ERREUR: {str(e)}")
    exit(1)
