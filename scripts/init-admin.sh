#!/bin/bash
# Script to initialize the first admin user

echo "=========================================="
echo "Efficience - Admin Initialization Script"
echo "=========================================="

# Configuration
API_URL="http://localhost:3000/api/admin/init"
INIT_KEY=${INIT_SECRET_KEY:-"your-init-secret-key-change-this"}

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if MongoDB is accessible
echo -e "\n${YELLOW}Vérification de la connexion MongoDB...${NC}"

# Prompt for admin details
echo -e "\n${YELLOW}Veuillez entrer les détails de l'administrateur:${NC}"
read -p "Email (admin@efficience-dentaire.fr): " ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@efficience-dentaire.fr}

read -p "Nom (Admin Efficience): " ADMIN_NAME
ADMIN_NAME=${ADMIN_NAME:-"Admin Efficience"}

read -sp "Mot de passe (min 8 caractères): " ADMIN_PASSWORD
echo ""

# Validate password
if [ ${#ADMIN_PASSWORD} -lt 8 ]; then
    echo -e "${RED}✗ Le mot de passe doit contenir au moins 8 caractères${NC}"
    exit 1
fi

# Create admin user
echo -e "\n${YELLOW}Création du compte administrateur...${NC}"

RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -H "x-init-key: $INIT_KEY" \
  -d "{
    \"email\": \"$ADMIN_EMAIL\",
    \"name\": \"$ADMIN_NAME\",
    \"password\": \"$ADMIN_PASSWORD\"
  }")

# Check response
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "\n${GREEN}✓ Administrateur créé avec succès!${NC}"
    echo -e "\n${YELLOW}Informations de connexion:${NC}"
    echo "URL: http://localhost:3000/admin/login"
    echo "Email: $ADMIN_EMAIL"
    echo "Mot de passe: (celui que vous avez entré)"
    echo -e "\n${GREEN}Vous pouvez maintenant vous connecter!${NC}"
else
    echo -e "${RED}✗ Erreur lors de la création:${NC}"
    echo "$RESPONSE" | jq '.'
    exit 1
fi
