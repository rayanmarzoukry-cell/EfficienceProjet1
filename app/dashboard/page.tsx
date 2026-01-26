import io
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

app = Flask(__name__)

# Configuration CORS : Autorise Next.js (port 3000) à appeler Flask (port 5001)
CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:3000"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type"]
}})

# --- DONNÉES SIMULÉES ---
patients_db = []
for i in range(1, 57):
    m = "10" if i <= 20 else "11" if i <= 45 else "12"
    heure = "09:00" if i % 3 == 0 else "14:30" if i % 2 == 0 else "11:15"
    patients_db.append({
        "id": str(i), 
        "name": f"PATIENT {i}",
        "dateRDV": f"2025-{m}-10", 
        "time": heure,
        "status": "PRESENT" if i % 2 == 0 else "ATTENTE",
        "type": "CONTRÔLE"
    })

# --- ROUTE : LISTE DES PATIENTS (Correction de la 404) ---
@app.route('/api/get-patients', methods=['GET'])
def get_patients():
    return jsonify({
        "success": True, 
        "patients": patients_db
    }), 200

# --- ROUTE : CHATBOT IA ---
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_query = data.get("message", "").lower()
        total = len(patients_db)
        
        if "ca" in user_query or "chiffre" in user_query:
            res = f"Le chiffre d'affaires est de {total * 60} € pour {total} patients."
        elif "patient" in user_query:
            res = f"Il y a actuellement {total} patients dans la base."
        else:
            res = "Je suis l'assistant Efficience. Comment puis-je vous aider ?"
            
        return jsonify({"response": res})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- ROUTE : EXPORT PDF ---
@app.route('/api/export-chat-pdf', methods=['POST'])
def export_pdf():
    try:
        messages = request.json.get("messages", [])
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        p.drawString(100, 750, "Rapport d'Activité Efficience")
        y = 700
        for m in messages:
            p.drawString(100, y, f"{m['role'].upper()}: {m['content'][:80]}")
            y -= 20
        p.save()
        buffer.seek(0)
        return send_file(buffer, as_attachment=True, download_name="Rapport.pdf", mimetype='application/pdf')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)