import io
import os
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from datetime import datetime

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False
    print("⚠️  reportlab non installé. Les exports PDF seront désactivés.")

app = Flask(__name__)

# Configuration CORS pour autoriser Next.js (port 3000 ou 3001)
CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
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

# --- 2. BASE DE DONNÉES SIMULÉE ---
patients_db = []
for i in range(1, 11):
    heure = "09:00" if i % 3 == 0 else "14:30" if i % 2 == 0 else "11:15"
    patients_db.append({
        "id": str(i), 
        "name": f"Patient {i}",
        "dateRDV": "2026-01-15", 
        "time": heure,
        "status": "PRESENT" if i % 2 == 0 else "ATTENTE",
        "type": "CONTRÔLE",
        "email": f"patient{i}@example.com",
        "phone": f"060000000{i}"
    })

# --- ROUTES CABINET ---
@app.route('/api/cabinet-info', methods=['GET'])
def get_cabinet():
    return jsonify({"success": True, "info": cabinet_data})

@app.route('/api/update-cabinet', methods=['POST'])
def update_cabinet():
    global cabinet_data
    data = request.json
    cabinet_data.update(data)
    return jsonify({"success": True})

# --- ROUTES PATIENTS (CRUD) ---
@app.route('/api/get-patients', methods=['GET'])
def get_patients():
    return jsonify({
        "success": True, 
        "patients": patients_db,
        "server_time": datetime.now().strftime("%H:%M:%S")
    })

@app.route('/api/add-patient', methods=['POST'])
def add_patient():
    try:
        new_p = request.json
        new_p["id"] = str(len(patients_db) + 1)
        if not new_p.get("dateRDV"):
            new_p["dateRDV"] = datetime.now().strftime("%Y-%m-%d")
        if not new_p.get("time"):
            new_p["time"] = "09:00"
        patients_db.append(new_p)
        return jsonify({"success": True, "patient": new_p}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/update-patient/<id>', methods=['PUT'])
def update_patient(id):
    try:
        updated_data = request.json
        for patient in patients_db:
            if str(patient.get('id')) == str(id):
                patient.update(updated_data)
                return jsonify({"success": True, "patient": patient})
        return jsonify({"success": False, "message": "Patient non trouvé"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/delete-patient/<id>', methods=['DELETE'])
def delete_patient(id):
    global patients_db
    try:
        patients_db = [p for p in patients_db if str(p.get('id')) != str(id)]
        return jsonify({"success": True, "message": "Supprimé"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# --- ROUTES DASHBOARD & IA ---
@app.route('/api/dashboard-stats', methods=['GET'])
def stats():
    return jsonify({
        "success": True, 
        "stats": {
            "totalPatients": len(patients_db), 
            "chiffreAffaires": len(patients_db) * 60, 
            "rdvToday": 3
        }
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    msg = request.json.get("message", "").lower()
    res = f"Je suis l'IA du cabinet. Le total de patients est de {len(patients_db)}."
    return jsonify({"response": res})

@app.route('/api/export-chat-pdf', methods=['POST'])
def export_pdf():
    try:
        if not REPORTLAB_AVAILABLE:
            return jsonify({"error": "reportlab non installé. Installez-le avec: pip install reportlab"}), 400
        
        messages = request.json.get("messages", [])
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        p.setFont("Helvetica-Bold", 16)
        p.drawString(100, 750, f"Rapport - {cabinet_data['nom']}")
        p.setFont("Helvetica", 12)
        y = 700
        for m in messages:
            text = f"{'IA' if m['role']=='bot' else 'MOI'}: {m['content']}"
            p.drawString(100, y, text[:80])
            y -= 25
        p.save()
        buffer.seek(0)
        return send_file(buffer, as_attachment=True, download_name="rapport.pdf", mimetype='application/pdf')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Port 5001 pour correspondre à votre AppContext.tsx
    app.run(debug=True, port=5001)