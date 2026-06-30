import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import CitizenForm from '@/components/CitizenForm.vue'

const vuetify = createVuetify({ components, directives })

vi.mock('@/composables/useCitizen', () => ({
  useCitizen: () => ({
    loading: ref(false),
    clearError: vi.fn(),
    createCitizen: vi.fn(),
  }),
}))

function mountForm() {
  return mount(CitizenForm, {
    global: {
      plugins: [vuetify],
    },
  })
}

describe('CitizenForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exibe erro quando nome tem menos de 3 caracteres', async () => {
    const wrapper = mountForm()

    const nameInput = wrapper.find('input[placeholder="Digite o nome completo"]')
    await nameInput.setValue('Ab')
    await flushPromises()

    expect(wrapper.text()).toContain('Nome deve ter no mínimo 3 caracteres.')
  })

  it('mantém botão de cadastro desabilitado com nome inválido', async () => {
    const wrapper = mountForm()

    const nameInput = wrapper.find('input[placeholder="Digite o nome completo"]')
    await nameInput.setValue('Ab')
    await flushPromises()

    const submitBtn = wrapper.find('button[type="submit"]')
    expect(submitBtn.attributes('disabled')).toBeDefined()
  })
})
