<script setup>
import { ref } from 'vue'
import { useCitizen, resolveApiError } from '@/composables/useCitizen'
import { useCpfMask } from '@/composables/useCpfMask'
import CitizenCard from '@/components/CitizenCard.vue'

const { loading, clearError, searchCitizen } = useCitizen()
const { mask, looksLikeCpf } = useCpfMask()

const query = ref('')
const result = ref(null)
const searched = ref(false)
const searchError = ref(null)

function onQueryInput(value) {
  query.value = looksLikeCpf(value) ? mask(value) : value
  searchError.value = null
  clearError()
  searched.value = false
  result.value = null
}

async function handleSearch() {
  if (!query.value.trim()) return

  searched.value = false
  result.value = null
  searchError.value = null

  try {
    const found = await searchCitizen(query.value)
    searched.value = true
    if (!found) {
      searchError.value = 'Cidadão não encontrado.'
      return
    }
    result.value = found
  } catch (err) {
    searched.value = true
    searchError.value = resolveApiError(err, 'Erro ao buscar cidadão.')
  }
}
</script>

<template>
  <div>
    <v-form @submit.prevent="handleSearch">
      <div class="mb-6">
        <label class="ui-field-label">Buscar por nome ou CPF</label>
        <v-text-field
          :model-value="query"
          placeholder="Digite o nome completo ou CPF"
          variant="outlined"
          density="comfortable"
          hide-details
          class="field-input"
          prepend-inner-icon="mdi-magnify"
          :disabled="loading"
          @update:model-value="onQueryInput"
        />
      </div>

      <v-alert
        v-if="searchError"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-4"
        closable
        @click:close="searchError = null"
      >
        {{ searchError }}
      </v-alert>

      <v-btn
        type="submit"
        block
        class="ui-btn-primary"
        :disabled="!query.trim() || loading"
        :loading="loading"
      >
        Consultar
        <v-icon end size="18">mdi-magnify</v-icon>
      </v-btn>
    </v-form>

    <div v-if="result" class="mt-6">
      <CitizenCard :citizen="result" />
    </div>
  </div>
</template>
