<template>
  <div class="task-card">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold">Task Management</h3>
      <Button
        icon="pi pi-plus"
        label="Add Task"
        @click="showCreateForm = true"
      />
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mb-6">
      <div class="flex-1 min-w-48">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Filter by Priority
        </label>
        <Dropdown
          v-model="priority"
          :options="priorityFilterOptions"
          option-label="label"
          option-value="value"
          placeholder="All Priority Levels"
          class="w-full"
        />
      </div>
      
      <div class="flex-1 min-w-48">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Date Range
        </label>
        <Calendar
          v-model="sanitizedDateRange"
          selection-mode="range"
          :show-icon="true"
          placeholder="Select date range"
          class="w-full"
        />
      </div>
      
      <div class="flex items-end">
        <Button
          icon="pi pi-times"
          label="Clear Filters"
          severity="secondary"
          @click="clearAllFilters"
        />
      </div>
    </div>

    <!-- Data Table -->
    <DataTable
      :value="filteredTasks"
      :loading="isLoading"
      :paginator="true"
      :rows="10"
      :rows-per-page-options="[5, 10, 20, 50]"
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      current-page-report-template="Showing {first} to {last} of {totalRecords} tasks"
      :global-filter-fields="['title', 'description']"
      class="p-datatable-sm"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <h5 class="text-lg font-semibold">Tasks</h5>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText 
          readonly 
          placeholder="Search tasks disabled" 
          class="w-64" 
        />
          </span>
        </div>
      </template>

      <Column field="id" header="ID" sortable style="width: 80px">
        <template #body="{ data }">
          <span class="font-mono text-sm">{{ data.id }}</span>
        </template>
      </Column>

      <Column field="title" header="Title" sortable>
        <template #body="{ data }">
          <div class="font-medium">{{ data.title }}</div>
        </template>
      </Column>

      <Column field="description" header="Description" sortable>
        <template #body="{ data }">
          <div class="text-gray-600 text-sm line-clamp-2">
            {{ data.description }}
          </div>
        </template>
      </Column>

      <Column field="priority" header="Priority" sortable style="width: 120px">
        <template #body="{ data }">
          <Tag
            :value="data.priority"
            :severity="getPrioritySeverity(data.priority)"
            class="capitalize"
          />
        </template>
      </Column>

      <Column field="status" header="Status" sortable style="width: 120px">
        <template #body="{ data }">
          <Tag
            :value="data.status"
            :severity="getStatusSeverity(data.status)"
            class="capitalize"
          />
        </template>
      </Column>

      <Column field="assigned_to" header="Assigned To" sortable style="width: 120px">
        <template #body="{ data }">
          <span class="text-sm">{{ data.assigned_to || data.assignedTo || '-' }}</span>
        </template>
      </Column>

      <Column field="estimated_hours" header="Hours" sortable style="width: 80px">
        <template #body="{ data }">
          <span class="text-sm font-medium">{{ data.estimated_hours ?? data.estimatedHours ?? '-' }}h</span>
        </template>
      </Column>

      <Column field="due_date" header="Due Date" sortable style="width: 120px">
        <template #body="{ data }">
          <span v-if="data.due_date || data.dueDate" class="text-sm text-gray-500">
            {{ formatDate(data.due_date || data.dueDate) }}
          </span>
          <span v-else class="text-sm text-gray-400">No due date</span>
        </template>
      </Column>

      <Column field="created_at" header="Created" sortable style="width: 140px">
        <template #body="{ data }">
          <span class="text-sm text-gray-500">
            {{ formatDate(data.created_at || data.createdAt) }}
          </span>
        </template>
      </Column>

      <Column header="Actions" style="width: 120px">
        <template #body="{ data }">
          <div class="flex space-x-2">
            <Button
              icon="pi pi-pencil"
              size="small"
              severity="secondary"
              @click="editTask(data)"
            />
            <Button
              icon="pi pi-trash"
              size="small"
              severity="danger"
              @click="confirmDelete(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Task Form Dialog -->
    <TaskForm
      :visible="showCreateForm"
      @update:visible="showCreateForm = $event"
      :task="editingTask"
      @saved="handleTaskSaved"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import axios from 'axios'
import TaskForm from './TaskForm.vue'
import { useTaskFilters } from '../composables/useTaskFilters'

const { priority, dateRange, filteredTasks, isLoading, refetch } = useTaskFilters()

const showCreateForm = ref(false)
const editingTask = ref(null)

const priorityFilterOptions = [
  { label: 'All Priority Levels', value: null },
  { label: 'High Priority', value: 'HIGH' },
  { label: 'Medium Priority', value: 'MEDIUM' },
  { label: 'Low Priority', value: 'LOW' }
]

const getPrioritySeverity = (priority: string) => {
  switch (priority) {
    case 'HIGH': return 'danger'
    case 'MEDIUM': return 'warning'
    case 'LOW': return 'success'
    default: return 'info'
  }
}

const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'DONE': return 'success'
    case 'IN_PROGRESS': return 'warning'
    case 'TODO': return 'info'
    default: return 'info'
  }
}

const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) return 'No date';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString();
};

const editTask = (task) => {
  editingTask.value = task
  showCreateForm.value = true
}

const confirmDelete = (task) => {
  confirm.require({
    message: `Are you sure you want to delete task \"${task.title}\"?`,
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await axios.delete(`http://localhost:3000/tasks/${task.id}`)
      refetch()
    },
    reject: () => {}
  })
}

const handleTaskSaved = () => {
  editingTask.value = null
  refetch()
}

const clearAllFilters = () => {
  priority.value = null
  dateRange.value = null
}

const sanitizedDateRange = computed({
  get() {
    if (!dateRange.value) return null;
    return [
      dateRange.value[0] instanceof Date ? dateRange.value[0] : (dateRange.value[0] ? new Date(dateRange.value[0]) : null),
      dateRange.value[1] instanceof Date ? dateRange.value[1] : (dateRange.value[1] ? new Date(dateRange.value[1]) : null)
    ];
  },
  set(val) {
    dateRange.value = val;
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>