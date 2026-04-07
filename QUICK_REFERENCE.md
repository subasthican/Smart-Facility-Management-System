cd "/Users/subasthican/Desktop/Smart Facility Management System"
bash system_status.sh# ⚡ QUICK REFERENCE CARD

## 🚀 START EVERYTHING (Copy & Paste)

### Terminal 1 - Backend
```bash
killall java node 2>/dev/null
sleep 2
cd "/Users/subasthican/Desktop/Smart Facility Management System/backend"
mvn spring-boot:run
```

### Terminal 2 - Frontend
```bash
cd "/Users/subasthican/Desktop/Smart Facility Management System/frontend"
npm start
```

### Terminal 3 - Verify
```bash
cd "/Users/subasthican/Desktop/Smart Facility Management System"
bash system_status.sh
```

Then open: **http://localhost:3000**

---

## 🔐 Enable OAuth (Optional)

Add BEFORE starting backend in Terminal 1:

```bash
export GOOGLE_CLIENT_ID='772097616315-fhfc9vobh1a63abpmh3es1adoavpc51j.apps.googleusercontent.com'
export GOOGLE_CLIENT_SECRET='your-secret-here'
```

---

## 🧪 Test Everything

Run this after starting:
```bash
node /tmp/final_test.js
```

Shows all ✅ if working.

---

## 🎮 Default Login

```
Email:    admin@gmail.com
Password: admin123
Role:     ADMIN
```

Or register as new user.

---

## 🆘 Problems?

### Backend won't start
```bash
killall java
lsof -ti:8080 | xargs kill -9
# Then restart
```

### Frontend won't start
```bash
killall node
lsof -ti:3000 | xargs kill -9
npm install --legacy-peer-deps  # If needed
npm start
```

### Database issues
```bash
brew services start postgresql@15
psql -U subasthican -d smart_facility -c "SELECT 1;"
```

### Check Status Anytime
```bash
bash system_status.sh
```

---

## 📚 Important Files

| File | Purpose |
|------|---------|
| `backend/src/main/resources/application.properties` | Backend config |
| `frontend/src/App.js` | Frontend app |
| `SETUP_TROUBLESHOOTING.md` | Full guide |
| `ANSWERS_TO_YOUR_QUESTIONS.md` | Your Q&A |
| `system_status.sh` | Check system |

---

## ✅ WHAT'S IMPLEMENTED

| Member | Module | Status |
|--------|--------|--------|
| 1 | Authentication | ✅ |
| 1 | JWT Tokens | ✅ |
| 1 | Bookings | ✅ |
| 2 | Facilities | ✅ |
| 2 | Assets | ✅ |
| 3 | Incident Tickets | ✅ |
| 3 | Notifications | ✅ |

---

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api
- **Database:** PostgreSQL on port 5432

---

All Set! 🎉
