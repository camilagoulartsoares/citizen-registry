<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { title: 'Início', to: '/', icon: 'mdi-home' },
  { title: 'Lista de Cidadãos', to: '/citizens', icon: 'mdi-format-list-bulleted' },
]

const pageTitle = computed(() => route.meta.title ?? 'Cadastro de Cidadãos')
</script>

<template>
  <v-app>
    <v-app-bar color="primary" elevation="2" height="64">
      <v-app-bar-title class="font-weight-bold">
        <v-icon class="mr-2">mdi-shield-account</v-icon>
        Cadastro de Cidadãos
      </v-app-bar-title>

      <template #append>
        <v-btn
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          variant="text"
          color="white"
          class="mx-1"
        >
          <v-icon start>{{ item.icon }}</v-icon>
          <span class="d-none d-sm-inline">{{ item.title }}</span>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main style="background-color: #f5f5f5">
      <v-container class="py-8" style="max-width: 1200px">
        <router-view />
      </v-container>
    </v-main>

    <v-footer app color="primary" class="justify-center py-3">
      <span class="text-caption text-white">
        Sistema de Cadastro de Cidadãos &mdash; {{ pageTitle }}
      </span>
    </v-footer>
  </v-app>
</template>
