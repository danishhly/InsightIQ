# InsightIQ - AI-Powered Business Intelligence Dashboard

A modern full-stack SaaS application that transforms data into actionable insights using AI-powered natural language queries.

## 🚀 Features

- **Natural Language Queries**: Ask questions in plain English and get instant data visualizations
- **AI-Powered Insights**: Automatic insight generation from your data
- **Interactive Charts**: Beautiful, customizable charts and visualizations
- **Data Upload**: Support for CSV and Excel file uploads
- **Secure Authentication**: JWT-based authentication system

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS
- **Backend**: NestJS/Express with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI GPT-4 for text-to-SQL and insight generation

## 📁 Project Structure

```
insightiq/
├── frontend/          # Next.js 15 Application
├── backend/           # Node.js Backend API
├── shared/            # Shared types/utilities
└── docs/              # Documentation
```

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14.0

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `frontend` and `backend` directories
   - Configure your database and API keys

4. Set up the database:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

5. Start development servers:
   ```bash
   npm run dev
   ```

## 📝 Development Status

Currently implementing **Phase 1: Foundation**

- [x] Project setup
- [ ] Database schema design & Prisma setup
- [ ] Authentication system
- [ ] Basic file upload & parsing

## 📚 Documentation

See `PROJECT_ANALYSIS.md` for detailed architecture and design documentation.

## 📄 License

MIT

