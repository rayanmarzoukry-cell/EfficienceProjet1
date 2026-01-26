import io
import os
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

# Charger les variables d'environnement (lien MongoDB)
load_dotenv()

# PDF Export - optionnel
try:
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False
    print("⚠️ reportlab non installé. Les exports PDF seront désactivés.")

app = Flask(__name__)

# Configuration CORS pour Next.js (ports 3000, 3001, 3002)
CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3002"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type"]
}})

# --- 1. CONNEXION MONGODB ATLAS ---
# Utilise le lien SRV complet que nous avons construit
MONGO_URI = os.getenv('MONGODB_URI', "mongodb+srv://rayan_dev2:weshwesh123AA--@efficienceprojet.s1rcmkw.mongodb.net/rayan_dev2?retryWrites=true&w=majority&appName=efficienceprojet")

client = MongoClient(MONGO_URI)
db = client['rayan_dev2']

# --- 2. ROUTES CABINET ---
@app.route('/api/cabinet-info', methods=['GET'])
def get_cabinet():
    # On récupère les infos depuis une collection 'cabinet' ou on renvoie du dur
    info = {
        "nom": "Cabinet Dentaire Efficience",
        "adresse": "12 Bis Avenue des Champs-Élysées, Paris",
        "telephone": "01 45 67 89 10",
        "taux_occupation": "10%"
    }
    return jsonify({"success": True, "info": info})

# --- 3. ROUTES PATIENTS (CRUD - MONGODB) ---
@app.route('/api/get-patients', methods=['GET'])
def get_patients():
    try:
        patients_from_db = list(db.patients.find())
        for p in patients_from_db:
            p['id'] = str(p['_id'])
            del p['_id']
        return jsonify({
            "success": True, 
            "patients": patients_from_db,
            "server_time": datetime.now().strftime("%H:%M:%S")
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/add-patient', methods=['POST'])
def add_patient():
    try:
        new_p = request.json
        # Nettoyage de l'ID si envoyé par erreur par le front
        if 'id' in new_p: del new_p['id']
        
        result = db.patients.insert_one(new_p)
        new_p['id'] = str(result.inserted_id)
        return jsonify({"success": True, "patient": new_p}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/delete-patient/<id>', methods=['DELETE'])
def delete_patient(id):
    try:
        db.patients.delete_one({"_id": ObjectId(id)})
        return jsonify({"success": True, "message": "Supprimé"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# --- 4. ROUTES DASHBOARD & STATS ---
@app.route('/api/dashboard-stats', methods=['GET'])
def stats():
    try:
        total_patients = db.patients.count_documents({})
        # Calcul simulé basé sur le nombre de patients
        return jsonify({
            "success": True, 
            "stats": {
                "totalPatients": total_patients, 
                "chiffreAffaires": total_patients * 60, 
                "rdvToday": 3
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# --- 5. EXPORT PDF ---
@app.route('/api/export-chat-pdf', methods=['POST'])
def export_pdf():
    try:
        if not REPORTLAB_AVAILABLE:
            return jsonify({"error": "reportlab non installé"}), 400
        
        messages = request.json.get("messages", [])
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        p.setFont("Helvetica-Bold", 16)
        p.drawString(100, 750, "Rapport d'activité - Efficience")
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
    # On reste sur le port 5001 comme prévu pour ton Frontend
    print("🚀 Serveur Flask lancé sur http://localhost:5001")
    app.run(debug=True, port=5001)