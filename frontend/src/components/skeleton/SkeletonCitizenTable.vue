<template>
  <div class="skeleton-table">
    <div class="skeleton-table__head">
      <div class="skeleton-shimmer skeleton-shimmer--table-col skeleton-shimmer--table-col-name" />
      <div class="skeleton-shimmer skeleton-shimmer--table-col skeleton-shimmer--table-col-cpf" />
      <div class="skeleton-shimmer skeleton-shimmer--table-col skeleton-shimmer--table-col-date" />
      <div class="skeleton-shimmer skeleton-shimmer--table-col skeleton-shimmer--table-col-actions" />
    </div>

    <div
      v-for="row in 8"
      :key="`row-${row}`"
      class="skeleton-table__row"
    >
      <div class="skeleton-shimmer skeleton-shimmer--table-cell skeleton-shimmer--table-cell-name" />
      <div class="skeleton-shimmer skeleton-shimmer--table-cell skeleton-shimmer--table-cell-cpf" />
      <div class="skeleton-shimmer skeleton-shimmer--table-cell skeleton-shimmer--table-cell-date" />
      <div class="skeleton-table__actions">
        <div class="skeleton-shimmer skeleton-shimmer--table-action" />
        <div class="skeleton-shimmer skeleton-shimmer--table-action" />
        <div class="skeleton-shimmer skeleton-shimmer--table-action skeleton-shimmer--table-action-danger" />
      </div>
    </div>
  </div>
</template>
