<script setup>
import { useSnackbar } from '@/composables/useSnackbar'

const { visible, message, color, timeout, hide } = useSnackbar()
</script>

<template>
  <v-snackbar
    v-model="visible"
    :color="color"
    :timeout="timeout"
    location="top right"
    rounded="lg"
  >
    <div class="global-snackbar__message">{{ message }}</div>
    <template #actions>
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        aria-label="Fechar"
        @click="hide"
      />
    </template>
  </v-snackbar>
</template>

<style scoped>
.global-snackbar__message {
  font-size: 14px;
  font-weight: 500;
}
</style>
