<script setup>
import { computed } from 'vue'

const props = defineProps({
  citizens: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['row-click'])

const headers = [
  { title: 'Nome', key: 'name', sortable: false },
  { title: 'CPF', key: 'cpfFormatted', sortable: false },
  { title: 'Data de cadastro', key: 'createdAt', sortable: false },
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
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="tableItems"
    :loading="loading"
    :items-per-page="-1"
    hide-default-footer
    class="citizen-table"
    hover
    @click:row="(_, { item }) => emit('row-click', item)"
  >
    <template #loading>
      <v-skeleton-loader type="table-row@5" />
    </template>

    <template #item.name="{ item }">
      <div class="d-flex align-center py-2">
        <v-avatar color="primary" size="32" class="mr-3">
          <v-icon color="white" size="small">mdi-account-outline</v-icon>
        </v-avatar>
        <span class="table-name">{{ item.name }}</span>
      </div>
    </template>

    <template #item.cpfFormatted="{ item }">
      <v-chip size="small" variant="tonal" color="primary" class="font-weight-medium">
        {{ item.cpfFormatted }}
      </v-chip>
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

:deep(.v-data-table-header__content) {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
}

:deep(.v-data-table__td) {
  font-size: 14px;
  color: var(--color-text);
}
</style>
