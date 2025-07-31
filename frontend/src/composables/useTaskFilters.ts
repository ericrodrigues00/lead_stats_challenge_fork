import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'

// Shared reactive filter state
const priority = ref<string | null>(null) // 'HIGH' | 'MEDIUM' | 'LOW' | null
const dateRange = ref<[Date | null, Date | null] | null>(null)

export function useTaskFilters() {
  const { data: allTasks, isLoading, refetch } = useQuery(['tasks'], async () => {
    const { data } = await axios.get('http://localhost:3000/tasks')
    return data
  })

  const filteredTasks = computed(() => {
    let tasks = allTasks.value || []
    if (priority.value) {
      tasks = tasks.filter((t: { priority: string }) => t.priority === priority.value)
    }
    if (dateRange.value) {
      const [start, end] = dateRange.value
      tasks = tasks.filter((t: { created_at?: string; createdAt?: string }) => {
        const created = new Date(t.created_at ?? t.createdAt ?? '')
        if (start && created < start) return false
        if (end && created > end) return false
        return true
      })
    }
    return tasks
  })

  return {
    priority,
    dateRange,
    filteredTasks,
    isLoading,
    refetch
  }
}