# InsightIQ Backend

Backend API for InsightIQ - AI-Powered Business Intelligence Dashboard

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- npm >= 9.0.0

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your database credentials and API keys.

3. Set up the database:
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

4. (Optional) Seed the database:
   ```bash
   npm run prisma:seed
   ```

5. Start development server:
   ```bash
   npm run start:dev
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── database/
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database schema
│   │   └── seed.ts             # Database seeding
│   └── ...
├── package.json
└── tsconfig.json
```

## 🗄️ Database

This project uses Prisma ORM with PostgreSQL. The schema is defined in `src/database/prisma/schema.prisma`.

### Prisma Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

## 📝 API Documentation

API documentation will be available at `/api/docs` once implemented.

