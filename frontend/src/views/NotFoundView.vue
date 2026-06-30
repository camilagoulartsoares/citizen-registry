<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <div class="not-found__icon-wrap">
      <v-icon size="48" color="primary">mdi-map-marker-question-outline</v-icon>
    </div>
    <h2 class="not-found__title">Página não encontrada</h2>
    <p class="not-found__text">
      O endereço que você acessou não existe ou foi movido.
    </p>
    <v-btn
      color="primary"
      class="ui-btn-primary text-none"
      prepend-icon="mdi-home-outline"
      @click="router.push('/')"
    >
      Voltar ao início
    </v-btn>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 50vh;
  padding: 48px 24px;
}

.not-found__icon-wrap {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: var(--color-primary-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.not-found__title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 8px;
}

.not-found__text {
  font-size: 15px;
  color: var(--color-text-muted);
  margin: 0 0 28px;
  max-width: 360px;
}
</style>
