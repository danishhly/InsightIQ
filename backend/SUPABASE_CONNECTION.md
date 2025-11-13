# 🔗 Supabase Connection String Fix

## Issue
Supabase requires SSL connections. The connection string needs SSL parameters.

## Solution

Update your `DATABASE_URL` in `backend/.env` to include SSL:

```env
DATABASE_URL="postgresql://postgres:201207dj%40%23MK@db.ozexsbborsaxpfehaxvc.supabase.co:5432/postgres?sslmode=require&schema=public"
```

**Key changes:**
- Added `?sslmode=require` parameter
- This tells Prisma to use SSL when connecting to Supabase

## Alternative: Get Connection String from Supabase Dashboard

1. Go to your Supabase project dashboard
2. Click on **Settings** → **Database**
3. Scroll to **Connection string**
4. Select **URI** format
5. Copy the connection string (it will already have SSL configured)
6. Paste it into your `.env` file

The Supabase connection string usually looks like:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
```

## Test Connection

After updating, test with:
```bash
npm run prisma:migrate
```

