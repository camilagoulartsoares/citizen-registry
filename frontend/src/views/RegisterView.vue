<script setup>
import { usePageReady } from '@/composables/usePageReady'
import CitizenForm from '@/components/CitizenForm.vue'
import SkeletonRegisterCard from '@/components/skeleton/SkeletonRegisterCard.vue'

const { isPageReady } = usePageReady()
</script>

<template>
  <SkeletonRegisterCard v-if="!isPageReady" variant="page" />

  <div v-else class="ui-card page-skeleton__narrow-card">
    <div class="ui-card__header">
      <div class="ui-card__header-left">
        <div class="ui-card__icon-wrap">
          <v-icon class="ui-card__icon" size="22">mdi-account-outline</v-icon>
        </div>
        <div>
          <h2 class="ui-card__title">Cadastrar cidadão</h2>
          <p class="ui-card__description">
            Informe o nome completo e CPF do cidadão para cadastrar.
          </p>
        </div>
      </div>
    </div>
    <CitizenForm />
  </div>
</template>
