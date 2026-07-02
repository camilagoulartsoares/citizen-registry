import { ref } from 'vue'
import api from '@/services/api'

const WARMUP_TIMEOUT_MS = 90000

/** @type {import('vue').Ref<'connecting' | 'ready' | 'failed'>} */
export const connectionState = ref(import.meta.env.PROD ? 'connecting' : 'ready')

let warmupPromise = null

/** Acorda o backend no Render (plano free dorme após ~15 min sem uso). */
export function warmBackend() {
  if (!import.meta.env.PROD) {
    connectionState.value = 'ready'
    return Promise.resolve(true)
  }

  if (warmupPromise) return warmupPromise

  connectionState.value = 'connecting'

  warmupPromise = api
    .get('/health', { timeout: WARMUP_TIMEOUT_MS })
    .then(() => {
      connectionState.value = 'ready'
      return true
    })
    .catch(() => {
      connectionState.value = 'failed'
      return false
    })

  return warmupPromise
}

export function whenBackendReady() {
  if (!import.meta.env.PROD) return Promise.resolve(true)
  if (connectionState.value === 'ready') return Promise.resolve(true)
  if (connectionState.value === 'failed') return Promise.resolve(false)
  return warmBackend()
}

export function retryWarmBackend() {
  if (!import.meta.env.PROD) return Promise.resolve(true)
  warmupPromise = null
  connectionState.value = 'connecting'
  return warmBackend()
}
