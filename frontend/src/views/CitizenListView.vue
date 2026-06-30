<script setup>
import { ref, watch, onMounted } from 'vue'
import { useCitizen } from '@/composables/useCitizen'
import { useCpfMask } from '@/composables/useCpfMask'
import CitizenTable from '@/components/CitizenTable.vue'

const { loading, error, clearError, listCitizens } = useCitizen()
const { mask, looksLikeCpf } = useCpfMask()

const citizens = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const limit = 10

let debounceTimer = null

function onSearchInput(value) {
  searchQuery.value = looksLikeCpf(value) ? mask(value) : value
  currentPage.value = 1
  scheduleFetch()
}

function scheduleFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    fetchCitizens()
  }, 400)
}

async function fetchCitizens() {
  try {
    const { citizens: data, pagination } = await listCitizens({
      page: currentPage.value,
      limit,
      query: searchQuery.value.trim(),
    })
    citizens.value = data
    totalPages.value = pagination.totalPages || Math.ceil(pagination.total / limit) || 1
    totalItems.value = pagination.total
  } catch {
    citizens.value = []
  }
}

function onPageChange(page) {
  currentPage.value = page
  fetchCitizens()
}

onMounted(() => {
  fetchCitizens()
})

watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<template>
  <div>
    <div class="ui-card mb-4">
      <label class="ui-field-label">Buscar por nome ou CPF</label>
      <v-text-field
        :model-value="searchQuery"
        placeholder="Filtrar em tempo real..."
        variant="outlined"
        density="comfortable"
        hide-details
        class="field-input"
        prepend-inner-icon="mdi-magnify"
        clearable
        :disabled="loading"
        @update:model-value="onSearchInput"
        @click:clear="onSearchInput('')"
      />
      <p class="list-meta mt-3 mb-0">
        {{ totalItems }} {{ totalItems === 1 ? 'registro encontrado' : 'registros encontrados' }}
      </p>
    </div>

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="clearError"
    >
      {{ error }}
    </v-alert>

    <div class="ui-card pa-0 overflow-hidden">
      <CitizenTable :citizens="citizens" :loading="loading">
        <template #empty>
          <div class="text-center py-12 px-4">
            <v-icon size="64" color="#D1D5DB" class="mb-4">
              mdi-account-off-outline
            </v-icon>
            <h3 class="empty-title mb-2">
              Nenhum cidadão encontrado
            </h3>
            <p class="empty-subtitle mb-6">
              {{
                searchQuery
                  ? 'Tente ajustar os termos da busca.'
                  : 'Ainda não há cidadãos cadastrados no sistema.'
              }}
            </p>
            <v-btn to="/cadastrar" class="ui-btn-primary text-none" prepend-icon="mdi-account-plus-outline">
              Cadastrar primeiro cidadão
            </v-btn>
          </div>
        </template>
      </CitizenTable>

      <v-divider v-if="totalPages > 1" />

      <div v-if="totalPages > 1" class="d-flex justify-center pa-4">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="5"
          color="primary"
          rounded="circle"
          @update:model-value="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-meta {
  font-size: 13px;
  color: var(--color-text-muted);
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
}

.empty-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
}
</style>
