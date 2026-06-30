<script setup>
import { useSidebar } from '@/composables/useSidebar'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import GlobalSnackbar from '@/components/GlobalSnackbar.vue'

const { sidebarCollapsed } = useSidebar()
</script>

<template>
  <v-app class="app-root">
    <div
      class="app-shell"
      :class="{ 'app-shell--sidebar-collapsed': sidebarCollapsed }"
    >
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
