import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useCitizen, resolveApiError } from '@/composables/useCitizen'
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
})
