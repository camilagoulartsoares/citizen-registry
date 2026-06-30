<script setup>
import { ref, watch, computed } from 'vue'
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

const showNameInvalid = computed(() => {
  const length = name.value.trim().length
  return length > 0 && length < 3
})

const cpfDigits = computed(() => unmask(cpf.value))
const showCpfStatus = computed(() => cpfDigits.value.length > 0)
const showCpfInvalid = computed(() => showCpfStatus.value && !isValid(cpf.value))
const showCpfValid = computed(() => isValid(cpf.value))

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
      <label class="ui-field-label">Nome completo <span class="ui-required">*</span></label>
      <v-text-field
        v-model="name"
        variant="outlined"
        density="comfortable"
        hide-details
        class="field-input"
        :disabled="loading"
      />
      <div v-if="showNameInvalid" class="field-hint field-hint--error mt-2">
        <v-icon color="error" size="18">mdi-close-circle-outline</v-icon>
        <span>Nome deve ter no mínimo 3 caracteres.</span>
      </div>
    </div>

    <div class="mb-2">
      <label class="ui-field-label">CPF <span class="ui-required">*</span></label>
      <div class="cpf-row">
        <div class="cpf-row__field">
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
        <div v-if="showCpfInvalid" class="cpf-row__status">
          <v-icon color="error" size="20">mdi-close-circle-outline</v-icon>
          <span class="cpf-row__status-text cpf-row__status-text--error">CPF inválido</span>
        </div>
        <div v-else-if="showCpfValid" class="cpf-row__status">
          <v-icon color="success" size="20">mdi-check-circle-outline</v-icon>
          <span class="cpf-row__status-text cpf-row__status-text--success">CPF válido</span>
        </div>
      </div>
    </div>
  </div>
</template>
