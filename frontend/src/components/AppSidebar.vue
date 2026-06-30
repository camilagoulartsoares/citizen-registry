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
      <v-icon class="sidebar-brand__icon" size="28" color="white">
        mdi-account-group-outline
      </v-icon>
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
        <SidebarCityArt />
      </div>

      <div class="sidebar-footer">
        <div class="sidebar-footer__item">
          <v-icon size="18" color="rgba(255,255,255,0.85)">mdi-bank-outline</v-icon>
          <span>Prefeitura Municipal</span>
        </div>
        <div class="sidebar-footer__item">
          <v-icon size="18" color="rgba(255,255,255,0.85)">mdi-shield-check-outline</v-icon>
          <span>Ambiente Seguro</span>
        </div>
      </div>
    </div>
  </aside>
</template>
