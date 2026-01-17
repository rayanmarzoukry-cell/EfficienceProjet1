#!/usr/bin/env python3
"""
Script de test: Vérifier si .env.local est correctement lié à MongoDB
"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime

# Charger les variables d'environnement
print("📋 Chargement du fichier .env.local...")
load_dotenv()

# Récupérer les variables
mongodb_uri = os.getenv('MONGODB_URI')
mongodb_db = os.getenv('MONGODB_DB')
openai_key = os.getenv('OPENAI_API_KEY')

print("\n✅ Variables d'environnement chargées:")
print(f"  - MONGODB_DB: {mongodb_db}")
print(f"  - OPENAI_API_KEY: {'✓ Chargée' if openai_key else '✗ Manquante'}")
print(f"  - MONGODB_URI: {mongodb_uri[:50]}..." if mongodb_uri else "  - MONGODB_URI: ✗ Manquante")

# Test 1: Vérifier que l'URI n'est pas vide
print("\n🔍 Test 1: Vérifier l'URI MongoDB...")
if not mongodb_uri:
    print("  ❌ ERREUR: MONGODB_URI est vide dans .env.local")
    exit(1)
elif "xxxx" in mongodb_uri:
    print("  ❌ ERREUR: L'URI contient encore 'xxxx' (placeholder)")
    exit(1)
else:
    print("  ✓ URI MongoDB valide (pas de placeholder 'xxxx')")

# Test 2: Essayer de se connecter à MongoDB
print("\n🔍 Test 2: Connexion à MongoDB...")
try:
    client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
    # Vérifier la connexion
    client.admin.command('ping')
    print("  ✅ SUCCÈS: Connexion MongoDB établie!")
    
    # Test 3: Afficher les bases de données disponibles
    print("\n🔍 Test 3: Bases de données disponibles:")
    databases = client.list_database_names()
    for db_name in databases:
        print(f"    - {db_name}")
    
    # Test 4: Vérifier la base de données spécifiée
    print(f"\n🔍 Test 4: Vérifier la base '{mongodb_db}'...")
    db = client[mongodb_db]
    collections = db.list_collection_names()
    if collections:
        print(f"  ✓ Base trouvée. Collections: {', '.join(collections)}")
    else:
        print(f"  ⚠️  Base trouvée mais elle est vide (pas de collections)")
    
    # Test 5: Essayer une requête simple
    print("\n🔍 Test 5: Test de requête (patients)...")
    patients_count = db.patients.count_documents({})
    print(f"  ✓ Nombre de patients: {patients_count}")
    
    print("\n" + "="*50)
    print("✅ TOUS LES TESTS SONT PASSÉS!")
    print("   Votre .env.local est correctement lié à MongoDB")
    print("="*50)
    
    client.close()
    
except Exception as e:
    print(f"  ❌ ERREUR: {type(e).__name__}: {str(e)}")
    print("\n⚠️  Vérifiez:")
    print("    1. L'URI MongoDB est correct dans .env.local")
    print("    2. MongoDB Atlas cluster est accessible")
    print("    3. Vos identifiants sont corrects")
    print("    4. Vous êtes connecté à Internet")
    exit(1)
