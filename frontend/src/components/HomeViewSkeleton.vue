<template>
  <div class="page-skeleton" aria-hidden="true">
    <v-row class="mb-0 home-cards">
      <v-col cols="12" md="6">
        <SkeletonRegisterCard variant="home" />
      </v-col>

      <v-col cols="12" md="6">
        <SkeletonSearchCard variant="home" />
      </v-col>
    </v-row>

    <SkeletonQuickAccessSection />
  </div>
</template>

<script setup>
import SkeletonRegisterCard from '@/components/skeleton/SkeletonRegisterCard.vue'
import SkeletonSearchCard from '@/components/skeleton/SkeletonSearchCard.vue'
import SkeletonQuickAccessSection from '@/components/skeleton/SkeletonQuickAccessSection.vue'
</script>
