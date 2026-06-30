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
  <v-card class="citizen-card pa-4" variant="outlined">
    <div class="d-flex align-center mb-3">
      <v-avatar color="primary" size="40" class="mr-3">
        <v-icon color="white">mdi-account</v-icon>
      </v-avatar>
      <div>
        <div class="text-subtitle-1 font-weight-medium">{{ citizen.name }}</div>
        <div class="text-body-2 text-medium-emphasis">CPF: {{ citizen.cpfFormatted }}</div>
      </div>
    </div>

    <v-divider v-if="showDate" class="mb-3" />

    <div v-if="showDate" class="d-flex align-center text-body-2 text-medium-emphasis">
      <v-icon size="small" class="mr-2">mdi-calendar</v-icon>
      Cadastrado em {{ formattedDate }}
    </div>
  </v-card>
</template>

<style scoped>
.citizen-card {
  background-color: #ffffff;
  border-color: rgba(27, 107, 74, 0.15) !important;
}
</style>
