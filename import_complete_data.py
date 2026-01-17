#!/usr/bin/env python3
"""Importer les cabinets dentaires avec tous les champs requis"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime

load_dotenv('.env.local')
mongodb_uri = os.getenv('MONGODB_URI')

client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
db = client['rayan_dev2']

# Données des cabinets avec tous les champs
cabinets_data = [
    {
        "id": "JC",
        "nom": "Cabinet JC Dentaire",
        "praticien": "JC",
        "caActuel": 45000,
        "caObjectif": 50000,
        "score": 87,
        "rapportStatut": "sent",
        "emailStatut": "sent",
        "dateCreation": datetime(2024, 1, 1),
        "nbPatients": 82,
        "nbRDV": 90,
        "dureeRDV": 2136,
        "nbNouveauxPatients": 3,
        "montantFacture": 45000,
        "montantEncaisse": 38500,
        "heuresProduction": 5430
    },
    {
        "id": "DV",
        "nom": "Cabinet DV Sourire",
        "praticien": "DV",
        "caActuel": 12000,
        "caObjectif": 15000,
        "score": 78,
        "rapportStatut": "sent",
        "emailStatut": "pending",
        "dateCreation": datetime(2024, 1, 15),
        "nbPatients": 2,
        "nbRDV": 2,
        "dureeRDV": 60,
        "nbNouveauxPatients": 0,
        "montantFacture": 12000,
        "montantEncaisse": 10500,
        "heuresProduction": 7140
    },
    {
        "id": "ER",
        "nom": "Cabinet ER Smile Plus",
        "praticien": "ER",
        "caActuel": 38000,
        "caObjectif": 42000,
        "score": 92,
        "rapportStatut": "sent",
        "emailStatut": "sent",
        "dateCreation": datetime(2024, 2, 1),
        "nbPatients": 65,
        "nbRDV": 75,
        "dureeRDV": 1890,
        "nbNouveauxPatients": 5,
        "montantFacture": 38000,
        "montantEncaisse": 36200,
        "heuresProduction": 6300
    },
    {
        "id": "ML",
        "nom": "Cabinet ML Excellence",
        "praticien": "ML",
        "caActuel": 52000,
        "caObjectif": 55000,
        "score": 95,
        "rapportStatut": "pending",
        "emailStatut": "sent",
        "dateCreation": datetime(2024, 2, 15),
        "nbPatients": 92,
        "nbRDV": 108,
        "dureeRDV": 2520,
        "nbNouveauxPatients": 8,
        "montantFacture": 52000,
        "montantEncaisse": 50800,
        "heuresProduction": 5900
    },
    {
        "id": "SN",
        "nom": "Cabinet SN Dentiste",
        "praticien": "SN",
        "caActuel": 28000,
        "caObjectif": 35000,
        "score": 72,
        "rapportStatut": "not_sent",
        "emailStatut": "failed",
        "dateCreation": datetime(2024, 3, 1),
        "nbPatients": 45,
        "nbRDV": 52,
        "dureeRDV": 1430,
        "nbNouveauxPatients": 2,
        "montantFacture": 28000,
        "montantEncaisse": 24500,
        "heuresProduction": 4800
    }
]

# Données des rapports
rapports_data = [
    {
        "cabinetId": "JC",
        "mois": 202601,
        "titre": "Rapport Mensuel Cabinet JC",
        "contenu": "Analyse complète du cabinet JC pour janvier 2026",
        "dateGeneration": datetime.now(),
        "statut": "sent",
        "emailEnvoyeA": "jc@cabinet.fr"
    },
    {
        "cabinetId": "DV",
        "mois": 202601,
        "titre": "Rapport Mensuel Cabinet DV",
        "contenu": "Analyse complète du cabinet DV pour janvier 2026",
        "dateGeneration": datetime.now(),
        "statut": "sent",
        "emailEnvoyeA": "dv@cabinet.fr"
    },
    {
        "cabinetId": "ER",
        "mois": 202601,
        "titre": "Rapport Mensuel Cabinet ER",
        "contenu": "Analyse complète du cabinet ER pour janvier 2026",
        "dateGeneration": datetime.now(),
        "statut": "sent",
        "emailEnvoyeA": "er@cabinet.fr"
    }
]

# Données des emails
emails_data = [
    {
        "cabinetId": "JC",
        "type": "rapport_mensuel",
        "destinataire": "jc@cabinet.fr",
        "sujet": "Votre rapport d'analyse - Janvier 2026",
        "statut": "sent",
        "dateEnvoi": datetime.now(),
        "dateOuverture": datetime.now()
    },
    {
        "cabinetId": "DV",
        "type": "rapport_mensuel",
        "destinataire": "dv@cabinet.fr",
        "sujet": "Votre rapport d'analyse - Janvier 2026",
        "statut": "sent",
        "dateEnvoi": datetime.now(),
        "dateOuverture": None
    },
    {
        "cabinetId": "ER",
        "type": "rapport_mensuel",
        "destinataire": "er@cabinet.fr",
        "sujet": "Votre rapport d'analyse - Janvier 2026",
        "statut": "sent",
        "dateEnvoi": datetime.now(),
        "dateOuverture": datetime.now()
    },
    {
        "cabinetId": "ML",
        "type": "rapport_mensuel",
        "destinataire": "ml@cabinet.fr",
        "sujet": "Votre rapport d'analyse - Janvier 2026",
        "statut": "sent",
        "dateEnvoi": datetime.now(),
        "dateOuverture": datetime.now()
    },
    {
        "cabinetId": "JC",
        "type": "alerte_performance",
        "destinataire": "jc@cabinet.fr",
        "sujet": "Alerte: CA en dessous de l'objectif",
        "statut": "sent",
        "dateEnvoi": datetime.now(),
        "dateOuverture": None
    }
]

try:
    print("🚀 Importation des données complètes du cabinet...\n")
    
    # Vider les collections
    db.cabinets.delete_many({})
    db.rapports.delete_many({})
    db.emails.delete_many({})
    
    # Insérer les cabinets
    print("1️⃣  Cabinets dentaires...")
    result_cabinets = db.cabinets.insert_many(cabinets_data)
    print(f"   ✅ {len(result_cabinets.inserted_ids)} cabinets insérés")
    
    # Insérer les rapports
    print("2️⃣  Rapports générés...")
    result_rapports = db.rapports.insert_many(rapports_data)
    print(f"   ✅ {len(result_rapports.inserted_ids)} rapports insérés")
    
    # Insérer les emails
    print("3️⃣  Emails envoyés...")
    result_emails = db.emails.insert_many(emails_data)
    print(f"   ✅ {len(result_emails.inserted_ids)} emails insérés")
    
    print("\n" + "="*50)
    print("✅ DONNÉES COMPLÈTES IMPORTÉES!")
    print("="*50)
    print("\n📊 Résumé:")
    print(f"  - Cabinets: {db.cabinets.count_documents({})}")
    print(f"  - Rapports: {db.rapports.count_documents({})}")
    print(f"  - Emails: {db.emails.count_documents({})}")
    
    # Statistiques
    cabinets = list(db.cabinets.find())
    ca_total = sum(c['caActuel'] for c in cabinets)
    ca_objectif = sum(c['caObjectif'] for c in cabinets)
    
    print(f"\n💰 CA Global: {ca_total}€ / {ca_objectif}€ ({int(ca_total/ca_objectif*100)}%)")
    print(f"📧 Rapports envoyés: {db.rapports.count_documents({'statut': 'sent'})}/{len(rapports_data)}")
    print(f"📨 Emails envoyés: {db.emails.count_documents({'statut': 'sent'})}/{len(emails_data)}")
    
    client.close()
    
except Exception as e:
    print(f"❌ ERREUR: {str(e)}")
    exit(1)
