import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}

    unobserve() {}

    disconnect() {}
  }
}
