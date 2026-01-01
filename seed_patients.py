import json
import os
import random

DATA_DIR = "public/data"
PATIENTS_PATH = os.path.join(DATA_DIR, "patients_list.json")

noms = ["MARTIN", "BERNARD", "THOMAS", "PETIT", "ROBERT", "RICHARD", "DURAND", "DUBOIS", "MOREAU", "LAURENT", "SIMON", "MICHEL", "LEFEBVRE", "LEROY", "ROUX", "DAVID", "BERTRAND", "MOREL", "FOURNIER", "GIRARD", "BONNET", "DUPONT", "LAMBERT", "FONTAINE", "ROUSSEAU"]
prenoms = ["Jean", "Marie", "Pierre", "Anne", "Luc", "Sophie", "Thomas", "Julie", "Nicolas", "Emma"]
soins = ["CONTRÔLE", "DÉTARTRAGE", "CARIE", "IMPLANT", "ORTHODONTIE"]
statuts = ["PRESENT", "PRESENT", "PRESENT", "PRESENT", "ABSENT"] 

def seed_data():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR, exist_ok=True)
    patients_test = []
    for i in range(25):
        nom_complet = f"{random.choice(noms)} {random.choice(prenoms)}"
        patient = {
            "id": f"test-{1000 + i}",
            "name": nom_complet.upper(),
            "email": f"{nom_complet.lower().replace(' ', '.')}@email.com",
            "phone": f"06 {random.randint(10, 99)} {random.randint(10, 99)} {random.randint(10, 99)} {random.randint(10, 99)}",
            "type": random.choice(soins),
            "dateRDV": "2024-11-25",
            "time": f"{random.randint(9, 17)}:00",
            "initial": nom_complet[0],
            "hasID": random.choice([True, False]),
            "docName": "scan_identite.pdf" if random.choice([True, False]) else None,
            "is_new": True, 
            "status": random.choice(statuts)
        }
        patients_test.append(patient)
    with open(PATIENTS_PATH, "w", encoding="utf-8") as f:
        json.dump(patients_test, f, indent=4)
    print(f"Succès : {len(patients_test)} patients injectés dans {PATIENTS_PATH}")

if __name__ == "__main__":
    seed_data()
