import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

/**
 * Extrai mensagem de erro legível a partir da resposta da API.
 */
function extractErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.response?.data?.error) {
    return error.response.data.error
  }
  if (error.message === 'Network Error') {
    return 'Não foi possível conectar ao servidor. Verifique se o backend está em execução.'
  }
  return 'Ocorreu um erro inesperado. Tente novamente.'
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.userMessage = extractErrorMessage(error)
    return Promise.reject(error)
  },
)

export const citizenApi = {
  /**
   * Cadastra um novo cidadão.
   * @param {{ name: string, cpf: string }} data
   */
  create(data) {
    return api.post('/citizens', data)
  },

  /**
   * Busca cidadãos por nome ou CPF.
   * @param {string} query
   */
  search(query) {
    return api.get('/citizens', { params: { query } })
  },

  /**
   * Lista cidadãos com paginação e filtro opcional.
   * @param {{ page?: number, limit?: number, query?: string }} params
   */
  list({ page = 1, limit = 10, query = '' } = {}) {
    const params = { page, limit }
    if (query) {
      params.query = query
    }
    return api.get('/citizens', { params })
  },
}

export default api
