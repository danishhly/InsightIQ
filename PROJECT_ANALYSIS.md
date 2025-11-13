# InsightIQ - Project Structure & Design Analysis

## 📋 Executive Summary

**Project Name:** InsightIQ - AI-Powered Business Intelligence Dashboard  
**Type:** Full-stack SaaS Application  
**Architecture:** Modern 3-tier architecture (Frontend → Backend → Database + AI Layer)

---

## 🏗️ Detailed Project Structure

```
insightiq/
├── frontend/                          # Next.js 15 Application
│   ├── src/
│   │   ├── app/                       # Next.js 15 App Router
│   │   │   ├── (auth)/                # Auth routes group
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── layout.tsx
│   │   │   ├── (dashboard)/           # Protected dashboard routes
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── page.tsx      # Main dashboard view
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── data/
│   │   │   │   │   ├── upload/       # Data upload page
│   │   │   │   │   ├── tables/       # Data table viewer
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── charts/           # Chart visualization page
│   │   │   │   ├── insights/         # AI insights page
│   │   │   │   └── layout.tsx        # Dashboard layout with sidebar
│   │   │   ├── api/                  # Next.js API routes (proxy/auth)
│   │   │   │   └── auth/
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── page.tsx              # Landing page
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/                   # Reusable UI components (shadcn/ui style)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   └── ...
│   │   │   ├── dashboard/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── TopNavbar.tsx
│   │   │   │   ├── DataUpload.tsx
│   │   │   │   ├── ChartContainer.tsx
│   │   │   │   ├── InsightCard.tsx
│   │   │   │   └── DataTable.tsx
│   │   │   ├── charts/
│   │   │   │   ├── BarChart.tsx
│   │   │   │   ├── LineChart.tsx
│   │   │   │   ├── PieChart.tsx
│   │   │   │   └── ChartSelector.tsx
│   │   │   ├── ai/
│   │   │   │   ├── ChatInterface.tsx
│   │   │   │   ├── ChatMessage.tsx
│   │   │   │   └── QueryInput.tsx
│   │   │   └── landing/
│   │   │       ├── Hero.tsx
│   │   │       ├── Features.tsx
│   │   │       ├── Pricing.tsx
│   │   │       └── Footer.tsx
│   │   ├── lib/
│   │   │   ├── api/                  # API client functions
│   │   │   │   ├── client.ts         # Axios/Fetch wrapper
│   │   │   │   ├── auth.ts
│   │   │   │   ├── data.ts
│   │   │   │   ├── charts.ts
│   │   │   │   └── ai.ts
│   │   │   ├── utils/
│   │   │   │   ├── cn.ts             # Class name utility
│   │   │   │   ├── formatters.ts     # Data formatting
│   │   │   │   └── validators.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useData.ts
│   │   │   │   ├── useCharts.ts
│   │   │   │   └── useAI.ts
│   │   │   └── store/                # Zustand stores
│   │   │       ├── authStore.ts
│   │   │       ├── dataStore.ts
│   │   │       └── uiStore.ts
│   │   ├── types/
│   │   │   ├── index.ts              # Shared TypeScript types
│   │   │   ├── api.ts
│   │   │   ├── data.ts
│   │   │   └── chart.ts
│   │   └── styles/
│   │       └── tailwind.config.ts
│   ├── public/
│   │   ├── images/
│   │   └── icons/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env.local
│
├── backend/                           # Node.js Backend API
│   ├── src/
│   │   ├── main.ts                   # Application entry point
│   │   ├── app.module.ts             # Root module (NestJS) or app setup (Express)
│   │   ├── config/
│   │   │   ├── database.config.ts
│   │   │   ├── ai.config.ts
│   │   │   └── env.config.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── strategies/
│   │   │   │   │   └── jwt.strategy.ts
│   │   │   │   └── guards/
│   │   │   │       └── jwt.guard.ts
│   │   │   ├── users/
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   ├── users.module.ts
│   │   │   │   └── dto/
│   │   │   │       ├── create-user.dto.ts
│   │   │   │       └── update-user.dto.ts
│   │   │   ├── data/
│   │   │   │   ├── data.controller.ts
│   │   │   │   ├── data.service.ts
│   │   │   │   ├── data.module.ts
│   │   │   │   ├── parsers/
│   │   │   │   │   ├── csv.parser.ts
│   │   │   │   │   ├── excel.parser.ts
│   │   │   │   │   └── parser.interface.ts
│   │   │   │   └── dto/
│   │   │   │       └── upload-data.dto.ts
│   │   │   ├── charts/
│   │   │   │   ├── charts.controller.ts
│   │   │   │   ├── charts.service.ts
│   │   │   │   ├── charts.module.ts
│   │   │   │   └── dto/
│   │   │   │       └── create-chart.dto.ts
│   │   │   ├── ai/
│   │   │   │   ├── ai.controller.ts
│   │   │   │   ├── ai.service.ts
│   │   │   │   ├── ai.module.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── sql-generator.service.ts    # Text-to-SQL
│   │   │   │   │   ├── insight-generator.service.ts # Insight generation
│   │   │   │   │   └── query-validator.service.ts   # SQL validation
│   │   │   │   ├── prompts/
│   │   │   │   │   ├── sql-generation.prompt.ts
│   │   │   │   │   └── insight-generation.prompt.ts
│   │   │   │   └── dto/
│   │   │   │       └── ai-query.dto.ts
│   │   │   └── insights/
│   │   │       ├── insights.controller.ts
│   │   │       ├── insights.service.ts
│   │   │       └── insights.module.ts
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   │   └── current-user.decorator.ts
│   │   │   ├── filters/
│   │   │   │   └── http-exception.filter.ts
│   │   │   ├── interceptors/
│   │   │   │   └── transform.interceptor.ts
│   │   │   └── pipes/
│   │   │       └── validation.pipe.ts
│   │   ├── database/
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma
│   │   │   │   └── migrations/
│   │   │   └── seed.ts
│   │   └── utils/
│   │       ├── logger.ts
│   │       └── helpers.ts
│   ├── test/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json (if NestJS) or
│   ├── server.js (if Express)
│   └── .env
│
├── shared/                            # Shared types/utilities (optional)
│   ├── types/
│   └── constants/
│
├── docs/                              # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── docker-compose.yml                 # Local development setup
├── .gitignore
├── README.md
└── package.json                       # Root package.json (workspace)
```

---

## 🎨 Design Architecture Analysis

### 1. **Frontend Architecture (Next.js 15)**

#### **App Router Structure**
- **Route Groups**: `(auth)` and `(dashboard)` for logical grouping
- **Layout Hierarchy**: Root → Auth/Dashboard → Page-specific layouts
- **Server Components**: Default for better performance
- **Client Components**: Only where interactivity is needed (charts, chat)

#### **State Management Strategy**
```
┌─────────────────────────────────────┐
│   Server State (React Query)        │
│   - API data fetching               │
│   - Caching & synchronization       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Client State (Zustand)            │
│   - UI state (sidebar, modals)      │
│   - Auth state (user session)       │
│   - Temporary form state            │
└─────────────────────────────────────┘
```

#### **Component Architecture**
- **Atomic Design**: UI components → Feature components → Page components
- **Composition Pattern**: Reusable chart components with data injection
- **Separation of Concerns**: 
  - Components = Presentation
  - Hooks = Logic
  - API Client = Data fetching

### 2. **Backend Architecture**

#### **Module-Based Structure (NestJS Recommended)**
```
┌─────────────────────────────────────┐
│         Controllers (HTTP)           │
│   - Request/Response handling        │
│   - Validation                       │
└──────────────┬───────────────────────┘
               ↓
┌─────────────────────────────────────┐
│         Services (Business Logic)   │
│   - Data processing                 │
│   - AI integration                  │
└──────────────┬───────────────────────┘
               ↓
┌─────────────────────────────────────┐
│         Repositories (Data Access)  │
│   - Prisma queries                  │
│   - Database operations             │
└─────────────────────────────────────┘
```

#### **AI Service Layer Design**
```
User Query
    ↓
┌─────────────────────────┐
│  Query Validator        │  ← Sanitize input
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│  Schema Analyzer        │  ← Get table structure
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│  SQL Generator (LLM)    │  ← LangChain + OpenAI
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│  SQL Validator          │  ← Prevent injection
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│  Query Executor         │  ← Prisma/Knex
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│  Result Formatter       │  ← Format for charts
└──────────┬──────────────┘
           ↓
┌─────────────────────────┐
│  Insight Generator      │  ← Generate summary
└─────────────────────────┘
```

### 3. **Database Schema Design**

#### **Core Tables**
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
  
  user          User     @relation(fields: [userId], references: [id])
  tables        DataTable[]
  charts        Chart[]
}

model DataTable {
  id            String   @id @default(uuid())
  datasetId     String
  tableName     String
  columns       Json     // Column definitions
  data          Json?    // Actual data (or reference to storage)
  
  dataset       Dataset  @relation(fields: [datasetId], references: [id])
}

model Chart {
  id            String   @id @default(uuid())
  userId        String
  datasetId     String
  name          String
  type          ChartType  // bar, line, pie, etc.
  config        Json     // Chart configuration
  query         String?  // SQL query used
  createdAt     DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id])
  dataset       Dataset  @relation(fields: [datasetId], references: [id])
}

model Insight {
  id            String   @id @default(uuid())
  userId        String
  chartId       String?
  content       String   // AI-generated insight text
  type          InsightType  // summary, anomaly, trend
  metadata      Json?
  createdAt     DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id])
  chart         Chart?   @relation(fields: [chartId], references: [id])
}

model Query {
  id            String   @id @default(uuid())
  userId        String
  naturalQuery  String   // User's natural language query
  sqlQuery      String   // Generated SQL
  result        Json?    // Query result
  executedAt    DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id])
}

enum Role {
  ADMIN
  ANALYST
  VIEWER
}

enum ChartType {
  BAR
  LINE
  PIE
  SCATTER
  AREA
}

enum InsightType {
  SUMMARY
  TREND
  ANOMALY
  COMPARISON
}
```

### 4. **API Design (RESTful)**

#### **Endpoint Structure**
```
Authentication:
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/refresh
  POST   /api/auth/logout

Users:
  GET    /api/users/me
  PATCH  /api/users/me
  DELETE /api/users/me

Data:
  POST   /api/data/upload          # Upload CSV/Excel
  GET    /api/data                 # List user's datasets
  GET    /api/data/:id             # Get dataset details
  GET    /api/data/:id/table       # Get table data (paginated)
  DELETE /api/data/:id             # Delete dataset

Charts:
  POST   /api/charts                # Create chart
  GET    /api/charts                # List charts
  GET    /api/charts/:id            # Get chart
  PATCH  /api/charts/:id            # Update chart
  DELETE /api/charts/:id            # Delete chart

AI:
  POST   /api/ai/query              # Natural language query
  POST   /api/ai/generate-insight   # Generate insight for chart
  POST   /api/ai/validate-sql       # Validate SQL query

Insights:
  GET    /api/insights              # List insights
  GET    /api/insights/:id          # Get insight
```

#### **Response Format Standard**
```typescript
// Success Response
{
  success: true,
  data: T,
  message?: string
}

// Error Response
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

### 5. **Security Architecture**

#### **Authentication Flow**
```
1. User Login
   ↓
2. Backend validates credentials
   ↓
3. Generate JWT (access + refresh tokens)
   ↓
4. Store refresh token in httpOnly cookie
   ↓
5. Return access token to client
   ↓
6. Client stores access token (memory/state)
   ↓
7. Include in Authorization header for API calls
```

#### **Security Layers**
- **Input Validation**: Zod/DTO validation on all endpoints
- **SQL Injection Prevention**: 
  - Parameterized queries (Prisma)
  - SQL query validation before execution
  - Whitelist allowed SQL operations
- **File Upload Security**:
  - File type validation
  - Size limits
  - Virus scanning (optional)
- **Rate Limiting**: Protect AI endpoints from abuse
- **CORS**: Configured for frontend domain only

### 6. **AI Integration Design**

#### **LangChain Pipeline**
```typescript
// Text-to-SQL Pipeline
const chain = new LLMChain({
  llm: new OpenAI({ modelName: "gpt-4-turbo" }),
  prompt: sqlGenerationPrompt,
  outputParser: new SQLOutputParser()
});

// Steps:
// 1. Get user's dataset schema
// 2. Build context-aware prompt with schema
// 3. Generate SQL query
// 4. Validate SQL (syntax + security)
// 5. Execute query
// 6. Format results
```

#### **Prompt Engineering Strategy**
- **Few-shot learning**: Include examples in prompts
- **Schema context**: Always include table structure
- **Constraint enforcement**: "Only SELECT queries, no DROP/ALTER"
- **Error handling**: Retry with refined prompt on failure

### 7. **Data Flow Architecture**

#### **Upload Flow**
```
User uploads CSV
    ↓
Frontend validates file
    ↓
POST /api/data/upload (multipart/form-data)
    ↓
Backend parses file (PapaParse/SheetJS)
    ↓
Validate structure & data types
    ↓
Store in PostgreSQL (normalized tables)
    ↓
Extract schema metadata
    ↓
Return dataset ID + schema
    ↓
Frontend updates UI
```

#### **Query Flow**
```
User types: "Show revenue by region"
    ↓
POST /api/ai/query
    ↓
Backend:
  - Get user's dataset schema
  - Build prompt with schema + query
  - Call LLM (OpenAI)
  - Generate SQL
  - Validate SQL
  - Execute query (Prisma)
  - Format results
    ↓
Return: { data, chartType, insight }
    ↓
Frontend:
  - Display chart (Recharts)
  - Show AI insight
  - Save to history
```

---

## 🔍 Design Considerations & Recommendations

### ✅ **Strengths of Current Plan**
1. **Modern Tech Stack**: Next.js 15, TypeScript, Prisma
2. **Clear Separation**: Frontend/Backend/AI layers well-defined
3. **Scalable Architecture**: Module-based backend structure
4. **AI-First Approach**: Natural language interface is innovative

### ⚠️ **Potential Challenges & Solutions**

#### **1. SQL Injection Risk**
**Challenge**: AI-generated SQL could be malicious  
**Solution**: 
- Implement SQL query validator (whitelist operations)
- Use parameterized queries only
- Sandbox execution environment
- Rate limiting on AI endpoints

#### **2. Cost Management**
**Challenge**: LLM API calls can be expensive  
**Solution**:
- Cache common queries
- Use cheaper models for simple queries (GPT-3.5)
- Implement query result caching
- Set usage limits per user tier

#### **3. Performance with Large Datasets**
**Challenge**: Large CSV files slow down parsing  
**Solution**:
- Stream processing for large files
- Background job processing (Bull/BullMQ)
- Pagination for data tables
- Lazy loading for charts

#### **4. Multi-tenancy**
**Challenge**: Data isolation between users  
**Solution**:
- Row-level security in PostgreSQL
- User ID filtering on all queries
- Separate schemas per user (advanced)

### 🎯 **Recommended Enhancements**

#### **1. Caching Strategy**
```
┌─────────────────┐
│  Redis Cache    │
│  - Query results│
│  - Chart configs│
│  - User sessions│
└─────────────────┘
```

#### **2. Background Jobs**
```
┌─────────────────┐
│  Job Queue      │
│  - File parsing │
│  - Insight gen  │
│  - Email reports│
└─────────────────┘
```

#### **3. Real-time Updates**
```
┌─────────────────┐
│  WebSockets     │
│  - Live charts  │
│  - Notifications│
└─────────────────┘
```

#### **4. Analytics Layer**
- Track user queries for improvement
- A/B test different AI prompts
- Monitor query success rates

---

## 📊 Component Interaction Diagram

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │
       ↓
┌─────────────────────────────────┐
│      Frontend (Next.js)        │
│  ┌──────────────────────────┐  │
│  │   ChatInterface          │  │
│  │   - User types query     │  │
│  └───────────┬───────────────┘  │
│              ↓                   │
│  ┌──────────────────────────┐  │
│  │   API Client             │  │
│  │   POST /api/ai/query     │  │
│  └───────────┬───────────────┘  │
└──────────────┼──────────────────┘
               │ HTTPS
               ↓
┌─────────────────────────────────┐
│   Backend API (NestJS/Express)  │
│  ┌──────────────────────────┐  │
│  │   AI Controller          │  │
│  └───────────┬───────────────┘  │
│              ↓                   │
│  ┌──────────────────────────┐  │
│  │   AI Service             │  │
│  │   - Get schema           │  │
│  │   - Generate SQL (LLM)   │  │
│  │   - Validate SQL         │  │
│  └───────────┬───────────────┘  │
│              ↓                   │
│  ┌──────────────────────────┐  │
│  │   Data Service           │  │
│  │   - Execute query        │  │
│  └───────────┬───────────────┘  │
└──────────────┼──────────────────┘
               │
       ┌───────┴───────┐
       ↓               ↓
┌─────────────┐  ┌─────────────┐
│ PostgreSQL  │  │   OpenAI    │
│  - Data     │  │  - GPT-4    │
│  - Schema   │  │  - SQL Gen  │
└─────────────┘  └─────────────┘
       │
       ↓
┌──────────────────────────┐
│   Response to Frontend    │
│   { data, chartType }     │
└───────────┬───────────────┘
            ↓
┌──────────────────────────┐
│   ChartContainer         │
│   - Render with Recharts │
│   - Display insight      │
└──────────────────────────┘
```

---

## 🚀 Implementation Phases

### **Phase 1: Foundation (Week 1-2)**
- [ ] Project setup (monorepo or separate repos)
- [ ] Database schema design & Prisma setup
- [ ] Authentication system
- [ ] Basic file upload & parsing

### **Phase 2: Core Features (Week 3-4)**
- [ ] Data storage & retrieval
- [ ] Basic chart rendering
- [ ] AI query endpoint (text-to-SQL)
- [ ] SQL validation & execution

### **Phase 3: AI Integration (Week 5-6)**
- [ ] LangChain integration
- [ ] Prompt engineering
- [ ] Insight generation
- [ ] Error handling & retries

### **Phase 4: UI/UX (Week 7-8)**
- [ ] Dashboard layout
- [ ] Chat interface
- [ ] Chart customization
- [ ] Responsive design

### **Phase 5: Advanced Features (Week 9-10)**
- [ ] Multi-user support
- [ ] Report generation
- [ ] Integrations (Google Sheets)
- [ ] Performance optimization

---

## 📝 Technology Decisions

### **Why NestJS over Express?**
- Built-in dependency injection
- Modular architecture
- Better TypeScript support
- Easier testing
- **Trade-off**: Steeper learning curve

### **Why Prisma over TypeORM?**
- Type-safe queries
- Better developer experience
- Automatic migrations
- Excellent TypeScript support

### **Why Zustand over Redux?**
- Simpler API
- Less boilerplate
- Better performance
- **Trade-off**: Smaller ecosystem

### **Why Recharts over Chart.js?**
- React-native
- Better TypeScript support
- Composable components
- **Trade-off**: Less customization options

---

## 🔐 Security Checklist

- [ ] JWT token expiration & refresh
- [ ] Password hashing (bcrypt)
- [ ] SQL injection prevention
- [ ] File upload validation
- [ ] CORS configuration
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Environment variable security

---

## 📈 Scalability Considerations

### **Horizontal Scaling**
- Stateless backend (JWT tokens)
- Database connection pooling
- CDN for static assets
- Load balancer ready

### **Vertical Scaling**
- Database indexing strategy
- Query optimization
- Caching layer (Redis)
- Background job processing

### **Cost Optimization**
- LLM API call optimization
- Database query optimization
- Asset compression
- Lazy loading

---

## 🎯 Success Metrics

1. **Performance**
   - Page load < 2s
   - Query response < 5s
   - Chart render < 1s

2. **AI Accuracy**
   - SQL generation success rate > 85%
   - Query result relevance > 90%

3. **User Experience**
   - Time to first insight < 30s
   - Error rate < 5%

---

## 📚 Next Steps

1. **Review this analysis** with your team
2. **Refine database schema** based on specific requirements
3. **Set up development environment**
4. **Create detailed API specifications**
5. **Design UI mockups** (Figma/Sketch)
6. **Set up CI/CD pipeline**
7. **Plan testing strategy**

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-27  
**Status:** Analysis Complete - Ready for Review

