import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCitizen, resolveApiError, CITIZEN_NOT_FOUND_MESSAGE, CSV_EXPORT_EMPTY_MESSAGE } from '@/composables/useCitizen'
import { citizenApi } from '@/services/api'

const showError = vi.fn()
const showSuccess = vi.fn()

vi.mock('@/services/api', () => ({
  citizenApi: {
    create: vi.fn(),
    search: vi.fn(),
    list: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    exportCsv: vi.fn(),
  },
}))

vi.mock('@/composables/useSnackbar', () => ({
  useSnackbar: () => ({
    showSuccess,
    showError,
  }),
}))

describe('useCitizen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('resolveApiError', () => {
    it('mapeia erro 404 para a mensagem exata do enunciado', () => {
      const message = resolveApiError({
        response: {
          status: 404,
          data: { message: 'Cidadão não encontrado' },
        },
      }, 'fallback')

      expect(message).toBe(CITIZEN_NOT_FOUND_MESSAGE)
      expect(message).toBe('Cidadão não encontrado')
    })

    it('mapeia erro de CPF duplicado (409)', () => {
      const message = resolveApiError({
        response: {
          status: 409,
          data: { message: 'Este CPF já está cadastrado no sistema.' },
        },
      }, 'fallback')

      expect(message).toBe('Este CPF já está cadastrado no sistema.')
    })
  })

  describe('searchCitizen', () => {
    it('exibe mensagem exata quando a busca não retorna resultados', async () => {
      citizenApi.search.mockResolvedValue({ data: [] })

      const { searchCitizen, error } = useCitizen()
      const result = await searchCitizen('000.000.000-00')

      expect(result).toBeNull()
      expect(error.value).toBe('Cidadão não encontrado')
      expect(showError).toHaveBeenCalledWith('Cidadão não encontrado')
    })
  })

  describe('createCitizen', () => {
    it('trata erro de CPF duplicado na API', async () => {
      citizenApi.create.mockRejectedValue({
        response: {
          status: 409,
          data: { message: 'Este CPF já está cadastrado no sistema.' },
        },
        userMessage: 'Este CPF já está cadastrado no sistema.',
      })

      const { createCitizen, error } = useCitizen()

      await expect(
        createCitizen('Maria Silva', '529.982.247-25'),
      ).rejects.toBeDefined()

      expect(error.value).toBe('Este CPF já está cadastrado no sistema.')
      expect(showError).toHaveBeenCalledWith('Este CPF já está cadastrado no sistema.')
      expect(citizenApi.create).toHaveBeenCalledWith({
        name: 'Maria Silva',
        cpf: '52998224725',
      })
    })
  })

  describe('downloadCitizensCsv', () => {
    it('exibe mensagem quando não há cidadãos cadastrados', async () => {
      citizenApi.list.mockResolvedValue({
        data: {
          data: [],
          pagination: { total: 0, page: 1, limit: 1, totalPages: 0 },
        },
      })

      const { downloadCitizensCsv, error } = useCitizen()
      await downloadCitizensCsv()

      expect(citizenApi.exportCsv).not.toHaveBeenCalled()
      expect(error.value).toBe(CSV_EXPORT_EMPTY_MESSAGE)
      expect(showError).toHaveBeenCalledWith(CSV_EXPORT_EMPTY_MESSAGE)
    })
  })
})
