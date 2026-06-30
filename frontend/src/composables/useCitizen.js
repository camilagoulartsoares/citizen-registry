import { ref } from 'vue'
import { citizenApi } from '@/services/api'
import { useCpfMask } from '@/composables/useCpfMask'

/**
 * Composable central para operações com cidadãos.
 * Encapsula chamadas HTTP, estados de loading e tratamento de erros.
 */
export function useCitizen() {
  const loading = ref(false)
  const error = ref(null)

  const { unmask, format } = useCpfMask()

  /**
   * Normaliza a resposta da API para um formato consistente de cidadão.
   */
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

  /**
   * Extrai lista de cidadãos de diferentes formatos de resposta.
   */
  function extractCitizens(response) {
    const data = response.data
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data?.citizens)) return data.citizens
    if (data?.citizen) return [data.citizen]
    if (data?.id) return [data]
    return []
  }

  /**
   * Extrai metadados de paginação da resposta.
   */
  function extractPagination(response) {
    const data = response.data
    if (data?.pagination) {
      return {
        total: data.pagination.total ?? data.pagination.totalItems ?? 0,
        page: data.pagination.page ?? data.pagination.currentPage ?? 1,
        limit: data.pagination.limit ?? data.pagination.perPage ?? 10,
        totalPages: data.pagination.totalPages ?? 1,
      }
    }
    return {
      total: data?.total ?? data?.totalItems ?? extractCitizens(response).length,
      page: data?.page ?? data?.currentPage ?? 1,
      limit: data?.limit ?? data?.perPage ?? 10,
      totalPages: data?.totalPages ?? 1,
    }
  }

  function clearError() {
    error.value = null
  }

  /**
   * Cadastra um novo cidadão.
   */
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
      const status = err.response?.status
      if (status === 409 || status === 400) {
        const msg = err.userMessage?.toLowerCase() ?? ''
        if (msg.includes('cpf') || msg.includes('duplicad') || msg.includes('exist')) {
          error.value = 'Este CPF já está cadastrado no sistema.'
        } else {
          error.value = err.userMessage
        }
      } else {
        error.value = err.userMessage ?? 'Erro ao cadastrar cidadão.'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Busca cidadão por nome ou CPF.
   */
  async function searchCitizen(query) {
    loading.value = true
    error.value = null

    try {
      const response = await citizenApi.search(query.trim())
      const citizens = extractCitizens(response).map(normalizeCitizen)

      // Retorna o primeiro resultado ou null se vazio
      return citizens.length > 0 ? citizens[0] : null
    } catch (err) {
      error.value = err.userMessage ?? 'Erro ao buscar cidadão.'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Lista cidadãos com paginação e filtro opcional.
   */
  async function listCitizens({ page = 1, limit = 10, query = '' } = {}) {
    loading.value = true
    error.value = null

    try {
      const response = await citizenApi.list({ page, limit, query })
      const citizens = extractCitizens(response).map(normalizeCitizen)
      const pagination = extractPagination(response)

      return { citizens, pagination }
    } catch (err) {
      error.value = err.userMessage ?? 'Erro ao carregar lista de cidadãos.'
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
    normalizeCitizen,
  }
}
