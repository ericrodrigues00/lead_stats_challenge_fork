<script setup lang="ts">
import { computed } from 'vue'
import { useTasks } from './composables/useTasks'
import TaskOverviewCards from './components/TaskOverviewCards.vue'
import TaskTimelineChart from './components/TaskTimelineChart.vue'
import TaskTable from './components/TaskTable.vue'

const { tasksQuery } = useTasks()

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const isLoading = computed(() => tasksQuery.isLoading.value)

const totalTasks = computed(() => {
  return tasksQuery.data.value?.length || 0
})

const completedToday = computed(() => {
  const today = new Date().toDateString()
  return tasksQuery.data.value?.filter((task: any) => {
    const taskDate = new Date(task.created_at).toDateString()
    return taskDate === today && task.status === 'DONE'
  }).length || 0
})

const pendingTasks = computed(() => {
  return tasksQuery.data.value?.filter((task: any) => 
    task.status === 'TODO' || task.status === 'IN_PROGRESS'
  ).length || 0
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">Task Management Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-500">
              {{ currentDate }}
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Overview Cards -->
      <TaskOverviewCards />
      
      <!-- Chart and Table Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Timeline Chart -->
        <TaskTimelineChart />
      </div>
      
      <!-- Task Table -->
      <TaskTable />
    </main>

    <!-- Loading Overlay -->
    <div 
      v-if="isLoading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <i class="pi pi-spin pi-spinner text-2xl text-blue-600"></i>
        <span class="text-gray-700">Loading tasks...</span>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
