#!/usr/bin/env python3
"""Seed des données patients dans MongoDB"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime, timedelta

load_dotenv('.env.local')
mongodb_uri = os.getenv('MONGODB_URI')

client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
db = client['rayan_dev2']

# Données de test
patients_data = [
    {
        "name": "Jean Dupont",
        "dateRDV": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
        "time": "09:30",
        "type": "Détartrage",
        "status": "Confirmé"
    },
    {
        "name": "Marie Martin",
        "dateRDV": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
        "time": "14:00",
        "type": "Détartrage",
        "status": "En attente"
    },
    {
        "name": "Pierre Bernard",
        "dateRDV": (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d"),
        "time": "10:15",
        "type": "Détartrage",
        "status": "Confirmé"
    },
    {
        "name": "Sophie Lefevre",
        "dateRDV": (datetime.now() + timedelta(days=4)).strftime("%Y-%m-%d"),
        "time": "15:30",
        "type": "Détartrage",
        "status": "Confirmé"
    },
    {
        "name": "Luc Moreau",
        "dateRDV": (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d"),
        "time": "11:00",
        "type": "Détartrage",
        "status": "Annulé"
    }
]

try:
    print("🚀 Insertion de patients dans MongoDB...\n")
    
    # Vider la collection si elle existe
    db.patients.delete_many({})
    
    # Insérer les patients
    result = db.patients.insert_many(patients_data)
    
    print(f"✅ {len(result.inserted_ids)} patients ajoutés avec succès!\n")
    
    # Afficher les patients insérés
    print("👥 Patients dans la BD:\n")
    for patient in db.patients.find():
        print(f"  - {patient['name']} | {patient['dateRDV']} {patient['time']} | {patient['type']} | {patient['status']}")
    
    client.close()
    
except Exception as e:
    print(f"❌ ERREUR: {str(e)}")
    exit(1)
