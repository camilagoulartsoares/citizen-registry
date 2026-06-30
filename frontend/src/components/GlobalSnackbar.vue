<script setup>
import { useSnackbar } from '@/composables/useSnackbar'

const { visible, message, color, timeout, hide } = useSnackbar()
</script>

<template>
  <v-snackbar
    v-model="visible"
    :color="color"
    :timeout="timeout"
    location="bottom end"
    rounded="lg"
    elevation="12"
    content-class="global-snackbar"
    min-width="320"
    max-width="440"
    multi-line
  >
    <div class="global-snackbar__message">{{ message }}</div>
    <template #actions>
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        color="white"
        aria-label="Fechar"
        @click="hide"
      />
    </template>
  </v-snackbar>
</template>

<style scoped>
.global-snackbar__message {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;
  padding-right: 4px;
}
</style>

<style>
.global-snackbar {
  margin: 0 28px 32px 0 !important;
  z-index: 10000 !important;
  box-shadow:
    0 12px 32px rgba(15, 23, 42, 0.18),
    0 4px 12px rgba(15, 23, 42, 0.1) !important;
}

.global-snackbar .v-snackbar__content {
  padding: 14px 8px 14px 18px !important;
}

@media (max-width: 960px) {
  .global-snackbar {
    margin: 0 16px 24px 16px !important;
  }
}
</style>
