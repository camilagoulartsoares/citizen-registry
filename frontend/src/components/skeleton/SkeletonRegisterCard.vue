<script setup>
import SkeletonCardHeader from '@/components/skeleton/SkeletonCardHeader.vue'
import SkeletonRegisterForm from '@/components/skeleton/SkeletonRegisterForm.vue'

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
    <SkeletonCardHeader :show-dots="variant === 'home'" />
    <div class="ui-card__body">
      <SkeletonRegisterForm />
    </div>
  </div>
</template>
