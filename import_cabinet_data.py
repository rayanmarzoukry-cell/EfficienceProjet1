#!/usr/bin/env python3
"""Importation des données de cabinet dans MongoDB"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime

load_dotenv('.env.local')
mongodb_uri = os.getenv('MONGODB_URI')

client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
db = client['rayan_dev2']

# --- DONNÉES PATIENTS ---
patients_data = [
    {
        "name": "Jean Dupont",
        "dateRDV": "2026-01-20",
        "time": "09:30",
        "type": "Détartrage",
        "status": "Confirmé",
        "praticien": "JC"
    },
    {
        "name": "Marie Martin",
        "dateRDV": "2026-01-21",
        "time": "14:00",
        "type": "Détartrage",
        "status": "En attente",
        "praticien": "JC"
    },
    {
        "name": "Pierre Bernard",
        "dateRDV": "2026-01-22",
        "time": "10:15",
        "type": "Détartrage",
        "status": "Confirmé",
        "praticien": "DV"
    },
    {
        "name": "Sophie Lefevre",
        "dateRDV": "2026-01-23",
        "time": "15:30",
        "type": "Détartrage",
        "status": "Confirmé",
        "praticien": "JC"
    },
    {
        "name": "Luc Moreau",
        "dateRDV": "2026-01-24",
        "time": "11:00",
        "type": "Détartrage",
        "status": "Annulé",
        "praticien": "JC"
    }
]

# --- DONNÉES RDV PAR PRATICIEN/MOIS ---
rdv_data = [
    {
        "praticien": "JC",
        "mois": "202601",
        "nbRDV": 90,
        "dureeRDV": 2136,
        "nbPatients": 82,
        "nbNouveauxPatients": 3
    },
    {
        "praticien": "DV",
        "mois": "202601",
        "nbRDV": 2,
        "dureeRDV": 60,
        "nbPatients": 2,
        "nbNouveauxPatients": 0
    }
]

# --- DONNÉES FINANCIÈRES PAR PRATICIEN/MOIS ---
finances_data = [
    {
        "praticien": "JC",
        "mois": "202401",
        "nbPatients": 1,
        "montantFacture": 2663.58,
        "montantEncaisse": 0
    },
    {
        "praticien": "JC",
        "mois": "202402",
        "nbPatients": 45,
        "montantFacture": 15420.50,
        "montantEncaisse": 14280.35
    },
    {
        "praticien": "DV",
        "mois": "202601",
        "nbPatients": 2,
        "montantFacture": 520.00,
        "montantEncaisse": 520.00
    }
]

# --- DONNÉES PRODUCTION (HEURES) ---
production_data = [
    {"praticien": "JC", "mois": "202501", "heures": 5940},
    {"praticien": "JC", "mois": "202502", "heures": 5520},
    {"praticien": "JC", "mois": "202503", "heures": 5520},
    {"praticien": "JC", "mois": "202601", "heures": 5430},
    {"praticien": "DV", "mois": "202501", "heures": 0},
    {"praticien": "DV", "mois": "202502", "heures": 3585},
    {"praticien": "DV", "mois": "202503", "heures": 3780},
    {"praticien": "DV", "mois": "202601", "heures": 7140},
]

# --- DONNÉES KPI GLOBALES ---
kpi_global = {
    "_id": "cabinet_summary",
    "dureeRealisee": 251,
    "montantFacture": 143785,
    "rentabiliteHoraire": 573,
    "rentabiliteJoursTravailles": 5615,
    "patientsEnCours": 5615,
    "lastUpdated": datetime.now()
}

try:
    print("🚀 Importation des données dans MongoDB...\n")
    
    # Vider les collections
    db.patients.delete_many({})
    db.rdv_summary.delete_many({})
    db.finances.delete_many({})
    db.production.delete_many({})
    db.kpi.delete_many({})
    
    # Insérer les données
    print("1️⃣  Patients...")
    result_patients = db.patients.insert_many(patients_data)
    print(f"   ✅ {len(result_patients.inserted_ids)} patients insérés")
    
    print("2️⃣  RDV par praticien/mois...")
    result_rdv = db.rdv_summary.insert_many(rdv_data)
    print(f"   ✅ {len(result_rdv.inserted_ids)} entrées RDV insérées")
    
    print("3️⃣  Données financières...")
    result_finances = db.finances.insert_many(finances_data)
    print(f"   ✅ {len(result_finances.inserted_ids)} entrées financières insérées")
    
    print("4️⃣  Production (heures)...")
    result_production = db.production.insert_many(production_data)
    print(f"   ✅ {len(result_production.inserted_ids)} entrées production insérées")
    
    print("5️⃣  KPI globales...")
    result_kpi = db.kpi.insert_one(kpi_global)
    print(f"   ✅ KPI insérées")
    
    print("\n" + "="*50)
    print("✅ IMPORTATION RÉUSSIE!")
    print("="*50)
    print("\n📊 Résumé:")
    print(f"  - Patients: {db.patients.count_documents({})}")
    print(f"  - RDV: {db.rdv_summary.count_documents({})}")
    print(f"  - Finances: {db.finances.count_documents({})}")
    print(f"  - Production: {db.production.count_documents({})}")
    
    client.close()
    
except Exception as e:
    print(f"❌ ERREUR: {str(e)}")
    exit(1)
