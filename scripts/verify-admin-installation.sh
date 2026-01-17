#!/bin/bash

# Script de vérification de l'implémentation Admin
# Vérifie que tous les fichiers sont présents et configurés correctement

echo "================================"
echo "✓ Vérification Admin Installation"
echo "================================"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (MANQUANT)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ (MANQUANT)"
        return 1
    fi
}

total=0
passed=0

echo "📂 Vérification des fichiers..."
echo ""

# API Routes
echo "API Routes:"
check_file "app/api/admin/login/route.ts" && ((passed++)); ((total++))
check_file "app/api/admin/logout/route.ts" && ((passed++)); ((total++))
check_file "app/api/admin/verify/route.ts" && ((passed++)); ((total++))
check_file "app/api/admin/init/route.ts" && ((passed++)); ((total++))
check_file "app/api/admin/users/route.ts" && ((passed++)); ((total++))
check_file "app/api/admin/users/\[id\]/route.ts" && ((passed++)); ((total++))
check_file "app/api/admin/reset-password/route.ts" && ((passed++)); ((total++))

echo ""
echo "Pages Frontend:"
check_file "app/admin/login/page.tsx" && ((passed++)); ((total++))
check_file "app/admin/dashboard/page.tsx" && ((passed++)); ((total++))

echo ""
echo "Hooks & Libraries:"
check_file "hooks/use-admin-auth.ts" && ((passed++)); ((total++))
check_file "lib/admin-auth.ts" && ((passed++)); ((total++))
check_file "lib/admin-types.ts" && ((passed++)); ((total++))
check_file "lib/db-admin.ts" && ((passed++)); ((total++))

echo ""
echo "Configuration & Middleware:"
check_file "middleware.ts" && ((passed++)); ((total++))
check_file ".env.local.example" && ((passed++)); ((total++))

echo ""
echo "Scripts:"
check_file "scripts/init-admin.ps1" && ((passed++)); ((total++))
check_file "scripts/init-admin.sh" && ((passed++)); ((total++))
check_file "scripts/init-admin.py" && ((passed++)); ((total++))
check_file "scripts/test-admin-auth.ts" && ((passed++)); ((total++))

echo ""
echo "Documentation:"
check_file "ADMIN_QUICK_START.md" && ((passed++)); ((total++))
check_file "ADMIN_AUTH_GUIDE.md" && ((passed++)); ((total++))
check_file "ADMIN_IMPLEMENTATION_COMPLETE.md" && ((passed++)); ((total++))
check_file "ADMIN_FINAL_STATUS.md" && ((passed++)); ((total++))

echo ""
echo "================================"
echo "Résultats: $passed/$total fichiers ✓"
echo "================================"
echo ""

# Vérifier les dépendances npm
echo "📦 Vérification des dépendances npm..."
echo ""

if npm list bcryptjs > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} bcryptjs installée"
else
    echo -e "${RED}✗${NC} bcryptjs NON INSTALLÉE"
fi

if npm list jsonwebtoken > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} jsonwebtoken installée"
else
    echo -e "${RED}✗${NC} jsonwebtoken NON INSTALLÉE"
fi

# Vérifier les variables d'environnement
echo ""
echo "🔐 Vérification des variables d'environnement..."
echo ""

if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local existe"
    
    if grep -q "MONGODB_URI=" .env.local; then
        echo -e "${GREEN}✓${NC} MONGODB_URI configurée"
    else
        echo -e "${YELLOW}⚠${NC} MONGODB_URI non configurée"
    fi
    
    if grep -q "JWT_SECRET=" .env.local; then
        echo -e "${GREEN}✓${NC} JWT_SECRET configurée"
    else
        echo -e "${YELLOW}⚠${NC} JWT_SECRET non configurée"
    fi
else
    echo -e "${YELLOW}⚠${NC} .env.local n'existe pas (utiliser .env.local.example)"
fi

echo ""
echo "🚀 Prochaines étapes:"
echo ""
echo "1. Copier le fichier d'environnement:"
echo "   cp .env.local.example .env.local"
echo ""
echo "2. Remplir les variables:"
echo "   - MONGODB_URI"
echo "   - JWT_SECRET"
echo "   - INIT_SECRET_KEY"
echo ""
echo "3. Démarrer le serveur:"
echo "   npm run dev"
echo ""
echo "4. Créer le premier admin:"
echo "   ./scripts/init-admin.sh"
echo ""
echo "5. Se connecter:"
echo "   http://localhost:3000/admin/login"
echo ""

if [ $passed -eq $total ]; then
    echo -e "${GREEN}✓ Installation vérifiée avec succès!${NC}"
    exit 0
else
    echo -e "${RED}✗ Certains fichiers sont manquants${NC}"
    exit 1
fi
