<script setup>
import { usePageReady } from '@/composables/usePageReady'
import CpfSearch from '@/components/CpfSearch.vue'
import SkeletonSearchCard from '@/components/skeleton/SkeletonSearchCard.vue'

const { isPageReady } = usePageReady()
</script>

<template>
  <SkeletonSearchCard v-if="!isPageReady" variant="page" />

  <div v-else class="ui-card page-skeleton__narrow-card">
    <div class="ui-card__header">
      <div class="ui-card__header-left">
        <div class="ui-card__icon-wrap">
          <v-icon class="ui-card__icon" size="22">mdi-magnify</v-icon>
        </div>
        <div>
          <h2 class="ui-card__title">Consultar CPF</h2>
          <p class="ui-card__description">
            Busque por nome ou CPF do cidadão.
          </p>
        </div>
      </div>
    </div>
    <CpfSearch />
  </div>
</template>
