# 📚 Phase 1: Foundation - Complete Step-by-Step Guide

## Overview
Phase 1 focused on building the foundation of the InsightIQ application. We set up the project structure, database, authentication, and file upload capabilities.

---

## Step 1: Project Setup ✅

### What We Did:
Created the basic project structure for a monorepo (multiple packages in one repository).

### Files Created:
1. **Root `package.json`**
   - Configured as a workspace to manage both frontend and backend
   - Added scripts to run frontend/backend together
   - Set up `concurrently` to run both servers at once

2. **`.gitignore`**
   - Excluded `node_modules`, `.env` files, build outputs
   - Protected sensitive files from being committed

3. **`README.md`**
   - Project documentation
   - Setup instructions
   - Project overview

4. **Folder Structure**
   ```
   insightiq/
   ├── frontend/     (for Next.js app - created but not implemented yet)
   ├── backend/      (Node.js API - our main focus)
   ├── shared/       (shared code between frontend/backend)
   └── docs/         (documentation)
   ```

### Why This Matters:
- Organized codebase from the start
- Easy to add more packages later
- Clear separation between frontend and backend

---

## Step 2: Database Schema Design & Prisma Setup ✅

### What We Did:
Designed the database structure and set up Prisma ORM to interact with PostgreSQL.

### 2.1 Database Schema Design

**Created `backend/src/database/prisma/schema.prisma`**

This file defines all our database tables (models):

1. **User Model**
   ```prisma
   model User {
     id            String   @id @default(uuid())
     email         String   @unique
     passwordHash  String
     name          String?
     role          Role     @default(ANALYST)
     createdAt     DateTime @default(now())
     updatedAt     DateTime @updatedAt
     
     datasets      Dataset[]
     charts        Chart[]
     insights      Insight[]
     queries       Query[]
   }
   ```
   - Stores user accounts
   - Has relationships to datasets, charts, insights, queries
   - Role enum: ADMIN, ANALYST, VIEWER

2. **Dataset Model**
   ```prisma
   model Dataset {
     id            String   @id @default(uuid())
     userId        String
     name          String
     fileName      String
     fileType      String   // csv, xlsx
     rowCount      Int
     columnCount   Int
     schema        Json     // Column metadata
     createdAt     DateTime @default(now())
     
     user          User     @relation(...)
     tables        DataTable[]
     charts        Chart[]
   }
   ```
   - Stores uploaded files metadata
   - Links to user who uploaded it
   - Contains schema information (column names, types)

3. **DataTable Model**
   ```prisma
   model DataTable {
     id            String   @id @default(uuid())
     datasetId     String
     tableName     String
     columns       Json     // Column definitions
     data          Json?    // Actual data
     
     dataset       Dataset  @relation(...)
   }
   ```
   - Stores the actual data from uploaded files
   - Linked to a dataset

4. **Chart Model**
   - Stores chart configurations
   - Links to user and dataset

5. **Insight Model**
   - Stores AI-generated insights
   - Links to user and chart

6. **Query Model**
   - Stores user queries (natural language + SQL)
   - Links to user

### 2.2 Prisma Configuration

**Created `backend/package.json`**
- Added Prisma dependencies:
  - `@prisma/client` - Database client
  - `prisma` - CLI tool
- Added scripts:
  - `prisma:generate` - Generate TypeScript types from schema
  - `prisma:migrate` - Create/apply database migrations
  - `prisma:studio` - Visual database browser

**Created `backend/src/database/prisma-client.ts`**
- Singleton pattern for Prisma client
- Prevents multiple database connections
- Reuses connection in development

**Created `backend/src/config/database.config.ts`**
- Database connection utilities
- `connectDatabase()` - Connect to database
- `disconnectDatabase()` - Close connection

### 2.3 Database Connection Setup

**Set up Supabase (PostgreSQL database)**
1. Created Supabase project
2. Got connection string
3. Configured `.env` file with:
   ```
   DATABASE_URL="postgresql://..."
   ```
4. Ran migration: `npm run prisma:migrate`
   - Created all tables in database
   - Generated Prisma Client

### Why This Matters:
- Type-safe database queries (TypeScript knows your data structure)
- Automatic migrations (database changes are versioned)
- Easy to add new tables/fields later

---

## Step 3: Authentication System ✅

### What We Did:
Built a complete JWT-based authentication system so users can register, login, and access protected routes.

### 3.1 Express Server Setup

**Created `backend/src/main.ts`**
```typescript
const app = express();
app.use(cors());           // Allow frontend to call API
app.use(express.json());   // Parse JSON requests
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/data', dataRoutes);
```
- Sets up Express server
- Configures CORS (Cross-Origin Resource Sharing)
- Registers all API routes
- Error handling middleware

### 3.2 Authentication Service

**Created `backend/src/services/auth.service.ts`**

This service handles all authentication logic:

1. **Register Function**
   ```typescript
   async register(data: RegisterDto) {
     // 1. Check if user exists
     // 2. Hash password with bcrypt
     // 3. Create user in database
     // 4. Generate JWT tokens
     // 5. Return user + tokens
   }
   ```
   - Validates email doesn't exist
   - Hashes password (never store plain passwords!)
   - Creates user record
   - Returns access token + refresh token

2. **Login Function**
   ```typescript
   async login(data: LoginDto) {
     // 1. Find user by email
     // 2. Compare password hash
     // 3. Generate JWT tokens
     // 4. Return user + tokens
   }
   ```
   - Finds user in database
   - Verifies password using bcrypt
   - Returns tokens if valid

3. **Token Generation**
   ```typescript
   generateTokens(userId, email) {
     accessToken = jwt.sign({userId, email}, SECRET, {expiresIn: '7d'})
     refreshToken = jwt.sign({userId, email}, REFRESH_SECRET, {expiresIn: '30d'})
   }
   ```
   - Creates JWT tokens
   - Access token: short-lived (7 days)
   - Refresh token: long-lived (30 days)

4. **Refresh Token Function**
   - Validates refresh token
   - Generates new access token
   - Allows users to stay logged in

### 3.3 Authentication Routes

**Created `backend/src/routes/auth.routes.ts`**

1. **POST /api/auth/register**
   - Accepts: `{email, password, name?}`
   - Returns: `{user, accessToken, refreshToken}`
   - Validates input
   - Calls auth service

2. **POST /api/auth/login**
   - Accepts: `{email, password}`
   - Returns: `{user, accessToken, refreshToken}`
   - Validates credentials

3. **POST /api/auth/refresh**
   - Accepts: `{refreshToken}`
   - Returns: `{accessToken}`
   - Gets new access token

### 3.4 Authentication Middleware

**Created `backend/src/middleware/auth.middleware.ts`**

```typescript
export const authenticate = (req, res, next) => {
  // 1. Get token from Authorization header
  // 2. Verify token with JWT
  // 3. Extract user info
  // 4. Attach to request object
  // 5. Call next() to continue
}
```

**How it works:**
- Checks for `Authorization: Bearer <token>` header
- Verifies token is valid
- Extracts user ID and email
- Adds to `req.userId` and `req.userEmail`
- Protects routes that require authentication

### 3.5 User Routes

**Created `backend/src/routes/users.routes.ts`**

**GET /api/users/me**
- Protected route (uses `authenticate` middleware)
- Returns current user's profile
- Uses `req.userId` from middleware

### 3.6 Configuration

**Created `backend/src/config/env.config.ts`**
- Centralized environment variable management
- Validates required variables
- Type-safe config access

### Why This Matters:
- Secure user authentication
- Protected API endpoints
- Token-based (stateless) - works with multiple servers
- Industry-standard JWT implementation

---

## Step 4: File Upload & Parsing ✅

### What We Did:
Built a system to upload CSV/Excel files, parse them, extract schema, and store data in the database.

### 4.1 File Parsers

**Created `backend/src/parsers/csv.parser.ts`**

Uses **PapaParse** library to parse CSV files:

```typescript
async parse(buffer: Buffer) {
  // 1. Convert buffer to string
  // 2. Parse CSV with PapaParse
  // 3. Extract columns from first row
  // 4. Convert to array of arrays
  // 5. Return structured data
}
```

**Features:**
- Handles headers automatically
- Skips empty lines
- Returns: `{columns, rows, rowCount, columnCount}`

**Created `backend/src/parsers/excel.parser.ts`**

Uses **XLSX** library to parse Excel files:

```typescript
async parse(buffer: Buffer) {
  // 1. Read Excel workbook from buffer
  // 2. Get first sheet
  // 3. Convert to JSON
  // 4. Extract columns and rows
  // 5. Return structured data
}
```

**Features:**
- Supports .xlsx and .xls files
- Can read multiple sheets
- Same output format as CSV parser

### 4.2 Upload Middleware

**Created `backend/src/middleware/upload.middleware.ts`**

Uses **Multer** for file uploads:

```typescript
const upload = multer({
  storage: multer.memoryStorage(),  // Store in memory (not disk)
  fileFilter: (req, file, cb) => {
    // Only allow CSV/Excel files
  },
  limits: {
    fileSize: 10 * 1024 * 1024  // 10MB limit
  }
});
```

**How it works:**
- Intercepts file uploads
- Validates file type (CSV/Excel only)
- Stores file in memory (as Buffer)
- Limits file size to 10MB
- Makes file available as `req.file`

### 4.3 Data Service

**Created `backend/src/services/data.service.ts`**

Main service for data operations:

1. **Upload File Function**
   ```typescript
   async uploadFile(data: UploadDataDto) {
     // 1. Parse file (CSV or Excel)
     // 2. Extract schema (column names, types)
     // 3. Create Dataset record
     // 4. Create DataTable record with data
     // 5. Return dataset with tables
   }
   ```

2. **Schema Extraction**
   ```typescript
   extractSchema(parsedData) {
     // For each column:
     // - Check sample values
     // - Infer type (number, date, string)
     // - Return schema array
   }
   ```
   - Analyzes first 100 rows
   - Infers data types automatically
   - Creates schema metadata

3. **Get User Datasets**
   - Lists all datasets for a user
   - Includes table information

4. **Get Dataset Details**
   - Returns dataset with schema
   - Verifies user ownership

5. **Get Table Data (Paginated)**
   ```typescript
   getTableData(datasetId, userId, page, limit) {
     // 1. Get dataset
     // 2. Extract data from DataTable
     // 3. Paginate results
     // 4. Return page of data
   }
   ```
   - Returns data in pages (e.g., 100 rows per page)
   - Prevents loading huge files at once

6. **Delete Dataset**
   - Removes dataset and related tables
   - Verifies user ownership

### 4.4 Data Routes

**Created `backend/src/routes/data.routes.ts`**

1. **POST /api/data/upload**
   - Protected route (requires authentication)
   - Accepts multipart/form-data with `file` field
   - Uses `upload.single('file')` middleware
   - Parses file and stores in database
   - Returns dataset with schema

2. **GET /api/data**
   - Lists all datasets for current user
   - Returns array of datasets

3. **GET /api/data/:id**
   - Gets specific dataset details
   - Includes schema and table info
   - Verifies ownership

4. **GET /api/data/:id/table**
   - Gets table data with pagination
   - Query params: `?page=1&limit=100`
   - Returns data + pagination info

5. **DELETE /api/data/:id**
   - Deletes dataset
   - Verifies ownership
   - Cascade deletes related tables

### 4.5 Data Flow Example

**When user uploads a CSV file:**

1. **Frontend** → POST `/api/data/upload` with file
2. **Multer middleware** → Validates and stores file in memory
3. **Auth middleware** → Verifies user token
4. **Data route** → Calls data service
5. **CSV parser** → Parses file to structured data
6. **Data service** → Extracts schema
7. **Prisma** → Creates Dataset and DataTable records
8. **Response** → Returns dataset with schema

**When user requests table data:**

1. **Frontend** → GET `/api/data/:id/table?page=1`
2. **Auth middleware** → Verifies token
3. **Data service** → Gets dataset from database
4. **Pagination** → Extracts page of data
5. **Response** → Returns data + pagination info

### Why This Matters:
- Users can upload their data files
- Automatic schema detection
- Efficient data storage
- Pagination for large files
- Secure (only owner can access)

---

## Complete File Structure

```
insightiq/
├── backend/
│   ├── src/
│   │   ├── main.ts                    # Express server
│   │   ├── config/
│   │   │   ├── database.config.ts     # DB connection
│   │   │   └── env.config.ts          # Environment vars
│   │   ├── database/
│   │   │   ├── prisma/
│   │   │   │   └── schema.prisma      # Database schema
│   │   │   ├── prisma-client.ts       # Prisma client
│   │   │   └── seed.ts                # Database seeding
│   │   ├── routes/
│   │   │   ├── auth.routes.ts         # Auth endpoints
│   │   │   ├── users.routes.ts        # User endpoints
│   │   │   └── data.routes.ts         # Data endpoints
│   │   ├── services/
│   │   │   ├── auth.service.ts       # Auth logic
│   │   │   └── data.service.ts       # Data logic
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    # JWT verification
│   │   │   └── upload.middleware.ts  # File upload
│   │   └── parsers/
│   │       ├── csv.parser.ts         # CSV parsing
│   │       └── excel.parser.ts       # Excel parsing
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── package.json                       # Root workspace
└── README.md
```

---

## Key Technologies Used

1. **Node.js + Express** - Backend framework
2. **TypeScript** - Type-safe JavaScript
3. **Prisma** - Database ORM
4. **PostgreSQL (Supabase)** - Database
5. **JWT** - Authentication tokens
6. **bcryptjs** - Password hashing
7. **Multer** - File upload handling
8. **PapaParse** - CSV parsing
9. **XLSX** - Excel parsing

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users/me` - Get current user (protected)

### Data
- `POST /api/data/upload` - Upload CSV/Excel (protected)
- `GET /api/data` - List datasets (protected)
- `GET /api/data/:id` - Get dataset (protected)
- `GET /api/data/:id/table` - Get table data (protected)
- `DELETE /api/data/:id` - Delete dataset (protected)

### Health
- `GET /health` - Server health check

---

## Security Features Implemented

1. **Password Hashing** - Passwords never stored in plain text
2. **JWT Tokens** - Secure, stateless authentication
3. **Token Expiration** - Access tokens expire after 7 days
4. **Refresh Tokens** - Long-lived tokens for staying logged in
5. **Route Protection** - Middleware verifies tokens
6. **User Ownership** - Users can only access their own data
7. **File Validation** - Only CSV/Excel files allowed
8. **File Size Limits** - 10MB maximum

---

## What We Achieved

✅ Complete project structure  
✅ Database schema designed and migrated  
✅ User authentication system  
✅ File upload and parsing  
✅ Data storage and retrieval  
✅ API endpoints for all operations  
✅ Security best practices  
✅ Type-safe codebase  
✅ Comprehensive error handling  

---

## Next Steps (Phase 2)

1. **Chart Generation** - Create charts from data
2. **AI Query Endpoint** - Natural language to SQL
3. **SQL Validation** - Secure SQL execution
4. **Data Visualization** - Return chart-ready data

---

## How to Run

```bash
# Install dependencies
cd backend
npm install

# Set up environment
cp prisma.env.example .env
# Edit .env with your DATABASE_URL

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start server
npm run start:dev
```

Server runs on: `http://localhost:3001`

---

## Testing

All endpoints tested and working:
- ✅ User registration
- ✅ User login
- ✅ File upload (CSV)
- ✅ Dataset listing
- ✅ Table data retrieval
- ✅ Pagination

---

**Phase 1 Complete! 🎉**

The foundation is solid and ready for Phase 2 features.

