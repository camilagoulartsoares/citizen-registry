<script setup>
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import GlobalSnackbar from '@/components/GlobalSnackbar.vue'
</script>

<template>
  <v-app class="app-root">
    <div class="app-shell">
      <AppSidebar />

      <main class="app-main">
        <div class="app-content">
          <AppHeader />
          <router-view v-slot="{ Component }">
            <transition name="route-fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>

    <GlobalSnackbar />
  </v-app>
</template>

<style>
.route-fade-enter-active,
.route-fade-leave-active {
  transition: opacity 0.2s ease;
}

.route-fade-enter-from,
.route-fade-leave-to {
  opacity: 0;
}
</style>
