import { ref } from 'vue'
import { citizenApi } from '@/services/api'
import { useCpfMask } from '@/composables/useCpfMask'
import { useSnackbar } from '@/composables/useSnackbar'

export function resolveApiError(err, fallback) {
  const status = err.response?.status
  const msg = String(err.userMessage ?? err.response?.data?.message ?? '').trim()
  const lower = msg.toLowerCase()

  if (status === 404 || lower.includes('não encontrado') || lower.includes('nao encontrado')) {
    return 'Cidadão não encontrado.'
  }

  if (status === 409 || lower.includes('cadastrado') || lower.includes('duplicad')) {
    return 'Este CPF já está cadastrado no sistema.'
  }

  if (lower.includes('mínimo 3') || lower.includes('minimo 3') || lower.includes('nome deve') || lower.includes('conter letras')) {
    return 'Nome deve ter no mínimo 3 caracteres e conter letras.'
  }

  if (lower.includes('cpf inválido') || lower.includes('cpf invalido')) {
    return 'CPF inválido.'
  }

  return msg || fallback
}

export function useCitizen() {
  const loading = ref(false)
  const error = ref(null)
  const { unmask, format } = useCpfMask()
  const { showSuccess, showError } = useSnackbar()

  function notifyError(message) {
    error.value = message
    showError(message)
  }

  function normalizeCitizen(raw) {
    if (!raw) return null
    return {
      id: raw.id,
      name: raw.name,
      cpf: raw.cpf,
      cpfFormatted: format(raw.cpf),
      createdAt: raw.createdAt ?? raw.created_at ?? raw.createdDate,
    }
  }

  function extractCitizens(response) {
    const data = response.data
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data?.citizens)) return data.citizens
    if (data?.citizen) return [data.citizen]
    if (data?.id) return [data]
    return []
  }

  function extractPagination(response) {
    const data = response.data
    if (data?.pagination) {
      return {
        total: data.pagination.total ?? 0,
        page: data.pagination.page ?? 1,
        limit: data.pagination.limit ?? 10,
        totalPages: data.pagination.totalPages ?? 1,
      }
    }
    return {
      total: data?.total ?? 0,
      page: data?.page ?? 1,
      limit: data?.limit ?? 10,
      totalPages: data?.totalPages ?? 1,
    }
  }

  function clearError() {
    error.value = null
  }

  async function createCitizen(name, cpf) {
    loading.value = true
    error.value = null
    try {
      const response = await citizenApi.create({
        name: name.trim(),
        cpf: unmask(cpf),
      })
      return normalizeCitizen(extractCitizens(response)[0] ?? response.data)
    } catch (err) {
      notifyError(resolveApiError(err, 'Erro ao cadastrar cidadão.'))
      throw err
    } finally {
      loading.value = false
    }
  }

  async function searchCitizen(query) {
    loading.value = true
    error.value = null
    try {
      const response = await citizenApi.search(query.trim())
      const citizens = extractCitizens(response).map(normalizeCitizen)
      if (citizens.length === 0) {
        notifyError('Cidadão não encontrado.')
        return null
      }
      return citizens[0]
    } catch (err) {
      notifyError(resolveApiError(err, 'Erro ao buscar cidadão.'))
      throw err
    } finally {
      loading.value = false
    }
  }

  async function listCitizens({ page = 1, limit = 10, query = '' } = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await citizenApi.list({ page, limit, query })
      return {
        citizens: extractCitizens(response).map(normalizeCitizen),
        pagination: extractPagination(response),
      }
    } catch (err) {
      notifyError(resolveApiError(err, 'Erro ao carregar lista de cidadãos.'))
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getCitizen(id) {
    loading.value = true
    error.value = null
    try {
      const response = await citizenApi.getById(id)
      return normalizeCitizen(response.data)
    } catch (err) {
      notifyError(resolveApiError(err, 'Erro ao carregar cidadão.'))
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCitizen(id, name, cpf) {
    loading.value = true
    error.value = null
    try {
      const response = await citizenApi.update(id, {
        name: name.trim(),
        cpf: unmask(cpf),
      })
      return normalizeCitizen(response.data)
    } catch (err) {
      notifyError(resolveApiError(err, 'Erro ao atualizar cidadão.'))
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCitizen(id) {
    loading.value = true
    error.value = null
    try {
      await citizenApi.remove(id)
    } catch (err) {
      notifyError(resolveApiError(err, 'Erro ao remover cidadão.'))
      throw err
    } finally {
      loading.value = false
    }
  }

  async function downloadCitizensCsv(query = '') {
    loading.value = true
    error.value = null
    try {
      const response = await citizenApi.exportCsv(query.trim())
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const date = new Date().toISOString().slice(0, 10)
      link.href = url
      link.download = `cidadaos_${date}.csv`
      link.click()
      URL.revokeObjectURL(url)
      showSuccess('Arquivo CSV baixado com sucesso.')
    } catch (err) {
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text()
          const json = JSON.parse(text)
          err.userMessage = json.message || json.error
        } catch {
          // mantém mensagem padrão
        }
      }
      notifyError(resolveApiError(err, 'Erro ao baixar arquivo CSV.'))
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    clearError,
    createCitizen,
    searchCitizen,
    listCitizens,
    getCitizen,
    updateCitizen,
    deleteCitizen,
    downloadCitizensCsv,
    normalizeCitizen,
  }
}
