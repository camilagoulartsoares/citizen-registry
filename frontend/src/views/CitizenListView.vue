<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCitizen } from '@/composables/useCitizen'
import { useCpfMask } from '@/composables/useCpfMask'
import AppPageTabs from '@/components/AppPageTabs.vue'
import CitizenTable from '@/components/CitizenTable.vue'
import TablePagination from '@/components/TablePagination.vue'
import CitizenEditDialog from '@/components/CitizenEditDialog.vue'
import CitizenAttentionDialog from '@/components/CitizenAttentionDialog.vue'
import CitizenDeleteDialog from '@/components/CitizenDeleteDialog.vue'
import CitizenDeleteSuccessDialog from '@/components/CitizenDeleteSuccessDialog.vue'

const {
  loading,
  error,
  clearError,
  listCitizens,
  updateCitizen,
  deleteCitizen,
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
  <div>
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
        to="/cadastrar"
        class="ui-btn-green list-toolbar__btn text-none"
        prepend-icon="mdi-plus"
      >
        Novo cidadão
      </v-btn>
    </div>

    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="clearError"
    >
      {{ errorMessage }}
    </v-alert>

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

    <!-- Visualizar -->
    <v-dialog v-model="viewDialog" max-width="480">
      <v-card class="pa-6" rounded="lg">
        <h3 class="dialog-title mb-4">Detalhes do cidadão</h3>
        <div v-if="selectedCitizen" class="dialog-details">
          <div class="dialog-row">
            <span class="dialog-label">Nome</span>
            <span>{{ selectedCitizen.name }}</span>
          </div>
          <div class="dialog-row">
            <span class="dialog-label">CPF</span>
            <span>{{ selectedCitizen.cpfFormatted }}</span>
          </div>
          <div class="dialog-row">
            <span class="dialog-label">Data de cadastro</span>
            <span>{{ formatViewDate(selectedCitizen.createdAt) }}</span>
          </div>
        </div>
        <div class="d-flex justify-end mt-4">
          <v-btn variant="text" class="text-none" @click="viewDialog = false">Fechar</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Editar -->
    <CitizenEditDialog
      v-model="editDialog"
      :citizen="selectedCitizen"
      :loading="loading"
      :error="errorMessage"
      :success="editSuccess"
      @save="handleEditSave"
      @clear-error="clearError"
    />

    <!-- Atenção -->
    <CitizenAttentionDialog
      v-model="attentionDialog"
      :citizen="selectedCitizen"
      @continue="proceedToDeleteConfirm"
    />

    <!-- Confirmar exclusão -->
    <CitizenDeleteDialog
      v-model="deleteDialog"
      :citizen="selectedCitizen"
      :loading="loading"
      @confirm="handleDelete"
    />

    <!-- Exclusão com sucesso -->
    <CitizenDeleteSuccessDialog
      v-model="deleteSuccessDialog"
      :citizen="deletedCitizen"
    />
  </div>
</template>

<style scoped>
.list-header__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 4px;
}

.list-header__subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
}

.list-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.list-toolbar__search {
  flex: 1;
}

.list-toolbar__btn {
  flex-shrink: 0;
  min-width: 150px;
}

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

.dialog-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
}

.dialog-text {
  font-size: 14px;
  color: var(--color-text-muted);
}

.dialog-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dialog-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
  color: var(--color-text);
}

.dialog-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

@media (max-width: 640px) {
  .list-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .list-toolbar__btn {
    width: 100%;
  }
}
</style>
