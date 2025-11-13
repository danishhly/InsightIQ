# 🚀 How to Run InsightIQ Project

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL database (Supabase or local)

---

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

### Or Install All at Once
```bash
# From project root
npm run install:all
```

---

## Step 2: Configure Environment Variables

### Backend Configuration

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Create `.env` file** (if not exists):
   ```bash
   # Copy from example
   cp prisma.env.example .env
   ```

3. **Edit `.env` file** with your values:
   ```env
   # Database (Supabase connection string)
   DATABASE_URL="postgresql://postgres.ozexsbborsaxpfehaxvc:201207dj%40%23MK@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require"

   # JWT Secrets (generate random strings)
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   JWT_REFRESH_EXPIRES_IN=30d

   # Server
   PORT=3001
   NODE_ENV=development

   # CORS
   FRONTEND_URL=http://localhost:3000

   # OpenAI (optional - for AI features)
   OPENAI_API_KEY=your-openai-api-key-here
   ```

### Frontend Configuration

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Create `.env.local` file:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
   ```

---

## Step 3: Set Up Database

### If using Supabase (Already configured):
Your database is already set up! Just make sure the `DATABASE_URL` in `.env` is correct.

### If using local PostgreSQL:
```bash
# Create database
psql -U postgres
CREATE DATABASE insightiq;
\q

# Update DATABASE_URL in backend/.env
```

### Generate Prisma Client & Run Migrations:
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

---

## Step 4: Start the Servers

### Option 1: Run Both Servers Together (Recommended)

**From project root:**
```bash
npm run dev
```

This will start:
- Backend on `http://localhost:3001`
- Frontend on `http://localhost:3000`

### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## Step 5: Access the Application

1. **Frontend:** Open browser to `http://localhost:3000`
2. **Backend API:** `http://localhost:3001`
3. **Health Check:** `http://localhost:3001/health`

---

## Quick Start Commands

```bash
# 1. Install all dependencies
npm run install:all

# 2. Set up database (backend folder)
cd backend
npm run prisma:generate
npm run prisma:migrate

# 3. Start both servers (from root)
cd ..
npm run dev
```

---

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Verify `.env` file exists and has `DATABASE_URL`
- Check database connection

### Frontend won't start
- Check if port 3000 is available
- Verify `.env.local` exists
- Check if backend is running

### Database connection error
- Verify `DATABASE_URL` is correct
- Check if database is accessible
- For Supabase: Use Transaction Pooler connection string

### Module not found errors
- Run `npm install` in both backend and frontend folders
- Delete `node_modules` and reinstall if needed

---

## Testing the Application

1. **Register a new account:**
   - Go to `http://localhost:3000/register`
   - Create an account

2. **Upload a dataset:**
   - Go to Upload Data page
   - Upload a CSV file

3. **Ask questions:**
   - Go to Insights page
   - Select dataset
   - Ask: "Show me top 5 highest salaries"

4. **Create charts:**
   - Use Charts page
   - Create visualizations

---

## Development Scripts

### Backend
- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

---

## Project Structure

```
insightiq/
├── backend/          # Node.js API (port 3001)
│   ├── src/
│   ├── .env         # Backend environment variables
│   └── package.json
├── frontend/         # Next.js App (port 3000)
│   ├── app/
│   ├── .env.local   # Frontend environment variables
│   └── package.json
└── package.json      # Root workspace
```

---

## Need Help?

- Check `PHASE1_COMPLETE_GUIDE.md` for setup details
- Check `PHASE3_COMPLETE_GUIDE.md` for AI setup
- Check `PHASE4_SUMMARY.md` for frontend details

