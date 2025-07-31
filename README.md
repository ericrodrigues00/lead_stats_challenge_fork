# Task Management System

A full-stack task management application built with modern technologies, featuring a robust backend API and a beautiful, responsive frontend dashboard.

## 🚀 Project Overview

This project is a comprehensive task management system that allows users to create, track, and manage tasks with features like priority levels, status tracking, assignment, and data visualization.

### Key Features

- **Task Management**: Create, read, update, and delete tasks
- **Priority System**: LOW, MEDIUM, HIGH priority levels
- **Status Tracking**: TODO, IN_PROGRESS, DONE statuses
- **Assignment**: Assign tasks to especific members
- **Time Estimation**: Track estimated hours for tasks
- **Data Visualization**: Interactive charts and analytics
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Tech Stack

### Backend
- **Framework**: NestJS 11.x (Node.js framework)
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM (type-safe database operations)
- **Runtime**: Node.js 18+

### Frontend
- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **UI Library**: PrimeVue 3.x (rich component library)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Build Tool**: Vite (fast build tool)
- **State Management**: Pinia (Vue state management)
- **HTTP Client**: Axios
- **Data Fetching**: TanStack Vue Query (React Query for Vue)
- **Charts**: Chart.js with vue-chartjs

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL  (containerized)

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** (package managers)
- **Docker** and **Docker Compose** (for database)
- **Git**

## 🛠️ Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>

```

### 2. Start the Database
```bash
# Navigate to the postgres directory
cd postgres

# Start PostgreSQL container
docker-compose up -d

# Verify the container is running
docker ps
```

### 3. Set Up Backend
```bash
# Navigate to backend directory
cd ../backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your database configuration

# Run database migrations
npx drizzle-kit migrate

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:3000`

### 4. Set Up Frontend
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your API configuration

# Start development server
npm run dev
```

The frontend application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
challenge/
├── backend/                    # NestJS API server
│   ├── src/
│   │   ├── main.ts            # Application entry point
│   │   ├── app.module.ts      # Root module
│   │   ├── db/
│   │   │   └── drizzle-client.ts
│   │   ├── schema/
│   │   │   └── task.ts        # Database schema
│   │   └── tasks/
│   │       ├── tasks.controller.ts
│   │       ├── tasks.service.ts
│   │       └── tasks.module.ts
│   ├── drizzle/
│   │   └── migrations/        # Database migrations
│   └── package.json
├── frontend/                   # Vue 3 frontend application
│   ├── src/
│   │   ├── main.ts            # Application entry point
│   │   ├── App.vue            # Root component
│   │   ├── components/
│   │   │   ├── TaskForm.vue
│   │   │   ├── TaskTable.vue
│   │   │   ├── TaskOverviewCards.vue
│   │   │   └── TaskTimelineChart.vue
│   │   └── composables/
│   │       ├── useTasks.ts
│   │       └── useTaskFilters.ts
│   └── package.json
├── postgres/                   # Database configuration
│   └── docker-compose.yml
└── README.md                   # This file
```

## 📊 Database Schema

The application uses a single `tasks` table with the following structure:

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority priority_enum NOT NULL,
  status status_enum NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to VARCHAR(255) NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]',
  estimated_hours NUMERIC NOT NULL
);

CREATE TYPE priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE status_enum AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
```

## 🔧 Development Workflow

### Backend Development
```bash
cd backend

# Development with hot reload
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Database operations
npx drizzle-kit generate  # Generate migrations
npx drizzle-kit migrate   # Apply migrations
npx drizzle-kit studio    # View database schema
```

### Frontend Development
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 API Endpoints

The backend provides a RESTful API with the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks (with optional filters) |
| GET | `/tasks/:id` | Get a specific task by ID |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update an existing task |
| DELETE | `/tasks/:id` | Delete a task |

### Example API Usage

```bash
# Create a task
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

# Get all tasks
curl http://localhost:3000/tasks
```



## 📈 Performance & Optimization

### Backend Optimizations
- **Drizzle ORM**: Type-safe database operations with excellent performance
- **NestJS**: Efficient dependency injection and modular architecture
- **CORS Configuration**: Optimized for frontend communication

### Frontend Optimizations
- **Vite**: Fast development server and optimized builds
- **TanStack Query**: Intelligent caching and background updates
- **Vue 3 Composition API**: Better tree-shaking and performance
- **Tailwind CSS**: Utility-first CSS for smaller bundle sizes

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL container is running: `docker ps`
   - Check DATABASE_URL in backend .env file
   - Verify database migrations are applied

2. **Frontend Can't Connect to Backend**
   - Ensure backend is running on port 3000
   - Check VITE_API_BASE_URL in frontend .env file
   - Verify CORS configuration in backend

3. **Port Already in Use**
   - Change PORT in backend .env file
   - Update VITE_API_BASE_URL in frontend .env file accordingly


## 🙏 Tools Used

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [PrimeVue](https://primevue.org/) - Vue UI Component Library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework 