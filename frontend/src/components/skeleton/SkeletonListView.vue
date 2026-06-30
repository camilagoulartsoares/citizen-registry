<template>
  <div class="page-skeleton__list" aria-hidden="true">
    <div class="page-tabs page-skeleton__tabs">
      <div
        v-for="index in 3"
        :key="`tab-${index}`"
        class="skeleton-shimmer skeleton-shimmer--tab"
      />
    </div>

    <div class="list-header mb-5">
      <div class="skeleton-shimmer skeleton-shimmer--list-title" />
      <div class="skeleton-shimmer skeleton-shimmer--list-subtitle mt-2" />
    </div>

    <div class="list-toolbar mb-4">
      <div class="skeleton-shimmer skeleton-shimmer--toolbar-search" />
      <div class="skeleton-shimmer skeleton-shimmer--toolbar-btn" />
      <div class="skeleton-shimmer skeleton-shimmer--toolbar-btn skeleton-shimmer--toolbar-btn-green" />
    </div>

    <div class="ui-card pa-0 overflow-hidden list-card">
      <SkeletonCitizenTable />
      <v-divider />
      <div class="table-pagination page-skeleton__pagination">
        <div class="skeleton-shimmer skeleton-shimmer--pagination-nav" />
        <div class="skeleton-shimmer skeleton-shimmer--pagination-page" />
        <div class="skeleton-shimmer skeleton-shimmer--pagination-page" />
        <div class="skeleton-shimmer skeleton-shimmer--pagination-page skeleton-shimmer--pagination-page-active" />
        <div class="skeleton-shimmer skeleton-shimmer--pagination-nav" />
      </div>
    </div>

    <div class="skeleton-shimmer skeleton-shimmer--list-meta mt-3" />
  </div>
</template>

<script setup>
import SkeletonCitizenTable from '@/components/skeleton/SkeletonCitizenTable.vue'
</script>

<style scoped>
.page-skeleton__tabs {
  border-bottom-color: transparent;
}

.page-skeleton__pagination {
  pointer-events: none;
}
</style>
