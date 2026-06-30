<script setup>
import CpfSearch from '@/components/CpfSearch.vue'
</script>

<template>
  <div class="ui-card" style="max-width: 560px">
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
