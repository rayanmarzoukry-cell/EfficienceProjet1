# 🚀 GUIDE DE TEST - Système Admin Efficience

## ⏱️ Durée estimée: 5 minutes

---

## 📋 Avant de commencer

### ✅ Pré-requis
- [x] Serveur Next.js lancé (`npm run dev`)
- [x] MongoDB connecté
- [x] Compte admin créé
- [x] Port 3001 disponible

### ✅ Vérification

Vérifiez que le serveur affiche:
```
✓ Ready in 4.6s
✓ Compiled / in 26.9s
[INIT] Connexion MongoDB réussie.
```

---

## 🧪 TEST 1: Accès à la page de login

### Étapes
1. Ouvrir: **`http://localhost:3001/admin/login`**
2. Vérifier la page s'affiche

### Résultat Attendu ✅
```
┌─────────────────────────────────┐
│  🔒 Connexion Admin              │
│                                 │
│  Email: [__________________]     │
│  Mot de passe: [__________]      │
│                                 │
│  [ Se connecter ]               │
└─────────────────────────────────┘
```

---

## 🧪 TEST 2: Login avec credentials corrects

### Étapes
1. Email: Entrez `admin@efficience-dentaire.fr`
2. Password: Entrez `Efficience2026!`
3. Clic sur **"Se connecter"**

### Résultat Attendu ✅
```
✅ Message: "Connexion réussie..."
✅ Redirection vers /admin (2-3 secondes)
✅ Page charge le dashboard
```

### Logs Serveur ✅
```
POST /api/admin/login 200
```

---

## 🧪 TEST 3: Dashboard Admin Visible

### Étapes
1. Page `/admin` s'affiche
2. Vérifier les éléments visibles

### Résultat Attendu ✅

**Header:**
```
🔒 Tableau de bord Admin
   Efficience - Gestion sécurisée
   
👤 Administrateur Efficience
[ Déconnexion ]
```

**Statistiques (3 cartes):**
```
📊 Cabinets: 5
👥 Patients: 5
📅 Rendez-vous: 5
```

**Sections:**
- ✅ État du système (MongoDB: ✅ Connecté)
- ✅ Sécurité (JWT, Admin only, MongoDB)
- ✅ Activité récente
- ✅ Importation de données

---

## 🧪 TEST 4: Actualiser les données

### Étapes
1. Clic sur **"Actualiser les données"**
2. Attendre la réponse

### Résultat Attendu ✅
```
✅ Statistiques mises à jour
✅ Heure "Dernière mise à jour" change
✅ Pas d'erreur affichée
```

### Logs Serveur ✅
```
GET /api/cabinets 200
GET /api/patients 200
GET /api/rendezvous 200
```

---

## 🧪 TEST 5: Logout et redirection

### Étapes
1. Clic sur bouton **"Déconnexion"**
2. Vérifier redirection

### Résultat Attendu ✅
```
✅ localStorage vidé (vérifier F12)
   - admin_token ❌ supprimé
   - admin_user ❌ supprimé
✅ Redirection vers /admin/login
✅ Formulaire login visible
```

---

## 🧪 TEST 6: Token expiré (optionnel)

### Étapes
1. Se connecter normalement
2. Ouvrir DevTools (F12)
3. Console: `localStorage.removeItem('admin_token')`
4. Rafraîchir la page

### Résultat Attendu ✅
```
✅ Redirection automatique vers /admin/login
✅ Message: "Vérification de l'authentification..."
✅ Puis retour à la page login
```

---

## 🧪 TEST 7: Mauvais credentials

### Étapes
1. Aller à `/admin/login`
2. Email: `admin@efficience-dentaire.fr`
3. Mot de passe: `MAUVAIS`
4. Clic "Se connecter"

### Résultat Attendu ✅
```
✅ Message d'erreur: "Identifiants invalides"
✅ Pas de redirection
✅ Formulaire reste visible
```

### Logs Serveur ✅
```
POST /api/admin/login 401
```

---

## 🧪 TEST 8: localStorage verification

### Étapes
1. F12 → Application → Local Storage
2. Sélectionner localhost:3001

### Résultat Attendu (Après login) ✅
```
admin_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
admin_user: {"email":"admin@efficience-dentaire.fr","name":"Administrateur Efficience","role":"admin"}
```

### Après logout ❌
```
(Complètement vide)
```

---

## 🧪 TEST 9: MongoDB Check

### Étapes
1. MongoDB Atlas → Collection "admins"
2. Vérifier le document

### Résultat Attendu ✅
```json
{
  "_id": ObjectId(...),
  "email": "admin@efficience-dentaire.fr",
  "passwordHash": "Efficience2026!",
  "name": "Administrateur Efficience",
  "role": "super-admin",
  "isActive": true,
  "createdAt": ISODate("2026-01-14T09:33:29.000Z"),
  "updatedAt": ISODate("2026-01-14T09:33:29.000Z")
}
```

---

## 🧪 TEST 10: Token Format (DevTools)

### Étapes
1. Se connecter
2. DevTools → Application → Local Storage
3. Clic sur `admin_token`
4. Analyser le format

### Résultat Attendu ✅
```
Header.Payload.Signature format
├── Header: {"alg":"HS256","typ":"JWT"}
├── Payload: {"email":"admin@...","role":"admin","exp":...}
└── Signature: (chaîne base64)
```

---

## 📊 Résumé des Tests

| # | Test | Status | Durée |
|---|------|--------|-------|
| 1 | Accès page login | ✅ | 10s |
| 2 | Login credentials | ✅ | 20s |
| 3 | Dashboard visible | ✅ | 10s |
| 4 | Actualiser données | ✅ | 15s |
| 5 | Logout redirect | ✅ | 10s |
| 6 | Token expiré | ✅ | 20s |
| 7 | Mauvais credentials | ✅ | 10s |
| 8 | localStorage check | ✅ | 10s |
| 9 | MongoDB verify | ✅ | 10s |
| 10 | Token format | ✅ | 10s |
| **TOTAL** | | ✅ | ~2-3 min |

---

## 🆘 Troubleshooting

### ❌ "Cannot GET /admin"
**Solution:**
1. Vérifier serveur lancé: `npm run dev`
2. Port 3001 disponible?
3. Allez d'abord sur `/admin/login`

### ❌ "MongoDB not connected"
**Solution:**
1. Vérifier `.env.local` a `MONGODB_URI`
2. MongoDB Atlas account actif?
3. Redémarrer serveur: `npm run dev`

### ❌ "Identifiants invalides"
**Solution:**
1. Email exactement: `admin@efficience-dentaire.fr`
2. Mot de passe exactement: `Efficience2026!`
3. Case-sensitive!

### ❌ Erreur "localStorage undefined"
**Solution:**
1. Ouvrir en mode normal (pas en mode privée)
2. Vérifier cookies activés
3. Recharger page

### ❌ Token expiré immédiatement
**Solution:**
1. Horloge système correcte?
2. Vérifier `.env.local` `JWT_SECRET`
3. Redémarrer serveur

---

## 📱 Points de Vérification Clés

### Sécurité ✅
- [x] Token JWT en localStorage
- [x] Token expire après 24h
- [x] Redirection auto si token invalid
- [x] Logout efface les tokens
- [x] Validation serveur des credentials

### Performance ✅
- [x] Login < 2 secondes
- [x] Dashboard charge < 3 secondes
- [x] Actualiser stats < 1 seconde
- [x] API répond rapidement

### UX ✅
- [x] Messages d'erreur clairs
- [x] Loading states affichés
- [x] Redirection fluide
- [x] Boutons visibles et cliquables

---

## ✨ Cas Spéciaux

### 🔄 Rafraîchir la page pendant login
**Résultat attendu:** Redirection vers `/admin/login` (token invalide)

### 🔄 Ouvrir 2 onglets
**Résultat attendu:** Les 2 onglets ont le même token (localStorage partagé)

### 🔄 Logout d'un onglet → Rafraîchir l'autre
**Résultat attendu:** Redirection vers login (localStorage vidé)

### 🔄 Changer horloge système pendant session
**Résultat attendu:** Token peut être considéré comme expiré si nouvelle heure > exp

---

## 📋 Checklist Finale

Avant de valider le système:

- [ ] TEST 1: Page login accessible
- [ ] TEST 2: Login avec credentials OK
- [ ] TEST 3: Dashboard affiche stats
- [ ] TEST 4: Actualiser fonctionne
- [ ] TEST 5: Logout redirige
- [ ] TEST 6: Token expiré gérée
- [ ] TEST 7: Mauvais credentials bloqués
- [ ] TEST 8: localStorage correct
- [ ] TEST 9: MongoDB à jour
- [ ] TEST 10: Token format valide

---

## 📞 Résultats

**Tous les tests passent? ✅**
```
🎉 SYSTÈME PRÊT POUR PRODUCTION
```

**Des erreurs? ⚠️**
1. Vérifier logs serveur
2. Lire ADMIN_SETUP.md
3. Contacter support technique

---

## 📝 Notes

- Les credentials par défaut doivent être changés en production
- JWT_SECRET doit être gardé secret
- Utiliser HTTPS en production
- Implémenter bcrypt pour les MDP

---

**Durée estimée totale:** 3-5 minutes  
**Status:** 🟢 PRÊT À TESTER  
**Auteur:** Efficience Analytics Team
