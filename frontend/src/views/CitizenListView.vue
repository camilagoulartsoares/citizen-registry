<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePageReady } from '@/composables/usePageReady'
import { useCitizen } from '@/composables/useCitizen'
import { useCpfMask } from '@/composables/useCpfMask'
import AppPageTabs from '@/components/AppPageTabs.vue'
import CitizenTable from '@/components/CitizenTable.vue'
import TablePagination from '@/components/TablePagination.vue'
import CitizenViewDialog from '@/components/CitizenViewDialog.vue'
import CitizenEditDialog from '@/components/CitizenEditDialog.vue'
import CitizenAttentionDialog from '@/components/CitizenAttentionDialog.vue'
import CitizenDeleteDialog from '@/components/CitizenDeleteDialog.vue'
import CitizenDeleteSuccessDialog from '@/components/CitizenDeleteSuccessDialog.vue'
import SkeletonListView from '@/components/skeleton/SkeletonListView.vue'

const { isPageReady } = usePageReady()

const {
  loading,
  error,
  clearError,
  listCitizens,
  updateCitizen,
  deleteCitizen,
  downloadCitizensCsv,
} = useCitizen()
const { mask, looksLikeCpf } = useCpfMask()

const citizens = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const limit = 10

const viewDialog = ref(false)
const editDialog = ref(false)
const attentionDialog = ref(false)
const deleteDialog = ref(false)
const deleteSuccessDialog = ref(false)
const editSuccess = ref(false)
const selectedCitizen = ref(null)
const deletedCitizen = ref(null)

const errorMessage = computed(() => error.value || '')

let debounceTimer = null

function onSearchInput(value) {
  searchQuery.value = looksLikeCpf(value) ? mask(value) : value
  currentPage.value = 1
  scheduleFetch()
}

function scheduleFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchCitizens, 400)
}

async function fetchCitizens() {
  try {
    const { citizens: data, pagination } = await listCitizens({
      page: currentPage.value,
      limit,
      query: searchQuery.value.trim(),
    })
    citizens.value = data
    totalPages.value = pagination.totalPages || 1
    totalItems.value = pagination.total
    currentPage.value = pagination.page
  } catch {
    citizens.value = []
  }
}

function onPageChange(page) {
  currentPage.value = page
  fetchCitizens()
}

async function handleDownloadCsv() {
  try {
    await downloadCitizensCsv(searchQuery.value.trim())
  } catch {
    // erro exibido pelo alerta
  }
}

function openView(citizenRow) {
  selectedCitizen.value = citizenRow
  viewDialog.value = true
}

function openEdit(citizenRow) {
  clearError()
  editSuccess.value = false
  selectedCitizen.value = { ...citizenRow }
  editDialog.value = true
}

function openDelete(citizenRow) {
  selectedCitizen.value = citizenRow
  attentionDialog.value = true
}

function proceedToDeleteConfirm() {
  attentionDialog.value = false
  deleteDialog.value = true
}

async function handleEditSave({ name, cpf }) {
  if (!selectedCitizen.value) return
  try {
    await updateCitizen(selectedCitizen.value.id, name, cpf)
    editSuccess.value = true
    await fetchCitizens()
    setTimeout(() => {
      editDialog.value = false
      editSuccess.value = false
    }, 1600)
  } catch {
    // erro exibido no modal
  }
}

async function handleDelete() {
  if (!selectedCitizen.value) return
  try {
    deletedCitizen.value = { ...selectedCitizen.value }
    await deleteCitizen(selectedCitizen.value.id)
    deleteDialog.value = false
    deleteSuccessDialog.value = true
    await fetchCitizens()
  } catch {
    // erro exibido na página
  }
}

function formatViewDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
}

onMounted(fetchCitizens)
</script>

<template>
  <SkeletonListView v-if="!isPageReady" />

  <div v-else>
    <AppPageTabs />

    <div class="list-header mb-5">
      <div>
        <h2 class="list-header__title">Cidadãos</h2>
        <p class="list-header__subtitle">
          Consulte os cidadãos cadastrados no sistema.
        </p>
      </div>
    </div>

    <div class="list-toolbar mb-4">
      <v-text-field
        :model-value="searchQuery"
        placeholder="Buscar por nome ou CPF"
        variant="outlined"
        density="comfortable"
        hide-details
        class="field-input list-toolbar__search"
        prepend-inner-icon="mdi-magnify"
        clearable
        :disabled="loading"
        @update:model-value="onSearchInput"
        @click:clear="onSearchInput('')"
      />
      <v-btn
        variant="outlined"
        color="primary"
        class="list-toolbar__btn text-none"
        prepend-icon="mdi-download"
        :loading="loading"
        :disabled="loading"
        @click="handleDownloadCsv"
      >
        Baixar CSV
      </v-btn>
      <v-btn
        to="/cadastrar"
        class="ui-btn-green list-toolbar__btn text-none"
        prepend-icon="mdi-plus"
      >
        Novo cidadão
      </v-btn>
    </div>

    <div class="ui-card pa-0 overflow-hidden list-card">
      <CitizenTable
        :citizens="citizens"
        :loading="loading"
        @view="openView"
        @edit="openEdit"
        @delete="openDelete"
      >
        <template #empty>
          <div class="text-center py-12 px-4">
            <v-icon size="64" color="#D1D5DB" class="mb-4">
              mdi-account-off-outline
            </v-icon>
            <h3 class="empty-title mb-2">Nenhum cidadão encontrado</h3>
            <p class="empty-subtitle mb-6">
              {{
                searchQuery
                  ? 'Tente ajustar os termos da busca.'
                  : 'Ainda não há cidadãos cadastrados no sistema.'
              }}
            </p>
            <v-btn to="/cadastrar" class="ui-btn-green text-none" prepend-icon="mdi-plus">
              Novo cidadão
            </v-btn>
          </div>
        </template>
      </CitizenTable>

      <v-divider />

      <TablePagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:current-page="onPageChange"
      />
    </div>

    <p class="list-meta mt-3">
      {{ totalItems }} {{ totalItems === 1 ? 'registro encontrado' : 'registros encontrados' }}
    </p>

    <CitizenViewDialog
      v-model="viewDialog"
      :citizen="selectedCitizen"
      :created-at-label="selectedCitizen ? formatViewDate(selectedCitizen.createdAt) : '—'"
    />

    <CitizenEditDialog
      v-model="editDialog"
      :citizen="selectedCitizen"
      :loading="loading"
      :error="errorMessage"
      :success="editSuccess"
      @save="handleEditSave"
      @clear-error="clearError"
    />

    <CitizenAttentionDialog
      v-model="attentionDialog"
      :citizen="selectedCitizen"
      @continue="proceedToDeleteConfirm"
    />

    <CitizenDeleteDialog
      v-model="deleteDialog"
      :citizen="selectedCitizen"
      :loading="loading"
      @confirm="handleDelete"
    />

    <CitizenDeleteSuccessDialog
      v-model="deleteSuccessDialog"
      :citizen="deletedCitizen"
    />
  </div>
</template>

<style scoped>
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
