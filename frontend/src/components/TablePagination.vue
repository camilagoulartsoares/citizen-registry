<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
})

const emit = defineEmits(['update:currentPage'])

const pages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items = [1]
  if (current > 3) items.push('...')
  if (current > 2 && current < total - 1) items.push(current)
  if (current <= 2) items.push(2, 3)
  if (current >= total - 1) items.push(total - 2, total - 1)
  if (current < total - 2) items.push('...')
  if (!items.includes(total)) items.push(total)

  return [...new Set(items)]
})

function goTo(page) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('update:currentPage', page)
}
</script>

<template>
  <div v-if="totalPages > 1" class="table-pagination">
    <button
      type="button"
      class="table-pagination__nav"
      :disabled="currentPage <= 1"
      @click="goTo(currentPage - 1)"
    >
      <v-icon size="18">mdi-chevron-left</v-icon>
    </button>

    <template v-for="(page, index) in pages" :key="`${page}-${index}`">
      <span v-if="page === '...'" class="table-pagination__ellipsis">...</span>
      <button
        v-else
        type="button"
        class="table-pagination__page"
        :class="{ 'table-pagination__page--active': page === currentPage }"
        @click="goTo(page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      type="button"
      class="table-pagination__nav"
      :disabled="currentPage >= totalPages"
      @click="goTo(currentPage + 1)"
    >
      <v-icon size="18">mdi-chevron-right</v-icon>
    </button>
  </div>
</template>

<style scoped>
.table-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  padding: 16px 20px;
}

.table-pagination__nav,
.table-pagination__page {
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: #fff;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.table-pagination__nav:hover:not(:disabled),
.table-pagination__page:hover:not(.table-pagination__page--active) {
  background: #f9fafb;
}

.table-pagination__nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.table-pagination__page--active {
  background: var(--color-secondary);
  border-color: var(--color-secondary);
  color: #fff;
  font-weight: 600;
}

.table-pagination__ellipsis {
  min-width: 24px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 14px;
}
</style>
