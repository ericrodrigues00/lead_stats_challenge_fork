<template>
  <div class="task-card">
    <h3 class="text-xl font-semibold mb-4">Task Timeline</h3>
    <div class="h-64">
      <Line
        v-if="chartData"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useTaskFilters } from '../composables/useTaskFilters'

const { filteredTasks } = useTaskFilters()

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const chartData = computed(() => {
  // Group tasks by creation date (accept both snake_case and camelCase)
  const tasksByDate = filteredTasks.value.reduce((acc, task) => {
    const rawDate = task.created_at || task.createdAt
    if (!rawDate) return acc
    const dateObj = typeof rawDate === 'string' ? new Date(rawDate) : rawDate
    if (isNaN(dateObj.getTime())) return acc
    const date = dateObj.toLocaleDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  // Sort dates and prepare chart data
  const sortedDates = Object.keys(tasksByDate).sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  )

  return {
    labels: sortedDates,
    datasets: [
      {
        label: 'Tasks Created',
        data: sortedDates.map(date => tasksByDate[date]),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false,
  },
}
</script>