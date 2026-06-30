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
    <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between mb-6 ga-4">
      <div>
        <h1 class="text-h5 font-weight-bold text-primary mb-1">
          Lista de Cidadãos
        </h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          {{ totalItems }} {{ totalItems === 1 ? 'registro encontrado' : 'registros encontrados' }}
        </p>
      </div>

      <v-btn
        to="/"
        variant="outlined"
        color="primary"
        prepend-icon="mdi-arrow-left"
      >
        Voltar ao início
      </v-btn>
    </div>

    <v-card class="pa-4 mb-4">
      <v-text-field
        :model-value="searchQuery"
        label="Buscar por nome ou CPF"
        placeholder="Filtrar em tempo real..."
        prepend-inner-icon="mdi-magnify"
        clearable
        hide-details
        :disabled="loading"
        @update:model-value="onSearchInput"
        @click:clear="onSearchInput('')"
      />
    </v-card>

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

    <v-card>
      <CitizenTable :citizens="citizens" :loading="loading">
        <template #empty>
          <div class="text-center py-12 px-4">
            <v-icon size="80" color="grey-lighten-1" class="mb-4">
              mdi-account-off-outline
            </v-icon>
            <h3 class="text-h6 text-medium-emphasis mb-2">
              Nenhum cidadão encontrado
            </h3>
            <p class="text-body-2 text-medium-emphasis mb-6">
              {{
                searchQuery
                  ? 'Tente ajustar os termos da busca.'
                  : 'Ainda não há cidadãos cadastrados no sistema.'
              }}
            </p>
            <v-btn to="/" color="primary" prepend-icon="mdi-account-plus">
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
          rounded
          @update:model-value="onPageChange"
        />
      </div>
    </v-card>
  </div>
</template>
