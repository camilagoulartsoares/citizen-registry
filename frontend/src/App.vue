<script setup>
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <v-app class="app-root">
    <div class="app-shell">
      <AppSidebar />

      <main class="app-main">
        <div class="app-content">
          <AppHeader />
          <router-view />
        </div>
      </main>
    </div>
  </v-app>
</template>
