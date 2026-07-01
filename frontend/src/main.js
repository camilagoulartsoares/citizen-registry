import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@/assets/styles/main.css'
import { loadSavedTheme } from '@/composables/useAppTheme'
import { warmBackend } from '@/services/warmup'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#2E5FA8',
          secondary: '#8DC63F',
          success: '#8DC63F',
          error: '#DC2626',
          background: '#F8F9FA',
          surface: '#FFFFFF',
        },
      },
      dark: {
        colors: {
          primary: '#5B8FD4',
          secondary: '#8DC63F',
          success: '#8DC63F',
          error: '#F87171',
          background: '#0F172A',
          surface: '#1E293B',
        },
      },
    },
  },
  defaults: {
    VCard: {
      elevation: 0,
      rounded: 'lg',
    },
    VBtn: {
      rounded: 'lg',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
  },
})

loadSavedTheme(vuetify.theme)

if (import.meta.env.PROD) {
  warmBackend()
}

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.mount('#app')
