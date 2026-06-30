import { ref, onMounted } from 'vue'

const DEFAULT_MIN_MS = 320

export function usePageReady(minMs = DEFAULT_MIN_MS) {
  const isPageReady = ref(false)

  onMounted(() => {
    const startedAt = performance.now()

    requestAnimationFrame(() => {
      const remaining = Math.max(0, minMs - (performance.now() - startedAt))

      setTimeout(() => {
        isPageReady.value = true
      }, remaining)
    })
  })

  return { isPageReady }
}
