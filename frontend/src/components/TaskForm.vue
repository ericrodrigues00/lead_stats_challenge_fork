<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="isEditing ? 'Edit Task' : 'Create New Task'"
    modal
    class="w-full max-w-2xl"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Title -->
        <div class="md:col-span-2">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <InputText
            id="title"
            v-model="form.title"
            class="w-full"
            :class="{ 'p-invalid': errors.title }"
            placeholder="Enter task title"
          />
          <small v-if="errors.title" class="text-red-500">{{ errors.title }}</small>
        </div>

        <!-- Description -->
        <div class="md:col-span-2">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            id="description"
            v-model="form.description"
            class="w-full"
            rows="3"
            placeholder="Enter task description"
          />
        </div>

        <!-- Urgency -->
        <div>
          <label for="urgency" class="block text-sm font-medium text-gray-700 mb-1">
            Urgency *
          </label>
          <Dropdown
            id="urgency"
            v-model="form.urgency"
            :options="urgencyOptions"
            option-label="label"
            option-value="value"
            placeholder="Select urgency level"
            class="w-full"
            :class="{ 'p-invalid': errors.urgency }"
          />
          <small v-if="errors.urgency" class="text-red-500">{{ errors.urgency }}</small>
        </div>

        <!-- Status -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <Dropdown
            id="status"
            v-model="form.status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            placeholder="Select status"
            class="w-full"
            :class="{ 'p-invalid': errors.status }"
          />
          <small v-if="errors.status" class="text-red-500">{{ errors.status }}</small>
        </div>

        <!-- Assigned To -->
        <div>
          <label for="assignedTo" class="block text-sm font-medium text-gray-700 mb-1">
            Assigned To *
          </label>
          <InputText
            id="assignedTo"
            v-model="form.assignedTo"
            class="w-full"
            :class="{ 'p-invalid': errors.assignedTo }"
            placeholder="Enter assignee name"
          />
          <small v-if="errors.assignedTo" class="text-red-500">{{ errors.assignedTo }}</small>
        </div>

        <!-- Estimated Hours -->
        <div>
          <label for="estimatedHours" class="block text-sm font-medium text-gray-700 mb-1">
            Estimated Hours *
          </label>
          <InputNumber
            id="estimatedHours"
            v-model="form.estimatedHours"
            class="w-full"
            :class="{ 'p-invalid': errors.estimatedHours }"
            placeholder="Enter estimated hours"
            :min="0.5"
            :step="0.5"
          />
          <small v-if="errors.estimatedHours" class="text-red-500">{{ errors.estimatedHours }}</small>
        </div>

        <!-- Due Date -->
        <div>
          <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <Calendar
            id="dueDate"
            v-model="form.dueDate"
            class="w-full"
            :show-icon="true"
            placeholder="Select due date"
            :min-date="new Date()"
          />
        </div>

        <!-- Tags -->
        <div class="md:col-span-2">
          <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <Chips
            v-model="form.tags"
            class="w-full"
            placeholder="Type and press Enter to add tags"
            :add-on-blur="true"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          severity="secondary"
          @click="handleCancel"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          :loading="isSubmitting"
        >
          {{ isEditing ? 'Update' : 'Create' }}
        </Button>
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Chips from 'primevue/chips'
import Button from 'primevue/button'
import { useTasks } from '../composables/useTasks'
import type { Task, CreateTaskData, UpdateTaskData } from '../composables/useTasks'

interface Props {
  visible: boolean
  task?: Task | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'saved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { createTask, updateTask } = useTasks()

const isEditing = computed(() => !!props.task)
const isSubmitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  urgency: 'medium' as 'high' | 'medium' | 'low',
  status: 'TODO' as 'TODO' | 'IN_PROGRESS' | 'DONE',
  assignedTo: '',
  estimatedHours: 1,
  dueDate: null as Date | null,
  tags: [] as string[]
})

const errors = reactive({
  title: '',
  urgency: '',
  status: '',
  assignedTo: '',
  estimatedHours: ''
})

const urgencyOptions = [
  { label: 'High Urgency', value: 'high' },
  { label: 'Medium Urgency', value: 'medium' },
  { label: 'Low Urgency', value: 'low' }
]

const statusOptions = [
  { label: 'To Do', value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Done', value: 'DONE' }
]

// Reset form when dialog opens/closes
watch(() => props.visible, (newVisible) => {
  if (newVisible && props.task) {
    // Editing mode
    form.title = props.task.title
    form.description = props.task.description
    form.urgency = mapPriorityToUrgency(props.task.priority)
    form.status = props.task.status
    form.assignedTo = props.task.assigned_to || props.task.assignedTo || ''
    form.estimatedHours = props.task.estimated_hours ?? props.task.estimatedHours ?? 1
    form.dueDate = props.task.due_date
      ? new Date(props.task.due_date)
      : props.task.dueDate
        ? new Date(props.task.dueDate)
        : null
    form.tags = props.task.tags || []
  } else if (newVisible && !props.task) {
    // Create mode
    resetForm()
  }
})

const mapPriorityToUrgency = (priority: string): 'high' | 'medium' | 'low' => {
  switch (priority) {
    case 'HIGH': return 'high'
    case 'MEDIUM': return 'medium'
    case 'LOW': return 'low'
    default: return 'medium'
  }
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.urgency = 'medium'
  form.status = 'TODO'
  form.assignedTo = ''
  form.estimatedHours = 1
  form.dueDate = null
  form.tags = []
  errors.title = ''
  errors.urgency = ''
  errors.status = ''
  errors.assignedTo = ''
  errors.estimatedHours = ''
}

const validateForm = () => {
  let isValid = true
  errors.title = ''
  errors.urgency = ''
  errors.status = ''
  errors.assignedTo = ''
  errors.estimatedHours = ''

  if (!form.title.trim()) {
    errors.title = 'Title is required'
    isValid = false
  }

  if (!form.urgency) {
    errors.urgency = 'Urgency level is required'
    isValid = false
  }

  if (!form.status) {
    errors.status = 'Status is required'
    isValid = false
  }

  if (!form.assignedTo.trim()) {
    errors.assignedTo = 'Assignee is required'
    isValid = false
  }

  if (!form.estimatedHours || form.estimatedHours <= 0) {
    errors.estimatedHours = 'Estimated hours must be greater than 0'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const taskData = {
      title: form.title,
      description: form.description,
      urgency: form.urgency,
      status: form.status,
      assignedTo: form.assignedTo,
      estimatedHours: form.estimatedHours,
      dueDate: form.dueDate,
      tags: form.tags
    }

    if (isEditing.value && props.task) {
      await updateTask.mutateAsync({
        id: props.task.id,
        ...taskData
      })
    } else {
      await createTask.mutateAsync(taskData)
    }

    emit('saved')
    emit('update:visible', false)
    resetForm()
  } catch (error) {
    console.error('Error saving task:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  emit('update:visible', false)
  resetForm()
}
</script> 