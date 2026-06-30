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
  <div class="citizen-form-wrapper" :class="{ 'citizen-form-wrapper--success': createdCitizen }">
    <div v-if="createdCitizen" class="success-panel">
      <div class="success-panel__badge">
        <v-icon color="success" size="20">mdi-check-circle-outline</v-icon>
        <span>Cidadão cadastrado com sucesso!</span>
      </div>

      <div class="success-panel__details">
        <div class="success-panel__name">{{ createdCitizen.name }}</div>
        <div class="success-panel__cpf">CPF: {{ createdCitizen.cpfFormatted }}</div>
      </div>

      <div class="success-panel__actions">
        <v-btn
          variant="outlined"
          color="primary"
          class="success-panel__btn success-panel__btn--outline text-none"
          @click="copyCpf"
        >
          <v-icon start size="18">mdi-content-copy</v-icon>
          {{ copySuccess ? 'Copiado!' : 'Copiar CPF' }}
        </v-btn>
        <v-btn
          class="success-panel__btn success-panel__btn--primary text-none ui-btn-primary"
          @click="resetForm"
        >
          Cadastrar novo
          <v-icon end size="18">mdi-plus</v-icon>
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
.citizen-form-wrapper--success {
  align-self: flex-start;
  width: 100%;
}

.success-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.success-panel__badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.4;
}

.success-panel__details {
  padding: 16px 18px;
  border-radius: 12px;
  background: var(--color-success-soft);
  border: 1px solid rgba(141, 198, 63, 0.22);
}

.success-panel__name {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.35;
  margin-bottom: 4px;
}

.success-panel__cpf {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
  line-height: 1.4;
}

.success-panel__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
}

.success-panel__btn {
  height: 44px !important;
  min-height: 44px !important;
  border-radius: 12px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  letter-spacing: 0 !important;
}

.success-panel__btn--outline {
  border-width: 1.5px !important;
}

.success-panel__btn--primary {
  box-shadow: none !important;
}

@media (max-width: 600px) {
  .success-panel__actions {
    grid-template-columns: 1fr;
  }
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
