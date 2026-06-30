import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
const color = ref('success')
const timeout = ref(4000)

export function useSnackbar() {
  function show(msg, type = 'success') {
    message.value = msg
    color.value = type === 'error' ? 'error' : type === 'info' ? 'info' : 'success'
    visible.value = true
  }

  function showSuccess(msg) {
    show(msg, 'success')
  }

  function showError(msg) {
    show(msg, 'error')
  }

  function showInfo(msg) {
    show(msg, 'info')
  }

  function hide() {
    visible.value = false
  }

  return {
    visible,
    message,
    color,
    timeout,
    show,
    showSuccess,
    showError,
    showInfo,
    hide,
  }
}
