<template>
  <div>
    <div class="section-header">
      <div class="section-header__top">
        <div class="skeleton-shimmer skeleton-shimmer--section-icon" />
        <div class="skeleton-shimmer skeleton-shimmer--section-title" />
      </div>
      <div class="skeleton-shimmer skeleton-shimmer--section-subtitle" />
    </div>

    <v-row>
      <v-col
        v-for="index in 4"
        :key="`quick-${index}`"
        cols="12"
        sm="6"
        md="3"
      >
        <div class="quick-card page-skeleton__quick-card">
          <div class="skeleton-shimmer skeleton-shimmer--quick-icon" />
          <div class="skeleton-shimmer skeleton-shimmer--quick-title" />
          <div class="skeleton-shimmer skeleton-shimmer--quick-subtitle" />
          <div class="skeleton-shimmer skeleton-shimmer--quick-arrow" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>
