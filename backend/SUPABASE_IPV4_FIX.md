# 🔧 Supabase IPv4 Compatibility Fix

## Issue
Your Supabase dashboard shows "Not IPv4 compatible" warning. The direct connection won't work on IPv4 networks.

## Solution: Use Session Pooler

1. **In your Supabase Dashboard:**
   - Go to the connection string modal
   - Click **"Pooler settings"** button
   - Or change **Method** dropdown to **"Session pooler"**

2. **The Session Pooler connection string will look like:**
   ```
   postgresql://postgres.[project-ref]:[YOUR_PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
   ```

3. **Update your `.env` file** with the Session Pooler connection string:
   ```env
   DATABASE_URL="postgresql://postgres.[project-ref]:201207dj%40%23MK@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require"
   ```

## Alternative: Check Connection String Format

Make sure your `.env` file has:
- ✅ URL-encoded password (`@` → `%40`, `#` → `%23`)
- ✅ `?sslmode=require` parameter
- ✅ Correct host (might be pooler URL for IPv4)

## Steps to Get Pooler Connection String:

1. In Supabase Dashboard → Connection String modal
2. Change **Method** to **"Session pooler"**
3. Copy the connection string
4. Replace `[YOUR_PASSWORD]` with your URL-encoded password
5. Update `.env` file

