<script setup>
import { ref, watch } from 'vue'
import { useCpfMask } from '@/composables/useCpfMask'

const props = defineProps({
  citizen: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['save'])

const { mask, unmask, isValid } = useCpfMask()

const name = ref('')
const cpf = ref('')

watch(
  () => props.citizen,
  (citizen) => {
    if (citizen) {
      name.value = citizen.name
      cpf.value = mask(citizen.cpf)
    }
  },
  { immediate: true },
)

const isFormValid = () => name.value.trim().length >= 3 && isValid(cpf.value)

function onCpfInput(value) {
  cpf.value = mask(value)
}

function handleSave() {
  if (!isFormValid()) return
  emit('save', { name: name.value, cpf: cpf.value })
}

defineExpose({ submit: handleSave })
</script>

<template>
  <div>
    <div class="mb-4">
      <label class="ui-field-label">Nome completo</label>
      <v-text-field
        v-model="name"
        variant="outlined"
        density="comfortable"
        hide-details
        class="field-input"
        :disabled="loading"
      />
    </div>
    <div class="mb-2">
      <label class="ui-field-label">CPF</label>
      <v-text-field
        :model-value="cpf"
        variant="outlined"
        density="comfortable"
        hide-details
        class="field-input"
        maxlength="14"
        :disabled="loading"
        @update:model-value="onCpfInput"
      />
    </div>
  </div>
</template>
