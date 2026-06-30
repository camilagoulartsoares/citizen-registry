<script setup>
import { computed } from 'vue'

const props = defineProps({
  citizens: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['view', 'edit', 'delete'])

const headers = [
  { title: 'Nome', key: 'name', sortable: false },
  { title: 'CPF', key: 'cpfFormatted', sortable: false },
  { title: 'Data de cadastro', key: 'createdAt', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
]

const tableItems = computed(() =>
  props.citizens.map((citizen) => ({
    ...citizen,
    createdAt: formatDate(citizen.createdAt),
  })),
)

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  const datePart = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const timePart = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${datePart} às ${timePart}`
}
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="tableItems"
    :loading="loading"
    :items-per-page="-1"
    loading-text=""
    hide-default-footer
    class="citizen-table"
  >
    <template #loading>
      <div class="citizen-table__skeleton">
        <v-skeleton-loader type="table-heading" class="mb-2" />
        <v-skeleton-loader
          v-for="n in 8"
          :key="n"
          type="table-row"
          class="citizen-table__skeleton-row"
        />
      </div>
    </template>

    <template #item.name="{ item }">
      <span class="table-name">{{ item.name }}</span>
    </template>

    <template #item.cpfFormatted="{ item }">
      <span class="table-cpf">{{ item.cpfFormatted }}</span>
    </template>

    <template #item.createdAt="{ item }">
      <span class="table-date">{{ item.createdAt }}</span>
    </template>

    <template #item.actions="{ item }">
      <div class="table-actions">
        <button
          type="button"
          class="table-actions__btn"
          title="Visualizar"
          @click="emit('view', item)"
        >
          <v-icon size="18" color="#6B7280">mdi-eye-outline</v-icon>
        </button>
        <button
          type="button"
          class="table-actions__btn"
          title="Editar"
          @click="emit('edit', item)"
        >
          <v-icon size="18" color="#6B7280">mdi-pencil-outline</v-icon>
        </button>
        <button
          type="button"
          class="table-actions__btn table-actions__btn--danger"
          title="Remover"
          @click="emit('delete', item)"
        >
          <v-icon size="18" color="#DC2626">mdi-trash-can-outline</v-icon>
        </button>
      </div>
    </template>

    <template #no-data>
      <slot name="empty" />
    </template>
  </v-data-table>
</template>

<style scoped>
.citizen-table {
  background: transparent;
}

.table-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}

.table-cpf,
.table-date {
  font-size: 14px;
  color: var(--color-text-muted);
}

.table-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.table-actions__btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.table-actions__btn:hover {
  background: var(--color-bg);
  border-color: var(--color-border);
}

.table-actions__btn--danger:hover {
  background: #fef2f2;
  border-color: #fecaca;
}

:deep(.v-data-table-header__content) {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
}

:deep(.v-data-table__td) {
  font-size: 14px;
  padding-top: 14px !important;
  padding-bottom: 14px !important;
}

.citizen-table__skeleton {
  padding: 8px 16px 16px;
}

.citizen-table__skeleton-row {
  margin-bottom: 4px;
}

:deep(.v-data-table__loading) {
  display: none;
}
</style>
