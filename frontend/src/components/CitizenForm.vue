<script setup>
import { ref, computed } from 'vue'
import { useCitizen } from '@/composables/useCitizen'
import { useCpfMask } from '@/composables/useCpfMask'

const { loading, error, clearError, createCitizen } = useCitizen()
const { mask, unmask, isValid } = useCpfMask()

const name = ref('')
const cpf = ref('')
const createdCitizen = ref(null)
const copySuccess = ref(false)

const nameRules = [
  (v) => !!v?.trim() || 'Nome é obrigatório',
  (v) => v.trim().length >= 3 || 'Nome deve ter no mínimo 3 caracteres',
]

const isNameValid = computed(() => name.value.trim().length >= 3)
const isCpfValid = computed(() => isValid(cpf.value))
const isFormValid = computed(() => isNameValid.value && isCpfValid.value)

const cpfFieldColor = computed(() => {
  const digits = unmask(cpf.value)
  if (digits.length === 0) return undefined
  return isCpfValid.value ? 'success' : 'error'
})

const cpfErrorMessage = computed(() => {
  const digits = unmask(cpf.value)
  if (digits.length === 0) return ''
  if (digits.length < 11) return 'CPF incompleto'
  if (!isCpfValid.value) return 'CPF inválido'
  return ''
})

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
    // Erro já tratado no composable
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
    <!-- Estado de sucesso -->
    <v-card
      v-if="createdCitizen"
      color="success"
      variant="tonal"
      class="pa-4"
    >
      <div class="d-flex align-center mb-3">
        <v-icon color="success" size="large" class="mr-2">mdi-check-circle</v-icon>
        <span class="text-h6 font-weight-medium">Cidadão cadastrado com sucesso!</span>
      </div>

      <v-divider class="mb-4" />

      <div class="mb-1 text-body-1 font-weight-medium">{{ createdCitizen.name }}</div>
      <div class="text-body-2 mb-4">CPF: {{ createdCitizen.cpfFormatted }}</div>

      <div class="d-flex flex-wrap ga-2">
        <v-btn
          variant="outlined"
          color="success"
          prepend-icon="mdi-content-copy"
          @click="copyCpf"
        >
          {{ copySuccess ? 'Copiado!' : 'Copiar CPF' }}
        </v-btn>
        <v-btn
          color="success"
          prepend-icon="mdi-plus"
          @click="resetForm"
        >
          Cadastrar novo
        </v-btn>
      </div>
    </v-card>

    <!-- Formulário -->
    <v-form v-else @submit.prevent="handleSubmit">
      <v-text-field
        v-model="name"
        label="Nome completo"
        placeholder="Digite o nome completo"
        prepend-inner-icon="mdi-account"
        :rules="nameRules"
        :disabled="loading"
        @update:model-value="onNameInput"
      />

      <v-text-field
        :model-value="cpf"
        label="CPF"
        placeholder="000.000.000-00"
        prepend-inner-icon="mdi-card-account-details"
        :color="cpfFieldColor"
        :error-messages="cpfErrorMessage"
        :disabled="loading"
        maxlength="14"
        @update:model-value="onCpfInput"
      >
        <template v-if="isCpfValid" #append-inner>
          <v-icon color="success">mdi-check-circle</v-icon>
        </template>
      </v-text-field>

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-4"
        closable
        @click:close="clearError"
      >
        {{ error }}
      </v-alert>

      <v-btn
        type="submit"
        color="primary"
        size="large"
        block
        :disabled="!isFormValid || loading"
        :loading="loading"
      >
        Cadastrar cidadão
      </v-btn>
    </v-form>
  </div>
</template>
