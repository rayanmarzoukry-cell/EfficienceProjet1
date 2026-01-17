#!/bin/bash

# Script simple pour créer l'admin via l'API

API_URL="http://localhost:3000/api/admin/init"
INIT_SECRET_KEY="your-init-secret-key-change-this"

# Identifiants par défaut
ADMIN_EMAIL="admin@efficience-dentaire.fr"
ADMIN_NAME="Admin Efficience"
ADMIN_PASSWORD="Efficience2026!"

echo ""
echo "=========================================="
echo "🚀 Création de l'administrateur"
echo "=========================================="
echo ""

# Vérifier que le serveur est en cours d'exécution
echo "🔗 Vérification du serveur..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Le serveur n'est pas en cours d'exécution!"
    echo "   Démarrez-le avec: npm run dev"
    exit 1
fi
echo "✅ Serveur accessible\n"

# Créer l'admin
echo "📝 Création de l'administrateur..."
echo "   Email: $ADMIN_EMAIL"
echo "   Nom: $ADMIN_NAME"
echo "   Mot de passe: •••••••••••\n"

RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "x-init-key: $INIT_SECRET_KEY" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"name\": \"$ADMIN_NAME\",
    \"password\": \"$ADMIN_PASSWORD\"
  }")

echo "📨 Réponse du serveur:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Vérifier le succès
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✅ Administrateur créé avec succès!"
    echo ""
    echo "=========================================="
    echo "🎉 Vous pouvez maintenant vous connecter!"
    echo "=========================================="
    echo ""
    echo "📱 Accédez à:"
    echo "   http://localhost:3000/admin/login"
    echo ""
    echo "🔑 Identifiants:"
    echo "   Email: $ADMIN_EMAIL"
    echo "   Mot de passe: $ADMIN_PASSWORD"
    echo ""
else
    echo "❌ Erreur lors de la création de l'administrateur"
    echo ""
    echo "⚠️  Possible raison:"
    echo "   - Un admin existe déjà"
    echo "   - La clé d'initialisation est invalide"
    echo "   - MongoDB n'est pas connecté"
    echo ""
    exit 1
fi
