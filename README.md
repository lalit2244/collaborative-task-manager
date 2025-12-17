# Collaborative Task Manager

> A production-ready, full-stack task management application with real-time collaboration features.

[![Live Demo](https://img.shields.io/badge/demo-live-success)]([https://task-manager-frontend.onrender.com](https://collaborative-task-manager-frontend.onrender.com))
[![Backend](https://img.shields.io/badge/API-live-blue)]([https://task-manager-backend-xxxx.onrender.com](https://collaborative-task-manager-backend-0glw.onrender.com))
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Performance](#performance)

## 🎯 Overview

A comprehensive task management system designed for team collaboration with real-time synchronization. Built with modern technologies and best practices, this application demonstrates enterprise-level architecture, scalability, and maintainability.

**Live Demo:** [https://task-manager-frontend.onrender.com](https://task-manager-frontend.onrender.com)

**API Endpoint:** [https://task-manager-backend-xxxx.onrender.com](https://task-manager-backend-xxxx.onrender.com)

## ✨ Features

### Core Functionality

- **🔐 Secure Authentication**
  - JWT-based authentication with HttpOnly cookies
  - Password hashing using bcrypt (12 rounds)
  - Session management and token refresh
  - Protected routes and API endpoints

- **📝 Task Management (CRUD)**
  - Create, read, update, and delete tasks
  - Rich task attributes (title, description, due date, priority, status)
  - Task assignment to team members
  - Overdue task detection and alerts

- **⚡ Real-time Collaboration**
  - Live updates using Socket.io
  - Instant task synchronization across clients
  - Real-time assignment notifications
  - Multi-user concurrent editing support

- **📊 Advanced Dashboard**
  - Personal task views (assigned, created, overdue)
  - Real-time statistics and metrics
  - Comprehensive filtering (status, priority)
  - Multi-criteria sorting (date, priority, status)

- **📜 Audit Logging**
  - Complete change history tracking
  - User attribution for all modifications
  - Timestamp-based activity logs
  - Field-level change tracking

### Bonus Features

- **🎯 Optimistic UI** - Instant feedback using SWR caching
- **🐳 Docker Support** - Full containerization with docker-compose
- **📱 Responsive Design** - Mobile-first approach with Tailwind CSS
- **🔒 Security Hardened** - CORS, input validation, SQL injection prevention
- **⚡ Performance Optimized** - Database indexing, connection pooling, lazy loading

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** SWR for server state
- **Form Handling:** React Hook Form + Zod validation
- **Routing:** React Router v6
- **Real-time:** Socket.io Client
- **HTTP Client:** Axios with interceptors

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Authentication:** JWT + bcrypt
- **Real-time:** Socket.io
- **Validation:** Zod schemas with DTOs
- **Testing:** Jest + Supertest

### DevOps
- **Containerization:** Docker + Docker Compose
- **Database Migrations:** Prisma Migrate
- **CI/CD:** GitHub Actions (optional)
- **Deployment:** Render (Frontend & Backend)

## 🏗️ Architecture

### Backend Architecture
```
┌─────────────────────────────────────────┐
│     Controllers (HTTP Request Layer)   │
│  - Request validation                   │
│  - Response formatting                  │
│  - Error handling                       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│    Services (Business Logic Layer)     │
│  - Core business rules                  │
│  - Transaction orchestration            │
│  - Data transformation                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Repositories (Data Access Layer)      │
│  - Database operations                  │
│  - Query optimization                   │
│  - Data persistence                     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Database (PostgreSQL)             │
│  - ACID transactions                    │
│  - Referential integrity                │
│  - Performance indexes                  │
└─────────────────────────────────────────┘
```

**Design Patterns:**
- **MVC Pattern:** Clear separation of concerns
- **Repository Pattern:** Data access abstraction
- **DTO Pattern:** Type-safe data transfer
- **Dependency Injection:** Constructor-based injection for testability

### Frontend Architecture
```
┌─────────────────────────────────────────┐
│         Pages (Route Components)        │
│  - Route definitions                    │
│  - Page-level state                     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Components (UI Components)         │
│  - Reusable components                  │
│  - Presentation logic                   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Hooks (Custom Hooks)            │
│  - Data fetching                        │
│  - State management                     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Services (API Layer)             │
│  - HTTP client                          │
│  - WebSocket management                 │
└─────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 18.x
npm >= 9.x
PostgreSQL >= 14.x
```

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/collaborative-task-manager.git
cd collaborative-task-manager
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Backend runs on `http://localhost:3000`

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🐳 Docker Deployment

### Quick Start with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean up (including volumes)
docker-compose down -v
```

### Access Application

- **Frontend:** http://localhost:80
- **Backend API:** http://localhost:3000
- **API Health:** http://localhost:3000/health

### Development Mode
```bash
# Start with development configuration
docker-compose -f docker-compose.dev.yml up -d
```

### Individual Service Management
```bash
# Rebuild specific service
docker-compose up -d --build backend

# View service logs
docker-compose logs -f backend

# Execute commands in container
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx prisma studio
```

## 📚 API Documentation

### Base URL
```
Production: https://task-manager-backend-xxxx.onrender.com/api/v1
Local: http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "user": { "id": "...", "email": "...", "name": "..." },
  "token": "jwt-token"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "message": "Login successful",
  "user": { "id": "...", "email": "...", "name": "..." },
  "token": "jwt-token"
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "email": "john@example.com",
  "name": "John Doe",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### Task Endpoints

#### Create Task
```http
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Implement authentication",
  "description": "Add JWT-based auth system",
  "dueDate": "2025-12-31T23:59:59Z",
  "priority": "HIGH",
  "status": "TODO",
  "assignedToId": "user-uuid"
}

Response: 201 Created
```

#### Get All Tasks
```http
GET /tasks?status=TODO&priority=HIGH&sortBy=dueDate&order=asc
Authorization: Bearer {token}

Response: 200 OK
[{ "id": "...", "title": "...", ... }]
```

#### Get Dashboard
```http
GET /tasks/dashboard
Authorization: Bearer {token}

Response: 200 OK
{
  "assignedTasks": [...],
  "createdTasks": [...],
  "overdueTasks": [...],
  "stats": {
    "totalAssigned": 10,
    "totalCreated": 5,
    "totalOverdue": 2,
    "completedTasks": 3
  }
}
```

#### Update Task
```http
PUT /tasks/{taskId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "priority": "URGENT"
}

Response: 200 OK
```

#### Delete Task
```http
DELETE /tasks/{taskId}
Authorization: Bearer {token}

Response: 200 OK
```

### Error Responses

All endpoints return consistent error responses:
```json
{
  "error": "Error message description",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**HTTP Status Codes:**
- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## 🗄️ Database Schema
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  createdTasks  Task[] @relation("TaskCreator")
  assignedTasks Task[] @relation("TaskAssignee")
  notifications Notification[]
}

model Task {
  id          String   @id @default(uuid())
  title       String   @db.VarChar(100)
  description String   @db.Text
  dueDate     DateTime
  priority    Priority
  status      Status   @default(TODO)
  
  creatorId    String
  creator      User   @relation("TaskCreator")
  
  assignedToId String?
  assignedTo   User?  @relation("TaskAssignee")
  
  auditLogs AuditLog[]
  
  @@index([creatorId, assignedToId, status, priority, dueDate])
}

enum Priority { LOW, MEDIUM, HIGH, URGENT }
enum Status { TODO, IN_PROGRESS, REVIEW, COMPLETED }
```

## 🧪 Testing

### Run Tests
```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Test Coverage

- ✅ Task creation with validation
- ✅ Task updates with audit logging
- ✅ Dashboard data aggregation
- ✅ Error handling scenarios
- ✅ Authentication flows

## 🚢 Deployment

### Environment Variables

#### Backend
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key-minimum-32-characters
PORT=3000
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.com
```

#### Frontend
```env
VITE_API_URL=https://your-backend-url.com/api/v1
```

### Render Deployment

**Backend:**
1. Build Command: `npm install && npx prisma generate && npm run build`
2. Start Command: `npx prisma migrate deploy && npm start`
3. Add environment variables

**Frontend:**
1. Build Command: `npm install && npm run build`
2. Publish Directory: `dist`
3. Add VITE_API_URL environment variable

## 🔒 Security

### Implemented Security Measures

- **Authentication:** JWT with HttpOnly cookies
- **Password Security:** bcrypt with 12 salt rounds
- **Input Validation:** Zod schemas on all endpoints
- **SQL Injection Prevention:** Prisma ORM with parameterized queries
- **XSS Protection:** React's built-in escaping
- **CORS:** Configured for specific origins
- **Rate Limiting:** Ready for implementation
- **Security Headers:** CSP, X-Frame-Options

## ⚡ Performance

### Optimization Techniques

- **Database Indexing:** On frequently queried fields
- **Connection Pooling:** Prisma connection management
- **Caching:** SWR for client-side caching
- **Lazy Loading:** Code splitting with React.lazy
- **Optimistic Updates:** Instant UI feedback
- **Compression:** Gzip enabled
- **CDN Ready:** Static asset optimization

### Performance Metrics

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Lighthouse Score:** > 90

## 💡 Design Decisions

### Why PostgreSQL?
- ACID compliance for data consistency
- Excellent support for complex relationships
- Superior query performance with proper indexing
- Mature ecosystem and tooling

### Why Prisma?
- Type-safe database queries
- Auto-generated TypeScript types
- Built-in migration system
- Excellent developer experience

### Why Socket.io?
- Automatic fallback mechanisms
- Room-based messaging support
- Built-in reconnection logic
- Cross-browser compatibility

## 📝 Development Workflow
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and test
npm test

# 3. Commit with conventional commits
git commit -m "feat: add new feature"

# 4. Push and create PR
git push origin feature/new-feature
```

## 🔮 Future Enhancements

- [ ] Email notification system
- [ ] File attachments for tasks
- [ ] Advanced role-based access control
- [ ] Task templates and recurring tasks
- [ ] Analytics and reporting dashboard
- [ ] Mobile application (React Native)
- [ ] Integration with third-party tools (Slack, Teams)
- [ ] AI-powered task prioritization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Email: lalitpatil6445@gmail.com

## 🙏 Acknowledgments

- Built as part of a full-stack engineering assessment
- Inspired by modern task management tools like Jira, Asana, and Trello
- Thanks to the open-source community for excellent tools and libraries

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**

**📧 For inquiries or collaboration opportunities: lalitpatil6445@gmail.com**
