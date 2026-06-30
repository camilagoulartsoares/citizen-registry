<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { title: 'Início', to: '/' },
  { title: 'Cadastrar cidadão', to: '/cadastrar' },
  { title: 'Lista de cidadãos', to: '/citizens' },
]

const activePath = computed(() => route.path)
</script>

<template>
  <nav class="page-tabs">
    <router-link
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      class="page-tabs__item"
      :class="{ 'page-tabs__item--active': activePath === tab.to }"
    >
      {{ tab.title }}
    </router-link>
  </nav>
</template>

<style scoped>
.page-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

.page-tabs__item {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.page-tabs__item:hover {
  color: var(--color-text);
}

.page-tabs__item--active {
  color: var(--color-text);
  font-weight: 600;
  border-bottom-color: var(--color-secondary);
}
</style>
