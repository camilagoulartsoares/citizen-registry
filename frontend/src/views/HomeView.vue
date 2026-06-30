<script setup>
import { usePageReady } from '@/composables/usePageReady'
import CitizenForm from '@/components/CitizenForm.vue'
import CpfSearch from '@/components/CpfSearch.vue'
import QuickAccessGrid from '@/components/QuickAccessGrid.vue'
import HomeViewSkeleton from '@/components/HomeViewSkeleton.vue'

const { isPageReady } = usePageReady()
</script>

<template>
  <HomeViewSkeleton v-if="!isPageReady" />

  <div v-else>
    <v-row class="mb-0 home-cards">
      <v-col cols="12" md="6">
        <div class="ui-card ui-card--home">
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
            <div class="ui-card__dots" aria-hidden="true">
              <span /><span /><span />
              <span /><span /><span />
              <span /><span /><span />
            </div>
          </div>
          <div class="ui-card__body">
            <CitizenForm />
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <div class="ui-card ui-card--home">
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
          <div class="ui-card__body">
            <CpfSearch />
          </div>
        </div>
      </v-col>
    </v-row>

    <QuickAccessGrid />
  </div>
</template>
