import { ref } from 'vue'
import { citizenApi } from '@/services/api'
import { useCpfMask } from '@/composables/useCpfMask'
import { whenBackendReady } from '@/services/warmup'

/** Enquanto digita — evita spam a cada tecla */
const DEBOUNCE_TYPING_MS = 400
/** CPF completo (paste/autofill) — resposta quase imediata */
const DEBOUNCE_COMPLETE_MS = 50

export function useCpfAvailability(getExcludeCpf = () => null) {
  const { unmask, isValid } = useCpfMask()
  const isRegistered = ref(false)
  const checking = ref(false)

  let debounceId = null
  let requestId = 0
  let lastCheckedDigits = ''
  let lastCheckResult = false

  function resolveExcludeCpf() {
    return typeof getExcludeCpf === 'function' ? getExcludeCpf() : getExcludeCpf
  }

  function reset() {
    isRegistered.value = false
    checking.value = false
    lastCheckedDigits = ''
    lastCheckResult = false
    if (debounceId) {
      clearTimeout(debounceId)
      debounceId = null
    }
  }

  function scheduleCheck(cpfValue) {
    if (debounceId) {
      clearTimeout(debounceId)
      debounceId = null
    }

    if (!isValid(cpfValue)) {
      isRegistered.value = false
      checking.value = false
      lastCheckedDigits = ''
      return
    }

    const digits = unmask(cpfValue)
    const excludeCpf = resolveExcludeCpf()
    if (excludeCpf && unmask(excludeCpf) === digits) {
      isRegistered.value = false
      checking.value = false
      return
    }

    if (digits === lastCheckedDigits) {
      isRegistered.value = lastCheckResult
      checking.value = false
      return
    }

    isRegistered.value = false
    checking.value = true
    const currentRequest = ++requestId
    const delay = digits.length === 11 ? DEBOUNCE_COMPLETE_MS : DEBOUNCE_TYPING_MS

    debounceId = setTimeout(async () => {
      debounceId = null

      const ready = import.meta.env.PROD ? await whenBackendReady() : true
      if (currentRequest !== requestId) return
      if (!ready) {
        checking.value = false
        return
      }

      try {
        const response = await citizenApi.checkCpf(digits)
        const found = Boolean(response.data?.exists)

        if (currentRequest === requestId) {
          lastCheckedDigits = digits
          lastCheckResult = found
          isRegistered.value = found
        }
      } catch {
        if (currentRequest === requestId) {
          isRegistered.value = false
        }
      } finally {
        if (currentRequest === requestId) {
          checking.value = false
        }
      }
    }, delay)
  }

  function markRegistered() {
    isRegistered.value = true
    checking.value = false
  }

  return {
    isRegistered,
    checking,
    scheduleCheck,
    reset,
    markRegistered,
  }
}
