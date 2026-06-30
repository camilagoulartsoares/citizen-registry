<script setup>
import { ref, computed } from 'vue'
import { useCitizen } from '@/composables/useCitizen'
import { useCpfMask } from '@/composables/useCpfMask'
import { useCpfAvailability } from '@/composables/useCpfAvailability'
import { isValidName, NAME_VALIDATION_MESSAGE } from '@/composables/useNameValidation'

const {
  loading,
  clearError,
  createCitizen,
} = useCitizen()
const { mask, unmask, isValid } = useCpfMask()
const {
  isRegistered: cpfRegistered,
  checking: cpfChecking,
  scheduleCheck,
  reset: resetCpfCheck,
  markRegistered: markCpfRegistered,
} = useCpfAvailability()

const name = ref('')
const cpf = ref('')
const createdCitizen = ref(null)
const copySuccess = ref(false)

const isNameValid = computed(() => isValidName(name.value))
const isCpfValid = computed(() => isValid(cpf.value))
const isFormValid = computed(
  () => isNameValid.value && isCpfValid.value && !cpfRegistered.value && !cpfChecking.value,
)

const showNameInvalid = computed(() => {
  const trimmed = name.value.trim()
  return trimmed.length > 0 && !isValidName(name.value)
})

const cpfDigits = computed(() => unmask(cpf.value))
const showCpfStatus = computed(() => cpfDigits.value.length > 0)
const showCpfInvalid = computed(() => showCpfStatus.value && !isCpfValid.value)
const showCpfDuplicate = computed(() => isCpfValid.value && cpfRegistered.value)
const showCpfValid = computed(
  () => isCpfValid.value && !cpfRegistered.value && !cpfChecking.value,
)

function onCpfInput(value) {
  cpf.value = mask(value)
  clearError()
  resetCpfCheck()
  scheduleCheck(cpf.value)
}

function onNameInput() {
  clearError()
}

async function handleSubmit() {
  if (!isFormValid.value) return

  try {
    createdCitizen.value = await createCitizen(name.value, cpf.value)
  } catch (err) {
    if (err?.response?.status === 409) {
      markCpfRegistered()
    }
  }
}

async function copyCpf() {
  if (!createdCitizen.value) return
  try {
    await navigator.clipboard.writeText(createdCitizen.value.cpfFormatted)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch {
    // Fallback silencioso
  }
}

function resetForm() {
  name.value = ''
  cpf.value = ''
  createdCitizen.value = null
  resetCpfCheck()
  clearError()
}
</script>

<template>
  <div>
    <div v-if="createdCitizen" class="success-panel">
      <div class="d-flex align-center mb-3">
        <v-icon color="success" size="22" class="mr-2">mdi-check-circle-outline</v-icon>
        <span class="success-panel__title">Cidadão cadastrado com sucesso!</span>
      </div>

      <div class="success-panel__name">{{ createdCitizen.name }}</div>
      <div class="success-panel__cpf mb-4">CPF: {{ createdCitizen.cpfFormatted }}</div>

      <div class="d-flex flex-wrap ga-2">
        <v-btn
          variant="outlined"
          color="primary"
          size="small"
          class="text-none"
          @click="copyCpf"
        >
          {{ copySuccess ? 'Copiado!' : 'Copiar CPF' }}
        </v-btn>
        <v-btn
          color="primary"
          size="small"
          class="text-none ui-btn-primary"
          @click="resetForm"
        >
          Cadastrar novo
        </v-btn>
      </div>
    </div>

    <v-form v-else class="citizen-form" @submit.prevent="handleSubmit">
      <div class="mb-5 form-field">
        <label class="ui-field-label">Nome completo</label>
        <v-text-field
          v-model="name"
          placeholder="Digite o nome completo"
          variant="outlined"
          density="comfortable"
          hide-details
          class="field-input"
          prepend-inner-icon="mdi-account-outline"
          :disabled="loading"
          @update:model-value="onNameInput"
        />
        <div class="field-hint-slot" aria-live="polite">
          <div
            class="field-hint field-hint--error"
            :class="{ 'field-hint--hidden': !showNameInvalid }"
          >
            <v-icon color="error" size="18">mdi-close-circle-outline</v-icon>
            <span>{{ NAME_VALIDATION_MESSAGE }}</span>
          </div>
        </div>
      </div>

      <div class="mb-6 form-field">
        <label class="ui-field-label">CPF</label>
        <v-text-field
          :model-value="cpf"
          placeholder="000.000.000-00"
          variant="outlined"
          density="comfortable"
          hide-details
          class="field-input"
          prepend-inner-icon="mdi-card-account-details-outline"
          :disabled="loading"
          maxlength="14"
          @update:model-value="onCpfInput"
        />
        <div class="field-hint-slot field-hint-slot--cpf" aria-live="polite">
          <div
            class="field-hint field-hint--error"
            :class="{ 'field-hint--hidden': !showCpfInvalid }"
          >
            <v-icon color="error" size="20">mdi-close-circle-outline</v-icon>
            <span>CPF inválido</span>
          </div>

          <div
            class="field-hint field-hint--error"
            :class="{ 'field-hint--hidden': !showCpfDuplicate }"
          >
            <v-icon color="error" size="20">mdi-close-circle-outline</v-icon>
            <span>Este CPF já está cadastrado no sistema.</span>
          </div>

          <div
            class="field-hint field-hint--checking"
            :class="{ 'field-hint--hidden': !cpfChecking }"
          >
            <v-progress-circular indeterminate size="18" width="2" color="primary" />
            <span>Verificando CPF...</span>
          </div>

          <div
            class="field-hint field-hint--success"
            :class="{ 'field-hint--hidden': !showCpfValid }"
          >
            <v-icon color="success" size="20">mdi-check-circle-outline</v-icon>
            <span>CPF válido</span>
          </div>
        </div>
      </div>

      <v-btn
        type="submit"
        block
        class="ui-btn-primary citizen-form__submit"
        :disabled="!isFormValid || loading"
        :loading="loading"
      >
        Cadastrar cidadão
        <v-icon end size="18">mdi-arrow-right</v-icon>
      </v-btn>
    </v-form>
  </div>
</template>

<style scoped>
.success-panel {
  padding: 8px 0;
}

.success-panel__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.success-panel__name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
}

.success-panel__cpf {
  font-size: 14px;
  color: var(--color-text-muted);
}

.citizen-form {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.citizen-form__submit {
  margin-top: auto;
}
</style>
