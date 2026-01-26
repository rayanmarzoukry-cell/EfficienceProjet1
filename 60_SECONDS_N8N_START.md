# ⚡ 60 SECOND START - N8N + Efficience

**Start here if you want to see it working NOW**

---

## 📋 Prerequisites (1 min setup before)

```bash
# 1. Docker installed? 
docker --version

# 2. Node running?
npm run dev

# 3. MongoDB accessible?
# Check MONGODB_URI in .env.local
```

---

## 🚀 GO! (60 seconds)

### Step 1: Add to .env.local (10 seconds)

```env
N8N_WEBHOOK_TOKEN=test-token-123
N8N_TRIGGER_WEBHOOK_URL=http://localhost:5678/webhook/efficience-sync
N8N_CALLBACK_WEBHOOK_URL=http://localhost:3000/api/admin/webhook-n8n
```

**Save (Ctrl+S)**

### Step 2: Start N8N (10 seconds)

**New Terminal:**
```powershell
docker run -it --rm -p 5678:5678 -v $env:USERPROFILE\.n8n:/home/node/.n8n n8nio/n8n
```

**Wait for:** "Ready to take off! 🚀"

### Step 3: Test Button (20 seconds)

Go to: http://localhost:3000/admin

Click: "Synchroniser maintenant"

See: ✅ "Synchronisation réussie!"

### Step 4: Verify Data (10 seconds)

Open MongoDB Compass:
```javascript
db.webhook_logs.findOne({})
```

See: Success entry with timestamp

### Step 5: Check Dashboard (10 seconds)

Go to: http://localhost:3000/dashboard

See: "Mises à jour en temps réel" section

---

## ✅ Done! 

You have a working automated system in **60 seconds** ✨

---

## 🎯 Next?

Want more details?
- See [N8N_QUICK_START.md](N8N_QUICK_START.md) for step 3
- See [N8N_TEST_COMPLET.md](N8N_TEST_COMPLET.md) for tests
- See [N8N_SETUP_CHECKLIST.md](N8N_SETUP_CHECKLIST.md) for verification

---

## 🐛 Trouble?

| Issue | Fix |
|-------|-----|
| "Connection refused" | Start N8N in new terminal |
| "401 Unauthorized" | Check token in .env.local |
| No data | Refresh dashboard (F5) |
| N8N not responding | docker ps + check port 5678 |

---

**That's it! You're done! 🚀**
