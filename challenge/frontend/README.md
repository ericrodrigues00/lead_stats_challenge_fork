# Task Management Frontend

A modern, responsive task management dashboard built with Vue 3, TypeScript, and PrimeVue components.

## 🚀 Tech Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **UI Library**: PrimeVue 3.x
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Data Fetching**: TanStack Vue Query
- **Charts**: Chart.js with vue-chartjs

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v18 or higher)
- npm or pnpm
- Git

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd challenge/frontend
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

### 3. Start the Development Server

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```



## 🎯 Features

### Dashboard Overview
- **Task Overview Cards**: Display total tasks, completed today, and pending tasks
- **Timeline Chart**: Visual representation of task completion over time
- **Task Table**: Comprehensive task management with filtering and sorting

### Task Management
- **Create Tasks**: Add new tasks with title, description, priority, and assignee
- **Update Tasks**: Modify task status, priority, and other details
- **Delete Tasks**: Remove tasks from the system
- **Filter & Search**: Find tasks by name or filter them by date and priority

### Data Visualization
- **Charts**: Interactive charts showing task distribution and progress
- **Real-time Updates**: Live data updates in the frontend
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── App.vue                 # Root component
│   ├── components/
│   │   ├── TaskForm.vue        # Task creation/editing form
│   │   ├── TaskTable.vue       # Task list with CRUD operations
│   │   ├── TaskOverviewCards.vue # Dashboard overview cards
│   │   └── TaskTimelineChart.vue # Timeline visualization
│   ├── composables/
│   │   ├── useTasks.ts         # Task data management
│   │   └── useTaskFilters.ts   # Filtering logic
│   ├── assets/
│   └── style.css               # Global styles
├── public/
├── index.html
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── package.json
```

## 🧩 Components

### TaskForm.vue
A comprehensive form component for creating and editing tasks.

**Props:**
- `task` (optional): Existing task data for editing mode
- `mode`: 'create' or 'edit'

**Features:**
- Form validation
- Priority selection (LOW, MEDIUM, HIGH)
- Status selection (TODO, IN_PROGRESS, DONE)
- Tag input 
- Estimated hours input

### TaskTable.vue
A data table component for displaying and managing tasks.

**Features:**
- Sortable columns
- Filterable data
- Pagination
- Bulk actions
- Inline editing
- Status updates

### TaskOverviewCards.vue
Dashboard cards showing key metrics.

**Metrics:**
- Total tasks count
- Tasks completed today
- Pending tasks count
- Average completion time

### TaskTimelineChart.vue
Chart component showing task completion timeline.

**Chart Type:** Line chart
**Data:** Task completion over time
**Features:** Interactive tooltips, responsive design

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production

# Preview
npm run preview      # Preview production build
```

### Code Style

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

### Component Development

When creating new components:

1. Use the Composition API with `<script setup>`
2. Include TypeScript interfaces for props and emits
3. Follow the existing naming conventions
4. Add proper error handling
5. Include loading states where appropriate

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS for styling with custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom colors and spacing
    }
  },
  plugins: []
}
```

### PrimeVue Theme
PrimeVue components are styled with the default theme, which can be customized in the main CSS file.

## 📊 Data Management

### TanStack Vue Query
The application uses TanStack Vue Query for efficient data fetching and caching:

```typescript
// Example usage in composables/useTasks.ts
const tasksQuery = useQuery({
  queryKey: ['tasks'],
  queryFn: () => api.getTasks(),
  staleTime: 5 * 60 * 1000, // 5 minutes
})
```

### API Integration
HTTP requests are handled through Axios with a centralized API client:

```typescript
// API base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})
```


## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.


```

