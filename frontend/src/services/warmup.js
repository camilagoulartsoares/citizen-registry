import api from '@/services/api'

let warmupStarted = false

/** Acorda o backend no Render (plano free dorme após ~15 min sem uso). */
export function warmBackend() {
  if (warmupStarted) return
  warmupStarted = true

  api.get('/health', { timeout: 90000 }).catch(() => {})
}
