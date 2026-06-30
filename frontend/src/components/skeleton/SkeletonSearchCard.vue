<script setup>
import SkeletonCardHeader from '@/components/skeleton/SkeletonCardHeader.vue'
import SkeletonSearchForm from '@/components/skeleton/SkeletonSearchForm.vue'

defineProps({
  variant: {
    type: String,
    default: 'page',
    validator: (value) => ['home', 'page'].includes(value),
  },
})
</script>

<template>
  <div
    class="ui-card"
    :class="{
      'ui-card--home': variant === 'home',
      'page-skeleton__narrow-card': variant === 'page',
    }"
  >
    <SkeletonCardHeader
      title-variant="short"
      desc-variant="single"
    />
    <div class="ui-card__body">
      <SkeletonSearchForm />
    </div>
  </div>
</template>
