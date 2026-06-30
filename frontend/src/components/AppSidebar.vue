<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SidebarCityArt from '@/components/SidebarCityArt.vue'

const route = useRoute()

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
  <aside class="app-sidebar">
    <div class="sidebar-brand">
      <div class="sidebar-brand__icon-wrap">
        <v-icon size="22" color="white">mdi-account-outline</v-icon>
      </div>
      <h1 class="sidebar-brand__title">Cadastro CPF</h1>
      <p class="sidebar-brand__subtitle">
        Sistema de cadastro e consulta de cidadãos
      </p>
    </div>

    <nav class="sidebar-nav">
      <router-link
        v-for="item in menuItems"
        :key="item.key"
        :to="item.to"
        class="sidebar-nav__item"
        :class="{ 'sidebar-nav__item--active': isActive(item.key) }"
      >
        <v-icon size="20" color="white">{{ item.icon }}</v-icon>
        <span>{{ item.title }}</span>
      </router-link>
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
          <span>Prefeitura Municipal</span>
        </div>
        <div class="sidebar-footer__item">
          <v-icon size="17" color="white">mdi-shield-check-outline</v-icon>
          <span>Ambiente Seguro</span>
        </div>
      </div>
    </div>
  </aside>
</template>
