<script setup>
import { ref, computed } from 'vue'
import { useCitizen } from '@/composables/useCitizen'
import { useCpfMask } from '@/composables/useCpfMask'

const {
  loading,
  clearError,
  createCitizen,
} = useCitizen()
const { mask, unmask, isValid } = useCpfMask()

const name = ref('')
const cpf = ref('')
const createdCitizen = ref(null)
const copySuccess = ref(false)

const isNameValid = computed(() => name.value.trim().length >= 3)
const isCpfValid = computed(() => isValid(cpf.value))
const isFormValid = computed(() => isNameValid.value && isCpfValid.value)

const showNameInvalid = computed(() => {
  const length = name.value.trim().length
  return length > 0 && length < 3
})

const cpfDigits = computed(() => unmask(cpf.value))
const showCpfStatus = computed(() => cpfDigits.value.length > 0)
const showCpfInvalid = computed(() => showCpfStatus.value && !isCpfValid.value)
const showCpfValid = computed(() => isCpfValid.value)

function onCpfInput(value) {
  cpf.value = mask(value)
  clearError()
}

function onNameInput() {
  clearError()
}

async function handleSubmit() {
  if (!isFormValid.value) return

  try {
    createdCitizen.value = await createCitizen(name.value, cpf.value)
  } catch {
    // feedback via snackbar global
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

    <v-form v-else @submit.prevent="handleSubmit">
      <div class="mb-5">
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
        <div v-if="showNameInvalid" class="field-hint field-hint--error mt-2">
          <v-icon color="error" size="18">mdi-close-circle-outline</v-icon>
          <span>Nome deve ter no mínimo 3 caracteres.</span>
        </div>
      </div>

      <div class="mb-6">
        <label class="ui-field-label">CPF</label>
        <div class="cpf-row">
          <div class="cpf-row__field">
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

      <v-btn
        type="submit"
        block
        class="ui-btn-primary"
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
</style>
