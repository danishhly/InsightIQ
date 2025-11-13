# 🚀 Backend Setup Guide

## Step 1: Create .env File

The `.env` file should be created in the **`backend`** folder (same level as `package.json`).

### Option A: Copy from template (Recommended)
```bash
cd backend
copy prisma.env.example .env
```

### Option B: Create manually
Create a new file named `.env` in the `backend` folder.

---

## Step 2: Set Up PostgreSQL Database

You have **3 options** to get a PostgreSQL database:

### Option 1: Local PostgreSQL Installation (Recommended for Development)

1. **Install PostgreSQL:**
   - Download from: https://www.postgresql.org/download/
   - Or use package manager:
     - Windows: `choco install postgresql` or download installer
     - Mac: `brew install postgresql`
     - Linux: `sudo apt-get install postgresql`

2. **Start PostgreSQL service:**
   - Windows: Check Services app, start "postgresql" service
   - Mac/Linux: `sudo service postgresql start` or `brew services start postgresql`

3. **Create database:**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE insightiq;
   
   # Create user (optional, or use default 'postgres')
   CREATE USER insightiq_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE insightiq TO insightiq_user;
   
   # Exit
   \q
   ```

4. **Get your DATABASE_URL:**
   ```
   postgresql://username:password@localhost:5432/insightiq?schema=public
   ```
   
   **Example:**
   ```
   postgresql://postgres:postgres@localhost:5432/insightiq?schema=public
   ```

### Option 2: Docker (Easy Setup)

1. **Create `docker-compose.yml` in project root:**
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:15
       container_name: insightiq-db
       environment:
         POSTGRES_USER: insightiq
         POSTGRES_PASSWORD: insightiq123
         POSTGRES_DB: insightiq
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

2. **Start database:**
   ```bash
   docker-compose up -d
   ```

3. **DATABASE_URL:**
   ```
   postgresql://insightiq:insightiq123@localhost:5432/insightiq?schema=public
   ```

### Option 3: Cloud Database (Production/Free Tier)

**Free PostgreSQL Services:**
- **Supabase**: https://supabase.com (Free tier available)
- **Neon**: https://neon.tech (Free tier available)
- **Railway**: https://railway.app (Free tier available)
- **Render**: https://render.com (Free tier available)

1. Sign up and create a PostgreSQL database
2. Copy the connection string they provide
3. Use it as your `DATABASE_URL`

---

## Step 3: Configure .env File

Edit the `.env` file in the `backend` folder with your values:

```env
# Database - Replace with your actual database URL
DATABASE_URL="postgresql://username:password@localhost:5432/insightiq?schema=public"

# JWT - Generate random strings (you can use: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=30d

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000

# OpenAI (for AI features - get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=your-openai-api-key-here
```

### DATABASE_URL Format Breakdown:
```
postgresql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]?schema=public
```

**Example values:**
- `USERNAME`: `postgres` (default) or your custom user
- `PASSWORD`: Your PostgreSQL password
- `HOST`: `localhost` (local) or cloud provider host
- `PORT`: `5432` (default PostgreSQL port)
- `DATABASE_NAME`: `insightiq`

---

## Step 4: Test Database Connection

After setting up `.env`, test the connection:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
```

If successful, you'll see:
- ✅ Prisma Client generated
- ✅ Database migrations applied
- ✅ Tables created in your database

---

## 🔍 Troubleshooting

### "Connection refused" error:
- Check if PostgreSQL is running
- Verify port 5432 is not blocked
- Check username/password are correct

### "Database does not exist" error:
- Create the database first: `CREATE DATABASE insightiq;`

### "Authentication failed" error:
- Verify username and password in DATABASE_URL
- Check PostgreSQL user permissions

---

## 📝 Quick Start Commands

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file (copy from template)
copy prisma.env.example .env
# Then edit .env with your DATABASE_URL

# 4. Generate Prisma Client
npm run prisma:generate

# 5. Run migrations (creates tables)
npm run prisma:migrate

# 6. (Optional) Seed database with test users
npm run prisma:seed

# 7. Start development server
npm run start:dev
```

