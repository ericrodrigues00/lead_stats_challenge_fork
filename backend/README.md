# Task Management Backend API

A robust REST API built with NestJS, TypeScript, and Drizzle ORM for managing tasks with PostgreSQL database.

## 🚀 Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Runtime**: Node.js

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v18 or higher)
- npm or pnpm
- PostgreSQL 16 (or Docker for containerized setup)
- Git

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the backend root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_manager

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Database Setup

#### Option A: Using Docker (Recommended)
```bash
# Navigate to the postgres directory
cd ../postgres

# Start PostgreSQL container
docker-compose up -d

# Verify the container is running
docker ps
```

#### Option B: Local PostgreSQL
1. Install PostgreSQL 16
2. Create a database named `task_manager`
3. Update the `DATABASE_URL` in your `.env` file

### 5. Database Migrations

Run the database migrations to create the required tables:

```bash
# Generate migration (if schema changes)
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate
```

### 6. Start the Development Server

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks (with optional filters) |
| GET | `/tasks/:id` | Get a specific task by ID |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update an existing task |
| DELETE | `/tasks/:id` | Delete a task |

#### Task Model

```typescript
interface Task {
  id: string;                    // UUID
  title: string;                 // Task title (max 255 chars)
  description: string;           // Task description
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  createdAt: Date;              // Auto-generated timestamp
  dueDate?: Date;               // Optional due date
  assignedTo: string;           // Assignee name
  tags: string[];               // Array of tags
  estimatedHours: number;       // Estimated hours to complete
}
```

#### Example API Calls

**Create a new task:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication system",
    "priority": "HIGH",
    "status": "TODO",
    "assignedTo": "John Doe",
    "tags": ["auth", "security"],
    "estimatedHours": 8
  }'
```

**Get all tasks:**
```bash
curl http://localhost:3000/tasks
```

**Update a task:**
```bash
curl -X PUT http://localhost:3000/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS"
  }'
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── db/
│   │   └── drizzle-client.ts   # Database connection
│   ├── schema/
│   │   └── task.ts            # Database schema definition
│   └── tasks/
│       ├── tasks.controller.ts # REST API endpoints
│       ├── tasks.service.ts    # Business logic
│       └── tasks.module.ts     # Tasks module
├── drizzle/
│   └── migrations/            # Database migrations
├── drizzle.config.ts          # Drizzle ORM configuration
└── package.json
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Building
npm run build        # Build the application

# Production
npm start           # Start production server

# Testing
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run test:cov    # Run tests with coverage
```

### Database Operations

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit migrate

# View database schema
npx drizzle-kit studio
```

## 🔒 CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative frontend port)



## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PORT` | Server port | 3000 |


