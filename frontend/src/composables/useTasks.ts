import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import axios from 'axios'
import { computed, unref } from 'vue'

const API_URL = 'http://localhost:3000/tasks'

export interface Task {
  id: string
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  created_at: string
  due_date?: string
  assigned_to: string
  tags: any[]
  estimated_hours: number
}

export interface CreateTaskData {
  title: string
  description: string
  urgency: 'high' | 'medium' | 'low'
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string
}

export function useTasks(filters?: any) {
  const queryClient = useQueryClient()

  const fetchTasks = async () => {
    const params: any = {}
    
    // Unwrap reactive refs if they exist
    const unwrappedFilters = unref(filters) || {}
    
    // Handle filters properly
    if (unwrappedFilters.priority && typeof unwrappedFilters.priority === 'string') {
      // Converte para o formato do backend
      params.priority = unwrappedFilters.priority.toUpperCase();
    }
    
    if (unwrappedFilters.dateRange && Array.isArray(unwrappedFilters.dateRange)) {
      if (unwrappedFilters.dateRange[0]) {
        params.start = unwrappedFilters.dateRange[0].toISOString().split('T')[0]
      }
      if (unwrappedFilters.dateRange[1]) {
        params.end = unwrappedFilters.dateRange[1].toISOString().split('T')[0]
      }
    }
    
    const { data } = await axios.get(API_URL, { params })
    return data
  }

  const tasksQuery = useQuery({
    queryKey: ['tasks', filters],
    queryFn: fetchTasks,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const createTask = useMutation({
    mutationFn: (newTask: CreateTaskData) => axios.post(API_URL, newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const updateTask = useMutation({
    mutationFn: ({ id, ...updates }: UpdateTaskData) => 
      axios.put(`${API_URL}/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const deleteTask = useMutation({
    mutationFn: (id: string) => axios.delete(`${API_URL}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  return {
    tasksQuery,
    createTask,
    updateTask,
    deleteTask,
  }
} 