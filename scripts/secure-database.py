#!/usr/bin/env python3
"""
Script de sécurisation de la base de données MongoDB
Hache tous les mots de passe en clair avec bcryptjs
À exécuter une seule fois après l'initialisation de la base
"""

from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from flask import Flask

# Configuration Flask pour Bcrypt
app = Flask(__name__)
app.config['BCRYPT_LOG_ROUNDS'] = 10
bcrypt = Bcrypt(app)

# =========================================
# CONFIGURATION - À ADAPTER SELON VOS BESOINS
# =========================================
MONGODB_URI = 'mongodb+srv://rayan_admin:Efficience2026@efficienceprojet.s1rcmkw.mongodb.net'
DATABASE_NAME = 'efficience-db'

print('\n' + '='*70)
print('🔐 SÉCURISATION DE LA BASE DE DONNÉES')
print('='*70 + '\n')

print(f'📊 Base de données: {DATABASE_NAME}')
print(f'🔗 URI MongoDB: {MONGODB_URI}\n')

try:
    # Connexion à MongoDB
    print('🔗 Connexion à MongoDB Atlas...')
    client = MongoClient(MONGODB_URI)
    client.admin.command('ping')  # Vérifier la connexion
    print('✅ Connecté\n')
    
    db = client[DATABASE_NAME]
    users_collection = db['users']
    
    # ===================================
    # SÉCURISER LES MOTS DE PASSE
    # ===================================
    print('🔍 Scan des utilisateurs...')
    utilisateurs = list(users_collection.find())
    
    if not utilisateurs:
        print('⚠️  Aucun utilisateur trouvé!\n')
    else:
        print(f'✅ {len(utilisateurs)} utilisateur(s) trouvé(s)\n')
        
        mots_de_passe_haches = 0
        mots_de_passe_deja_haches = 0
        
        for user in utilisateurs:
            email = user.get('email', 'Inconnu')
            mdp_clair = user.get('password', '')
            
            print(f'📧 Utilisateur: {email}')
            
            # Vérifier si déjà haché (commence par $2b$ ou $2a$ ou $2y$)
            if mdp_clair.startswith('$2'):
                print(f'   ⏭️  Mot de passe déjà hashé\n')
                mots_de_passe_deja_haches += 1
            else:
                try:
                    print(f'   🔐 Hachage du mot de passe...')
                    hash_securise = bcrypt.generate_password_hash(mdp_clair).decode('utf-8')
                    
                    # Mise à jour dans MongoDB
                    users_collection.update_one(
                        {'_id': user['_id']},
                        {'$set': {'password': hash_securise}}
                    )
                    print(f'   ✅ Mot de passe sécurisé!\n')
                    mots_de_passe_haches += 1
                except Exception as e:
                    print(f'   ❌ Erreur: {str(e)}\n')
        
        # ===================================
        # RÉSUMÉ
        # ===================================
        print('='*70)
        print('✅ SÉCURISATION TERMINÉE!')
        print('='*70 + '\n')
        print(f'📊 Résumé:')
        print(f'   ✓ Mots de passe hachés: {mots_de_passe_haches}')
        print(f'   ✓ Mots de passe déjà sécurisés: {mots_de_passe_deja_haches}')
        print(f'   ✓ Total: {len(utilisateurs)}\n')
        print('🎯 La base de données est maintenant sécurisée!\n')
    
    client.close()
    print('🔌 Déconnecté de MongoDB\n')

except Exception as error:
    print(f'\n❌ Erreur de connexion: {str(error)}\n')
    print('📝 Vérifiez:')
    print('   ✓ Votre URI MongoDB est correcte')
    print('   ✓ Votre nom de base de données est correct')
    print('   ✓ Votre connexion Internet est active\n')
