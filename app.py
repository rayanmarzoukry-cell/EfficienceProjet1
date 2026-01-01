import io
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

app = Flask(__name__)

# Configuration CORS complète
CORS(app, resources={r"/api/*": {
    "origins": "http://localhost:3000",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type"]
}})

# --- 1. DONNÉES DU CABINET ---
cabinet_data = {
    "nom": "Cabinet Dentaire Efficience",
    "adresse": "12 Bis Avenue des Champs-Élysées, Paris",
    "telephone": "01 45 67 89 10",
    "taux_occupation": "10%"
}

# --- 2. BASE DE DONNÉES SIMULÉE (56 PATIENTS AVEC HEURES) ---
patients_db = []
for i in range(1, 57):
    # Répartition mensuelle
    if i <= 20: m = "10"
    elif i <= 45: m = "11"
    else: m = "12"
    
    # Heures pour éviter l'erreur 'localeCompare'
    heure = "09:00" if i % 3 == 0 else "14:30" if i % 2 == 0 else "11:15"
    
    patients_db.append({
        "id": str(i), 
        "name": f"PATIENT {i}",
        "dateRDV": f"2025-{m}-10", 
        "time": heure, # <--- FIX pour localeCompare
        "year_check": "2026" if i <= 27 else "2025",
        "status": "PRESENT" if i % 2 == 0 else "ATTENTE",
        "type": "CONTRÔLE"
    })

# --- ROUTES CONFIGURATION ---
@app.route('/api/cabinet-info', methods=['GET'])
def get_cabinet():
    occ = min(100, (len(patients_db) / 200) * 100)
    cabinet_data["taux_occupation"] = f"{int(occ)}%"
    return jsonify({"success": True, "info": cabinet_data})

@app.route('/api/update-cabinet', methods=['POST'])
def update_cabinet():
    global cabinet_data
    data = request.json
    cabinet_data.update({
        "nom": data.get("nom", cabinet_data["nom"]),
        "adresse": data.get("adresse", cabinet_data["adresse"]),
        "telephone": data.get("telephone", cabinet_data["telephone"])
    })
    return jsonify({"success": True})

# --- ROUTES PATIENTS (CRUD COMPLET) ---

@app.route('/api/get-patients', methods=['GET'])
def get_patients():
    return jsonify({"success": True, "patients": patients_db})

@app.route('/api/add-patient', methods=['POST'])
def add_patient():
    global patients_db
    try:
        new_p = request.json
        new_p["id"] = str(len(patients_db) + 1)
        if not new_p.get("dateRDV"):
            new_p["dateRDV"] = datetime.now().strftime("%Y-%m-%d")
        if not new_p.get("time"):
            new_p["time"] = "09:00" # Heure par défaut
        patients_db.append(new_p)
        return jsonify({"success": True, "patient": new_p}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/update-patient/<id>', methods=['PUT'])
def update_patient(id):
    global patients_db
    try:
        updated_data = request.json
        for patient in patients_db:
            if str(patient.get('id')) == str(id):
                patient.update(updated_data)
                return jsonify({"success": True, "patient": patient}), 200
        return jsonify({"success": False, "message": "Patient non trouvé"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/delete-patient/<id>', methods=['DELETE'])
def delete_patient(id):
    global patients_db
    try:
        patients_db = [p for p in patients_db if str(p.get('id')) != str(id)]
        return jsonify({"success": True, "message": "Supprimé"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# --- ROUTES DASHBOARD ---
@app.route('/api/dashboard-stats', methods=['GET'])
def stats():
    octobre = len([p for p in patients_db if "-10-" in str(p.get('dateRDV'))])
    novembre = len([p for p in patients_db if "-11-" in str(p.get('dateRDV'))])
    decembre = len([p for p in patients_db if "-12-" in str(p.get('dateRDV'))])

    return jsonify({
        "success": True, 
        "stats": {
            "totalPatients": len(patients_db), 
            "chiffreAffaires": len(patients_db) * 60, 
            "rdvToday": 3
        },
        "graphData": [
            {"name": "Oct", "rdv": octobre},
            {"name": "Nov", "rdv": novembre},
            {"name": "Déc", "rdv": decembre}
        ]
    })

# --- IA & PDF ---
@app.route('/api/chat', methods=['POST'])
def chat():
    msg = request.json.get("message", "").lower()
    total = len(patients_db)
    if "ca" in msg or "chiffre" in msg:
        res = f"Le CA actuel est de {total * 60} € pour {total} patients."
    else:
        res = f"Je suis l'IA de {cabinet_data['nom']}. Comment puis-je vous aider ?"
    return jsonify({"response": res})

@app.route('/api/export-chat-pdf', methods=['POST'])
def export_pdf():
    try:
        messages = request.json.get("messages", [])
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        p.setFont("Helvetica-Bold", 14)
        p.drawString(100, 750, f"Rapport d'Activité - {cabinet_data['nom']}")
        p.line(100, 730, 500, 730)
        y = 700
        for m in messages:
            role = "IA: " if m['role'] == "bot" else "USER: "
            p.drawString(100, y, f"{role} {m['content'][:80]}")
            y -= 20
            if y < 50: break
        p.showPage()
        p.save()
        buffer.seek(0)
        return send_file(buffer, as_attachment=True, download_name="Rapport_Cabinet.pdf", mimetype='application/pdf')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)