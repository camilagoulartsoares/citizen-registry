import { computed } from 'vue'
import {
  connectionState,
  warmBackend,
  whenBackendReady,
  retryWarmBackend,
} from '@/services/warmup'

export function useBackendConnection() {
  const state = connectionState

  const isConnecting = computed(() => state.value === 'connecting')
  const isReady = computed(() => state.value === 'ready')
  const isFailed = computed(() => state.value === 'failed')

  return {
    state,
    isConnecting,
    isReady,
    isFailed,
    warmBackend,
    whenBackendReady,
    retryWarmBackend,
  }
}
