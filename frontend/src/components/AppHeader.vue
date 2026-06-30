<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppTheme } from '@/composables/useAppTheme'
import { useSidebar } from '@/composables/useSidebar'

const route = useRoute()
const { isDark, toggleTheme } = useAppTheme()
const { sidebarCollapsed, toggleSidebar } = useSidebar()

const title = computed(() => route.meta.title ?? 'Início')
const subtitle = computed(() => route.meta.subtitle ?? 'Bem-vindo ao Cadastro CPF')
</script>

<template>
  <header class="app-header">
    <div class="app-header__leading">
      <v-btn
        icon="mdi-menu"
        variant="text"
        color="default"
        class="app-header__menu-btn"
        :aria-label="sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'"
        @click="toggleSidebar"
      />

      <div>
        <h1 class="app-header__title">{{ title }}</h1>
        <p class="app-header__subtitle">{{ subtitle }}</p>
      </div>
    </div>

    <div class="app-header__actions">
      <v-btn
        :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        variant="text"
        color="default"
        class="app-header__theme-btn"
        :aria-label="isDark ? 'Ativar tema claro' : 'Ativar tema escuro'"
        @click="toggleTheme"
      />

      <div class="app-header__user">
        <div class="app-header__avatar">
          <v-icon size="22" color="#6B7280">mdi-account-outline</v-icon>
        </div>
        <div class="app-header__user-info">
          <div class="app-header__user-name">Administrador</div>
          <div class="app-header__user-role">Prefeitura Municipal</div>
        </div>
        <v-icon class="app-header__chevron" size="16" color="#9CA3AF">
          mdi-chevron-down
        </v-icon>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header__leading {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.app-header__menu-btn {
  flex-shrink: 0;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-header__theme-btn {
  flex-shrink: 0;
}

@media (max-width: 960px) {
  .app-header__menu-btn {
    display: none;
  }
}
</style>
