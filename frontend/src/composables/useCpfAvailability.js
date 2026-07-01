import { ref } from 'vue'
import { citizenApi } from '@/services/api'
import { useCpfMask } from '@/composables/useCpfMask'

export function useCpfAvailability(getExcludeCpf = () => null) {
  const { unmask, isValid } = useCpfMask()
  const isRegistered = ref(false)
  const checking = ref(false)

  let debounceId = null
  let requestId = 0

  function resolveExcludeCpf() {
    return typeof getExcludeCpf === 'function' ? getExcludeCpf() : getExcludeCpf
  }

  function reset() {
    isRegistered.value = false
    checking.value = false
    if (debounceId) {
      clearTimeout(debounceId)
      debounceId = null
    }
  }

  function scheduleCheck(cpfValue) {
    if (debounceId) {
      clearTimeout(debounceId)
    }

    isRegistered.value = false

    if (!isValid(cpfValue)) {
      checking.value = false
      return
    }

    const digits = unmask(cpfValue)
    const excludeCpf = resolveExcludeCpf()
    if (excludeCpf && unmask(excludeCpf) === digits) {
      checking.value = false
      return
    }

    checking.value = true
    const currentRequest = ++requestId

    debounceId = setTimeout(async () => {
      try {
        const response = await citizenApi.checkCpf(digits)
        const found = Boolean(response.data?.exists)

        if (currentRequest === requestId) {
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
    }, 400)
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
