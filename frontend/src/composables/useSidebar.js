import { ref } from 'vue'

const STORAGE_KEY = 'cadastro-cpf-sidebar-collapsed'

const sidebarCollapsed = ref(sessionStorage.getItem(STORAGE_KEY) === 'true')

export function useSidebar() {
  function persistSidebarState() {
    sessionStorage.setItem(STORAGE_KEY, String(sidebarCollapsed.value))
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
    persistSidebarState()
  }

  function setSidebarCollapsed(value) {
    sidebarCollapsed.value = Boolean(value)
    persistSidebarState()
  }

  return {
    sidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
  }
}
