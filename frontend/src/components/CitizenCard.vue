<script setup>
import { computed } from 'vue'

const props = defineProps({
  citizen: {
    type: Object,
    required: true,
  },
  showDate: {
    type: Boolean,
    default: true,
  },
})

const formattedDate = computed(() => {
  if (!props.citizen?.createdAt) return '—'
  const date = new Date(props.citizen.createdAt)
  if (Number.isNaN(date.getTime())) return props.citizen.createdAt
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>

<template>
  <div class="citizen-card">
    <div class="d-flex align-center mb-3">
      <v-avatar color="primary" size="40" class="mr-3">
        <v-icon color="white" size="20">mdi-account-outline</v-icon>
      </v-avatar>
      <div>
        <div class="citizen-card__name">{{ citizen.name }}</div>
        <div class="citizen-card__cpf">CPF: {{ citizen.cpfFormatted }}</div>
      </div>
    </div>

    <v-divider v-if="showDate" class="mb-3" />

    <div v-if="showDate" class="citizen-card__date">
      <v-icon size="16" class="mr-1">mdi-calendar-outline</v-icon>
      Cadastrado em {{ formattedDate }}
    </div>
  </div>
</template>

<style scoped>
.citizen-card {
  background: #f9fafb;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
}

.citizen-card__name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.citizen-card__cpf {
  font-size: 13px;
  color: var(--color-text-muted);
}

.citizen-card__date {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--color-text-muted);
}
</style>
