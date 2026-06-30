<template>
  <div class="home-skeleton">
    <v-row class="mb-0 home-cards">
      <v-col v-for="index in 2" :key="`card-${index}`" cols="12" md="6">
        <div class="ui-card home-skeleton__card">
          <div class="home-skeleton__header">
            <v-skeleton-loader type="avatar" class="home-skeleton__avatar" />
            <div class="home-skeleton__header-text">
              <v-skeleton-loader type="heading" width="180" />
              <v-skeleton-loader type="text" width="260" class="mt-2" />
            </div>
          </div>
          <v-skeleton-loader type="text" width="120" class="mb-2" />
          <v-skeleton-loader type="image" height="48" class="mb-5 rounded-lg" />
          <v-skeleton-loader type="text" width="60" class="mb-2" />
          <v-skeleton-loader type="image" height="48" class="mb-6 rounded-lg" />
          <v-skeleton-loader type="button" height="44" class="rounded-lg" />
        </div>
      </v-col>
    </v-row>

    <div class="home-skeleton__section mt-8">
      <v-skeleton-loader type="heading" width="160" class="mb-2" />
      <v-skeleton-loader type="text" width="320" class="mb-6" />
      <v-row>
        <v-col v-for="index in 4" :key="`quick-${index}`" cols="12" sm="6" md="3">
          <div class="quick-card home-skeleton__quick-card">
            <v-skeleton-loader type="avatar" class="home-skeleton__quick-avatar mb-4" />
            <v-skeleton-loader type="heading" width="140" class="mb-2" />
            <v-skeleton-loader type="text" width="180" />
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped>
.home-skeleton__card {
  min-height: 360px;
}

.home-skeleton__header {
  display: flex;
  gap: 14px;
  margin-bottom: 24px;
}

.home-skeleton__header-text {
  flex: 1;
}

.home-skeleton__avatar :deep(.v-skeleton-loader__avatar) {
  width: 44px;
  height: 44px;
}

.home-skeleton__quick-card {
  min-height: 148px;
  pointer-events: none;
}

.home-skeleton__quick-avatar :deep(.v-skeleton-loader__avatar) {
  width: 36px;
  height: 36px;
}
</style>
