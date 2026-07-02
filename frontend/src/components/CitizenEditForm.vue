<script setup>
import { ref, watch, computed } from 'vue'
import { useCpfMask } from '@/composables/useCpfMask'
import { useCpfAvailability } from '@/composables/useCpfAvailability'
import { useCpfFormField } from '@/composables/useCpfFormField'
import { isValidName, NAME_VALIDATION_MESSAGE } from '@/composables/useNameValidation'

const props = defineProps({
  citizen: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['save'])

const { mask, unmask, isValid } = useCpfMask()
const {
  isRegistered: cpfRegistered,
  checking: cpfChecking,
  scheduleCheck,
  reset: resetCpfCheck,
} = useCpfAvailability(() => props.citizen?.cpf ?? null)

const name = ref('')
const cpf = ref('')

const { cpfFieldRef, onCpfInput, onCpfBlur } = useCpfFormField(cpf, {
  scheduleCheck,
  resetCpfCheck,
})

watch(
  () => props.citizen,
  (citizen) => {
    if (citizen) {
      name.value = citizen.name
      cpf.value = mask(citizen.cpf)
      resetCpfCheck()
    }
  },
  { immediate: true },
)

const showNameInvalid = computed(() => {
  const trimmed = name.value.trim()
  return trimmed.length > 0 && !isValidName(name.value)
})

const cpfDigits = computed(() => unmask(cpf.value))
const showCpfStatus = computed(() => cpfDigits.value.length > 0)
const showCpfInvalid = computed(() => showCpfStatus.value && !isValid(cpf.value))
const showCpfDuplicate = computed(() => isValid(cpf.value) && cpfRegistered.value)
const showCpfValid = computed(
  () => isValid(cpf.value) && !cpfRegistered.value && !cpfChecking.value,
)

const isFormValid = () =>
  isValidName(name.value) && isValid(cpf.value) && !cpfRegistered.value && !cpfChecking.value

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
        <span>{{ NAME_VALIDATION_MESSAGE }}</span>
      </div>
    </div>

    <div class="mb-2">
      <label class="ui-field-label">CPF <span class="ui-required">*</span></label>
      <div class="cpf-row">
        <div class="cpf-row__field">
          <v-text-field
            ref="cpfFieldRef"
            :model-value="cpf"
            variant="outlined"
            density="comfortable"
            hide-details
            class="field-input cpf-field-autofill"
            maxlength="14"
            :disabled="loading"
            @update:model-value="onCpfInput"
            @blur="onCpfBlur"
          />
        </div>
        <div v-if="showCpfInvalid" class="cpf-row__status">
          <v-icon color="error" size="20">mdi-close-circle-outline</v-icon>
          <span class="cpf-row__status-text cpf-row__status-text--error">CPF inválido</span>
        </div>
        <div v-else-if="showCpfDuplicate" class="cpf-row__status">
          <v-icon color="error" size="20">mdi-close-circle-outline</v-icon>
          <span class="cpf-row__status-text cpf-row__status-text--error">
            Este CPF já está cadastrado no sistema.
          </span>
        </div>
        <div v-else-if="cpfChecking" class="cpf-row__status">
          <v-progress-circular indeterminate size="18" width="2" color="primary" />
          <span class="cpf-row__status-text">Verificando CPF...</span>
        </div>
        <div v-else-if="showCpfValid" class="cpf-row__status">
          <v-icon color="success" size="20">mdi-check-circle-outline</v-icon>
          <span class="cpf-row__status-text cpf-row__status-text--success">CPF válido</span>
        </div>
      </div>
    </div>
  </div>
</template>
