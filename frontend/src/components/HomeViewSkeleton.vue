<template>
  <div class="home-skeleton" aria-hidden="true">
    <v-row class="mb-0 home-cards">
      <v-col cols="12" md="6">
        <div class="ui-card ui-card--home">
          <div class="ui-card__header">
            <div class="ui-card__header-left">
              <div class="skeleton-shimmer skeleton-shimmer--icon" />
              <div class="home-skeleton__header-copy">
                <div class="skeleton-shimmer skeleton-shimmer--card-title" />
                <div class="skeleton-shimmer skeleton-shimmer--card-desc" />
                <div class="skeleton-shimmer skeleton-shimmer--card-desc skeleton-shimmer--card-desc-short" />
              </div>
            </div>
            <div class="ui-card__dots home-skeleton__dots" aria-hidden="true">
              <span v-for="dot in 9" :key="dot" class="skeleton-shimmer skeleton-shimmer--dot" />
            </div>
          </div>

          <div class="ui-card__body">
            <div class="home-skeleton__form home-skeleton__form--register">
              <div class="home-skeleton__field">
                <div class="skeleton-shimmer skeleton-shimmer--label" />
                <div class="skeleton-shimmer skeleton-shimmer--input" />
                <div class="skeleton-shimmer skeleton-shimmer--hint" />
              </div>

              <div class="home-skeleton__field">
                <div class="skeleton-shimmer skeleton-shimmer--label skeleton-shimmer--label-short" />
                <div class="skeleton-shimmer skeleton-shimmer--input" />
                <div class="skeleton-shimmer skeleton-shimmer--hint skeleton-shimmer--hint-tall" />
              </div>

              <div class="skeleton-shimmer skeleton-shimmer--button" />
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <div class="ui-card ui-card--home">
          <div class="ui-card__header">
            <div class="ui-card__header-left">
              <div class="skeleton-shimmer skeleton-shimmer--icon" />
              <div class="home-skeleton__header-copy">
                <div class="skeleton-shimmer skeleton-shimmer--card-title skeleton-shimmer--card-title-short" />
                <div class="skeleton-shimmer skeleton-shimmer--card-desc skeleton-shimmer--card-desc-single" />
              </div>
            </div>
          </div>

          <div class="ui-card__body">
            <div class="home-skeleton__form home-skeleton__form--search">
              <div class="home-skeleton__field home-skeleton__field--search">
                <div class="skeleton-shimmer skeleton-shimmer--label skeleton-shimmer--label-wide" />
                <div class="skeleton-shimmer skeleton-shimmer--input" />
              </div>

              <div class="skeleton-shimmer skeleton-shimmer--button" />
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

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
        <div class="quick-card home-skeleton__quick-card">
          <div class="skeleton-shimmer skeleton-shimmer--quick-icon" />
          <div class="skeleton-shimmer skeleton-shimmer--quick-title" />
          <div class="skeleton-shimmer skeleton-shimmer--quick-subtitle" />
          <div class="skeleton-shimmer skeleton-shimmer--quick-arrow" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.home-skeleton__header-copy {
  flex: 1;
  min-width: 0;
}

.home-skeleton__dots {
  display: grid;
  grid-template-columns: repeat(3, 4px);
  gap: 4px;
  opacity: 1;
  padding-top: 6px;
}

.home-skeleton__dots .skeleton-shimmer--dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
}

.home-skeleton__form {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.home-skeleton__form--register {
  gap: 0;
}

.home-skeleton__field {
  margin-bottom: 20px;
}

.home-skeleton__field:last-of-type {
  margin-bottom: 24px;
}

.home-skeleton__field--search {
  margin-bottom: 24px;
}

.home-skeleton__form .skeleton-shimmer--button {
  margin-top: auto;
}

.home-skeleton__quick-card {
  pointer-events: none;
  cursor: default;
}

.home-skeleton__quick-card:hover {
  transform: none;
  box-shadow: var(--shadow-card);
}
</style>
