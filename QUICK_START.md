# ⚡ Quick Start Guide

## Your Project is Already Running! 🎉

Based on the output, both servers are running:

- ✅ **Backend:** http://localhost:3001
- ✅ **Frontend:** http://localhost:3000
- ✅ **Database:** Connected

---

## 🚀 Access Your Application

### 1. Open Frontend
Open your browser and go to:
```
http://localhost:3000
```

### 2. Register/Login
- Click "Sign up" to create an account
- Or use existing credentials to login

### 3. Upload Data
- Go to "Upload Data" in sidebar
- Upload a CSV or Excel file
- Wait for processing

### 4. Ask Questions
- Go to "Insights" page
- Select your dataset
- Type questions like:
  - "Show me top 5 highest salaries"
  - "What is the average age?"
  - "List all people from New York"

### 5. Create Charts
- Go to "Charts" page
- Create visualizations from your data

---

## 📊 Test the API Directly

### Health Check
```bash
curl http://localhost:3001/health
```

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"name\":\"Test User\"}"
```

---

## 🛠️ Managing Servers

### Stop Servers
Press `Ctrl+C` in the terminal where servers are running

### Restart Servers
From project root:
```bash
npm run dev
```

### Run Separately

**Backend only:**
```bash
cd backend
npm run start:dev
```

**Frontend only:**
```bash
cd frontend
npm run dev
```

---

## ✅ Everything is Ready!

Your InsightIQ application is fully functional:
- ✅ Backend API running
- ✅ Frontend UI running
- ✅ Database connected
- ✅ All features available

**Just open http://localhost:3000 and start using it!** 🎉

