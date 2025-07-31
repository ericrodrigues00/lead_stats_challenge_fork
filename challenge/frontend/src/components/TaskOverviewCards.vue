<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div 
      v-for="level in urgencyLevels" 
      :key="level.value"
      class="task-card"
      :class="level.cardClass"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold mb-2">{{ level.label }}</h3>
          <p class="text-3xl font-bold" :class="level.textClass">
            {{ taskCounts[level.value] }}
          </p>
        </div>
        <div class="text-4xl opacity-20" :class="level.iconClass">
          {{ level.icon }}
        </div>
      </div>
      <p class="text-sm mt-2 opacity-70">
        {{ level.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTaskFilters } from '../composables/useTaskFilters'

const { priority, dateRange, filteredTasks } = useTaskFilters()

import type { Task } from '../composables/useTasks'

const urgencyLevels = [
  {
    value: 'high',
    label: 'High Urgency',
    description: 'Tasks requiring immediate attention',
    icon: '🔴',
    cardClass: 'urgency-high',
    textClass: 'text-red-600',
    iconClass: 'text-red-500'
  },
  {
    value: 'medium',
    label: 'Medium Urgency',
    description: 'Tasks with moderate priority',
    icon: '🟠',
    cardClass: 'urgency-medium',
    textClass: 'text-yellow-600',
    iconClass: 'text-yellow-500'
  },
  {
    value: 'low',
    label: 'Low Urgency',
    description: 'Tasks that can be addressed later',
    icon: '🟢',
    cardClass: 'urgency-low',
    textClass: 'text-green-600',
    iconClass: 'text-green-500'
  }
]

const taskCounts = computed(() => {
  return {
    high: filteredTasks.value.filter(t => t.priority === 'HIGH').length,
    medium: filteredTasks.value.filter(t => t.priority === 'MEDIUM').length,
    low: filteredTasks.value.filter(t => t.priority === 'LOW').length,
  }
})
</script>