# ✅ CHECKLIST FINALE: Installation N8N + Efficience

Utilisez cette checklist pour vérifier que tout est bien configuré.

---

## 🟢 PHASE 1: Configuration (15 min)

### 1.1 Fichiers Créés
- [ ] `/api/admin/webhook-n8n/route.ts` - Webhook handler
- [ ] `/api/admin/trigger-sync/route.ts` - Trigger sync
- [ ] `/api/admin/recent-imports/route.ts` - Get recent imports
- [ ] `components/admin/n8n-sync-button.tsx` - Sync button
- [ ] `components/admin/realtime-updates.tsx` - Real-time display

### 1.2 Fichiers Modifiés
- [ ] `app/admin/page.tsx` - Import N8nSyncButton
- [ ] `app/dashboard/page.tsx` - Import RealtimeDataUpdates
- [ ] `.env.local` - Ajouter 3 variables N8N

### 1.3 Variables d'Environnement
```
.env.local checklist:
- [ ] N8N_WEBHOOK_TOKEN = "your-token"
- [ ] N8N_TRIGGER_WEBHOOK_URL = "http://localhost:5678/webhook/..."
- [ ] N8N_CALLBACK_WEBHOOK_URL = "http://localhost:3000/api/admin/webhook-n8n"
```

### 1.4 Documentation Créée
- [ ] N8N_RESUME_FINAL.md
- [ ] N8N_SETUP_EFFICIENCE_COMPLETE.md
- [ ] N8N_EFFICIENCE_GUIDE_UTILISATION.md
- [ ] N8N_TEST_COMPLET.md
- [ ] N8N_INDEX.md
- [ ] N8N_QUICK_START.md
- [ ] N8N_DIAGRAMS.md
- [ ] N8N_SETUP_CHECKLIST.md (ce fichier)

---

## 🟢 PHASE 2: Installation (20 min)

### 2.1 N8N Installation
- [ ] Docker installé (`docker --version`)
- [ ] N8N lancé avec: `docker run -it --rm -p 5678:5678 -v $env:USERPROFILE\.n8n:/home/node/.n8n n8nio/n8n`
- [ ] Accessible à: http://localhost:5678
- [ ] Voir le welcome screen "Welcome to n8n!"

### 2.2 Efficience Installation
- [ ] npm packages à jour: `npm install`
- [ ] Dev server lancé: `npm run dev`
- [ ] Accessible à: http://localhost:3000
- [ ] Pas d'erreurs dans le terminal

### 2.3 MongoDB Vérification
- [ ] MONGODB_URI correcte dans `.env.local`
- [ ] Connection string valide (test connection en Compass)
- [ ] Base de données `rayan_dev2` existe
- [ ] Collections visibles

---

## 🟢 PHASE 3: Configuration N8N (20 min)

### 3.1 Créer Workflow
- [ ] Aller à http://localhost:5678
- [ ] Cliquer "New Workflow"
- [ ] Nommer: `Efficience_Data_Import`
- [ ] Cliquer "Create"

### 3.2 Node 1: Webhook Trigger
- [ ] Ajouter Node → Webhook
- [ ] Method: POST
- [ ] Path: `/efficience-sync`
- [ ] Response: `{ "status": "processing" }`
- [ ] Copier l'URL générée

### 3.3 Node 2: Code Validation
- [ ] Ajouter Node → Code
- [ ] Coller le code de validation (voir guide)
- [ ] Output: validCount, validData

### 3.4 Node 3: IF Condition
- [ ] Ajouter Node → IF
- [ ] Condition: `validCount > 0`
- [ ] True → Continue
- [ ] False → End (ou error email)

### 3.5 Node 4: HTTP Request
- [ ] Ajouter Node → HTTP Request
- [ ] Method: POST
- [ ] URL: `http://localhost:3000/api/admin/webhook-n8n`
- [ ] Headers: 
  - [ ] Content-Type: application/json
  - [ ] Authorization: Bearer YOUR_TOKEN
- [ ] Body (JSON):
  ```json
  {
    "type": "{{ $json.type }}",
    "cabinetId": "cab_efficience",
    "data": "{{ $json.data }}"
  }
  ```

### 3.6 Optionnel: Node 5 Email
- [ ] Ajouter Node → Email (optionnel)
- [ ] Success notification
- [ ] Configuré avec SMTP

### 3.7 Activer Workflow
- [ ] Cliquer "Activate" (top right)
- [ ] Status: "Workflow activated"
- [ ] Voir le toggle bleu

---

## 🟢 PHASE 4: Tests Unitaires (15 min)

### 4.1 Test N8N Webhook
- [ ] Accéder à http://localhost:5678
- [ ] Voir l'URL du webhook: `/webhook/efficience-sync`
- [ ] Copier et nouer dans `.env.local`

### 4.2 Test API Efficience
- [ ] Terminal: `npm run dev`
- [ ] Voir: "ready - started server on 0.0.0.0:3000"
- [ ] Accéder à http://localhost:3000 → Page chargée

### 4.3 Test Webhook Handler
```powershell
# Tester l'API directement avec cURL
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer your-token"
}
$body = '{"type":"patients","cabinetId":"cab_test","data":[{"nom":"Test","prenom":"User","email":"test@test.com"}]}'
Invoke-WebRequest -Uri "http://localhost:3000/api/admin/webhook-n8n" -Method POST -Headers $headers -Body $body
```

- [ ] Réponse: `{ "success": true, "message": "..." }`

### 4.4 Test MongoDB Insert
```javascript
// Dans MongoDB Compass
db.patients.findOne({})
```

- [ ] Voir un enregistrement "Test User"

---

## 🟢 PHASE 5: Tests d'Intégration (20 min)

### 5.1 Interface Admin
- [ ] Aller à http://localhost:3000/admin
- [ ] Chercher section "Synchronisation N8N"
- [ ] Voir le bouton "Synchroniser maintenant"
- [ ] Voir la zone d'information

### 5.2 Cliquer le Bouton
- [ ] Cliquer "Synchroniser maintenant"
- [ ] Bouton devient désactivé (spinner)
- [ ] Message: "Synchronisation en cours..."
- [ ] Après 2-3 sec: "✅ Synchronisation réussie!"

### 5.3 Vérifier les Logs
- [ ] Logs N8N: http://localhost:5678/executions
- [ ] Voir exécution du workflow
- [ ] Pas d'erreur rouge
- [ ] Tous les nœuds verts ✓

### 5.4 Vérifier MongoDB
```javascript
// Collection webhook_logs
db.webhook_logs.findOne({})
```

- [ ] Voir un enregistrement du webhook
- [ ] `success: true`
- [ ] `recordsProcessed: > 0`

### 5.5 Dashboard Refresh
- [ ] Aller à http://localhost:3000/dashboard
- [ ] Voir la section "Mises à jour en temps réel"
- [ ] Après import: liste les données importées
- [ ] Timestamp visible

---

## 🟢 PHASE 6: Tests de Données (25 min)

### 6.1 Test Import Patients
```powershell
# Voir N8N_TEST_COMPLET.md pour le code exact
# Importer 3 patients
# Vérifier: db.patients.count()
```

- [ ] POST réussi (200 OK)
- [ ] 3 enregistrements dans MongoDB
- [ ] Champs corrects (nom, email, etc)

### 6.2 Test Import Finances
```powershell
# Importer 3 périodes de CA
# Vérifier: db.donnees_cabinet.find()
```

- [ ] POST réussi
- [ ] 3 enregistrements
- [ ] Périodes correctes (YYYY-MM)
- [ ] CA > 0

### 6.3 Test Import Production
```powershell
# Importer 2 praticiens
# Vérifier: db.production.find()
```

- [ ] POST réussi
- [ ] 2 enregistrements
- [ ] Praticiens nommés
- [ ] Heures et actes présents

### 6.4 Test Import Rendez-vous
```powershell
# Importer 2 rendez-vous
# Vérifier: db.rendezvous.find()
```

- [ ] POST réussi
- [ ] 2 enregistrements
- [ ] Dates et heures correctes
- [ ] Patients nommés

### 6.5 Vérifier Doublons
```javascript
// MongoDB devrait gérer les doublons
db.patients.countDocuments()
// Ne pas augmenter si même email
```

- [ ] Pas de doublons sur email
- [ ] Count stable

---

## 🟢 PHASE 7: Tests de Performance (10 min)

### 7.1 Time to Complete
- [ ] Click → Confirmation: < 3 secondes
- [ ] Dashboard refresh: < 2 secondes
- [ ] Pas de timeout

### 7.2 Concurrent Requests
```
Ouvrir 2 onglets admin
Cliquer sync sur les 2 en même temps
- [ ] Pas de crash
- [ ] Pas de doublons
- [ ] Les 2 réussissent
```

### 7.3 Données Persistantes
- [ ] Rafraîchir la page (F5)
- [ ] Les données sont toujours là
- [ ] Pas de perte

---

## 🟢 PHASE 8: Tests de Sécurité (10 min)

### 8.1 Token Validation
```powershell
# Tester sans token
Invoke-WebRequest -Uri "http://localhost:3000/api/admin/webhook-n8n" `
    -Method POST -Body '{"type":"patients","data":[]}'
```

- [ ] Réponse: 401 Unauthorized

### 8.2 Token Invalide
```powershell
# Tester avec mauvais token
$headers = @{ "Authorization" = "Bearer wrong-token" }
```

- [ ] Réponse: 401 Unauthorized

### 8.3 Token Valide
```powershell
# Tester avec bon token
```

- [ ] Réponse: 200 OK

### 8.4 Validation des Données
```powershell
# Envoyer données invalides (colonnes manquantes)
```

- [ ] Données rejetées
- [ ] Enregistrement dans webhook_logs avec erreur

---

## 🟢 PHASE 9: Tests d'Erreur (10 min)

### 9.1 MongoDB Down
- [ ] Arrêter MongoDB
- [ ] Cliquer sync
- [ ] Voir erreur appropriée
- [ ] Log dans webhook_logs
- [ ] Relancer MongoDB

### 9.2 N8N Down
- [ ] Arrêter N8N
- [ ] Cliquer sync (trigger-sync seul)
- [ ] Devrait quand même marcher (trigger-sync optionnel)

### 9.3 Données Invalides
- [ ] Email format invalide
- [ ] Nombre négatif
- [ ] Champs vides
- [ ] Tous rejetés correctement

### 9.4 Timeout
- [ ] Tester avec délai réseau simulé
- [ ] Pas de freeze

---

## 🟢 PHASE 10: Documentation (5 min)

### 10.1 Guides Lus
- [ ] N8N_RESUME_FINAL.md - Vue d'ensemble
- [ ] N8N_SETUP_EFFICIENCE_COMPLETE.md - Config
- [ ] N8N_EFFICIENCE_GUIDE_UTILISATION.md - Usage
- [ ] N8N_TEST_COMPLET.md - Tests
- [ ] N8N_DIAGRAMS.md - Architecture

### 10.2 Code Documenté
- [ ] Comments dans webhook-n8n/route.ts
- [ ] Comments dans n8n-sync-button.tsx
- [ ] Explications claires

### 10.3 README Mis à Jour
- [ ] Ajouter section N8N dans README
- [ ] Expliquer comment utiliser
- [ ] Lister les endpoints

---

## 🔴 PROBLÈMES COURANTS À VÉRIFIER

### "Webhook not found"
- [ ] N8N est lancé?
- [ ] Port 5678 libre?
- [ ] Workflow activé?
- [ ] URL correcte?

### "401 Unauthorized"
- [ ] Token dans Headers?
- [ ] Format Bearer correct?
- [ ] Token match N8N_WEBHOOK_TOKEN?

### "MongoDB connection failed"
- [ ] MONGODB_URI correcte?
- [ ] MongoDB Atlas online?
- [ ] VPN si nécessaire?
- [ ] Firewall?

### "Dashboard ne se met pas à jour"
- [ ] Polling toutes les 10 sec?
- [ ] Console F12 pour erreurs?
- [ ] /api/admin/recent-imports répond?
- [ ] Rafraîchir la page (F5)?

### "Les données ne s'insèrent pas"
- [ ] Format JSON correct?
- [ ] Type de données supporté?
- [ ] Colonnes requises présentes?
- [ ] Vérifier webhook_logs pour erreur?

---

## ✅ SUCCÈS CRITERIAS

### Minimum Viable
- [ ] Bouton "Synchroniser" existe et cliquable
- [ ] Clicker → Message succès
- [ ] Données dans MongoDB après
- [ ] Dashboard se rafraîchit

### Complet
- [ ] Tous les tests passent
- [ ] Aucune erreur en console
- [ ] Logging d'audit fonctionne
- [ ] Sécurité implémentée
- [ ] Documentation complète

### Production-Ready
- [ ] Scalabilité testée (5+ imports simultanés)
- [ ] Timeout gérés
- [ ] Erreurs loggées
- [ ] Backups MongoDB configurés
- [ ] Monitoring en place

---

## 📊 Score d'Achèvement

Compter le nombre de ☑️:

- **0-20:** Configuration de base
- **21-50:** Système fonctionnel
- **51-75:** Testé et validé
- **76-100:** Production-ready ✨

---

## 🎯 Prochaines Étapes

Après avoir coché tous les ✅:

1. **Ajouter Dropbox Trigger**
   - [ ] N8N surveille Dropbox automatiquement

2. **Scheduler Quotidien**
   - [ ] Import chaque jour à 22h00

3. **Slack Notifications**
   - [ ] Messages sur #efficience-imports

4. **Power BI Integration**
   - [ ] Rapports refreshés après import

5. **Monitoring**
   - [ ] Alertes en cas d'erreur
   - [ ] Dashboard des imports

---

## 📝 Notes Personnelles

```
Date de complétion: _______________

Temps total: _______________

Problèmes rencontrés:
_________________________________
_________________________________

Solutions trouvées:
_________________________________
_________________________________

Améliorations futures:
_________________________________
_________________________________
```

---

**Félicitations! Votre système N8N est certifié ✅**
