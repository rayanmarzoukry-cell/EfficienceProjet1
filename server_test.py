from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Autorise tous les ports (3000, 3001, 3002)

@app.route('/api/get-patients', methods=['GET'])
def test_route():
    return jsonify({
        "success": True, 
        "patients": [
            {"id": "1", "name": "TEST CONNEXION", "phone": "0000", "dateRDV": "2025-01-01", "type": "TEST"}
        ]
    })

if __name__ == "__main__":
    print("SERVEUR DE TEST DEMARRE SUR LE PORT 5001")
    app.run(debug=True, port=5001)