import { ref } from 'vue'
import { citizenApi } from '@/services/api'
import { useCpfMask } from '@/composables/useCpfMask'

export function useCitizen() {
  const loading = ref(false)
  const error = ref(null)

  const { unmask, format } = useCpfMask()

  function normalizeCitizen(raw) {
    if (!raw) return null
    return {
      id: raw.id,
      name: raw.name,
      cpf: raw.cpf,
      cpfFormatted: format(raw.cpf),
      createdAt: raw.createdAt ?? raw.created_at ?? raw.createdDate,
      paymentStatus: raw.paymentStatus ?? raw.payment_status ?? 'pending',
      paidAt: raw.paidAt ?? raw.paid_at ?? null,
      isPaid: (raw.paymentStatus ?? raw.payment_status) === 'paid',
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

  async function searchCitizen(query) {
    loading.value = true
    error.value = null
    try {
      const response = await citizenApi.search(query.trim())
      const citizens = extractCitizens(response).map(normalizeCitizen)
      return citizens.length > 0 ? citizens[0] : null
    } catch (err) {
      error.value = err.userMessage ?? 'Erro ao buscar cidadão.'
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
      error.value = err.userMessage ?? 'Erro ao carregar lista de cidadãos.'
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
      error.value = err.userMessage ?? 'Erro ao carregar cidadão.'
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
      error.value = err.userMessage ?? 'Erro ao atualizar cidadão.'
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
      error.value = err.userMessage ?? 'Erro ao remover cidadão.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function confirmPayment(id) {
    loading.value = true
    error.value = null
    try {
      const response = await citizenApi.confirmPayment(id)
      return normalizeCitizen(response.data)
    } catch (err) {
      error.value = err.userMessage ?? 'Erro ao confirmar pagamento.'
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
    confirmPayment,
    normalizeCitizen,
  }
}
