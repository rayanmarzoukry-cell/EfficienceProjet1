#!/usr/bin/env python3
"""Vérifier les collections et documents dans MongoDB"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv('.env.local')
mongodb_uri = os.getenv('MONGODB_URI')

client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
db = client['rayan_dev2']

print("📊 Collections dans la BD 'rayan_dev2':\n")

collections = db.list_collection_names()
if not collections:
    print("  ⚠️  Aucune collection trouvée (BD vide)")
else:
    for col in collections:
        count = db[col].count_documents({})
        print(f"  - {col}: {count} documents")

client.close()
