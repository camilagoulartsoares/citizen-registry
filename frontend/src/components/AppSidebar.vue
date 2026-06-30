<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SidebarCityArt from '@/components/SidebarCityArt.vue'
import { useSidebar } from '@/composables/useSidebar'

const route = useRoute()
const { sidebarCollapsed, toggleSidebar } = useSidebar()

const menuItems = [
  { key: 'inicio', title: 'Início', to: '/', icon: 'mdi-home-outline' },
  { key: 'cadastrar', title: 'Cadastrar cidadão', to: '/cadastrar', icon: 'mdi-account-plus-outline' },
  { key: 'consultar', title: 'Consultar CPF', to: '/consultar', icon: 'mdi-magnify' },
  { key: 'lista', title: 'Lista de cidadãos', to: '/citizens', icon: 'mdi-format-list-bulleted' },
]

const activeKey = computed(() => route.meta.menu ?? 'inicio')

function isActive(key) {
  return activeKey.value === key
}
</script>

<template>
  <aside
    class="app-sidebar"
    :class="{ 'app-sidebar--collapsed': sidebarCollapsed }"
  >
    <div class="sidebar-brand">
      <div class="sidebar-brand__header">
        <div class="sidebar-brand__icon-wrap">
          <v-icon size="22" color="white">mdi-account-outline</v-icon>
        </div>

        <button
          type="button"
          class="sidebar-toggle"
          :aria-label="sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'"
          :aria-expanded="!sidebarCollapsed"
          @click="toggleSidebar"
        >
          <v-icon size="20" color="white">
            {{ sidebarCollapsed ? 'mdi-menu' : 'mdi-menu-open' }}
          </v-icon>
        </button>
      </div>

      <div class="sidebar-brand__text">
        <h1 class="sidebar-brand__title">Cadastro CPF</h1>
        <p class="sidebar-brand__subtitle">
          Sistema de cadastro e consulta de cidadãos
        </p>
      </div>
    </div>

    <nav class="sidebar-nav" aria-label="Menu principal">
      <v-tooltip
        v-for="item in menuItems"
        :key="item.key"
        :text="item.title"
        location="end"
        :disabled="!sidebarCollapsed"
      >
        <template #activator="{ props: tooltipProps }">
          <router-link
            v-bind="tooltipProps"
            :to="item.to"
            class="sidebar-nav__item"
            :class="{ 'sidebar-nav__item--active': isActive(item.key) }"
            :aria-label="item.title"
          >
            <v-icon size="20" color="white">{{ item.icon }}</v-icon>
            <span class="sidebar-nav__label">{{ item.title }}</span>
          </router-link>
        </template>
      </v-tooltip>
    </nav>

    <div class="sidebar-bottom">
      <div class="sidebar-decoration">
        <div class="sidebar-decoration__glow sidebar-decoration__glow--outer" aria-hidden="true" />
        <div class="sidebar-decoration__glow" aria-hidden="true" />
        <SidebarCityArt />
      </div>

      <div class="sidebar-divider" role="separator" />

      <div class="sidebar-footer">
        <div class="sidebar-footer__item">
          <v-icon size="17" color="white">mdi-bank-outline</v-icon>
          <span class="sidebar-footer__label">Prefeitura Municipal</span>
        </div>
        <div class="sidebar-footer__item">
          <v-icon size="17" color="white">mdi-shield-check-outline</v-icon>
          <span class="sidebar-footer__label">Ambiente Seguro</span>
        </div>
      </div>
    </div>
  </aside>
</template>
