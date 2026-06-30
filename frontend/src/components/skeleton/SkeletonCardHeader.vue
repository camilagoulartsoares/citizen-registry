<script setup>
defineProps({
  showDots: { type: Boolean, default: false },
  titleVariant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'short'].includes(value),
  },
  descVariant: {
    type: String,
    default: 'multi',
    validator: (value) => ['multi', 'single'].includes(value),
  },
})
</script>

<template>
  <div class="ui-card__header">
    <div class="ui-card__header-left">
      <div class="skeleton-shimmer skeleton-shimmer--icon" />
      <div class="page-skeleton__header-copy">
        <div
          class="skeleton-shimmer skeleton-shimmer--card-title"
          :class="{ 'skeleton-shimmer--card-title-short': titleVariant === 'short' }"
        />
        <div
          class="skeleton-shimmer skeleton-shimmer--card-desc"
          :class="{
            'skeleton-shimmer--card-desc-single': descVariant === 'single',
            'skeleton-shimmer--card-desc-short': descVariant === 'multi',
          }"
        />
        <div
          v-if="descVariant === 'multi'"
          class="skeleton-shimmer skeleton-shimmer--card-desc skeleton-shimmer--card-desc-short"
        />
      </div>
    </div>

    <div v-if="showDots" class="ui-card__dots page-skeleton__dots" aria-hidden="true">
      <span v-for="dot in 9" :key="dot" class="skeleton-shimmer skeleton-shimmer--dot" />
    </div>
  </div>
</template>
