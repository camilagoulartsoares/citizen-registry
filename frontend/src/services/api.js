import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

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
  create(data) {
    return api.post('/citizens', data)
  },

  search(query) {
    return api.get('/citizens', { params: { query } })
  },

  checkCpf(cpf) {
    return api.get(`/citizens/check-cpf/${cpf}`)
  },

  list({ page = 1, limit = 10, query = '' } = {}) {
    const params = { page, limit }
    if (query) {
      params.query = query
    }
    return api.get('/citizens', { params })
  },

  getById(id) {
    return api.get(`/citizens/${id}`)
  },

  update(id, data) {
    return api.put(`/citizens/${id}`, data)
  },

  remove(id) {
    return api.delete(`/citizens/${id}`)
  },

  exportCsv(query = '') {
    const params = {}
    if (query) {
      params.query = query
    }
    return api.get('/citizens/export', {
      params,
      responseType: 'blob',
    })
  },
}

export default api
