<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  citizen: { type: Object, default: null },
  createdAtLabel: { type: String, default: '—' },
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    width="580"
    class="app-modal-dialog-root"
    scrim="rgba(15, 23, 42, 0.6)"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="app-modal app-modal--view">
      <button type="button" class="app-modal__close" aria-label="Fechar" @click="close">
        <v-icon size="20">mdi-close</v-icon>
      </button>

      <h3 class="app-modal__title app-modal__title--block">Detalhes do cidadão</h3>

      <div v-if="citizen" class="citizen-detail">
        <div class="citizen-detail__row">
          <div class="citizen-detail__icon">
            <v-icon size="22" color="#0B6A3E">mdi-account-outline</v-icon>
          </div>
          <div class="citizen-detail__content">
            <span class="citizen-detail__label">Nome</span>
            <span class="citizen-detail__value">{{ citizen.name }}</span>
          </div>
        </div>

        <div class="citizen-detail__row">
          <div class="citizen-detail__icon">
            <v-icon size="22" color="#0B6A3E">mdi-card-account-details-outline</v-icon>
          </div>
          <div class="citizen-detail__content">
            <span class="citizen-detail__label">CPF</span>
            <span class="citizen-detail__value">{{ citizen.cpfFormatted }}</span>
          </div>
        </div>

        <div class="citizen-detail__row citizen-detail__row--last">
          <div class="citizen-detail__icon">
            <v-icon size="22" color="#0B6A3E">mdi-calendar-outline</v-icon>
          </div>
          <div class="citizen-detail__content">
            <span class="citizen-detail__label">Data de cadastro</span>
            <span class="citizen-detail__value">{{ createdAtLabel }}</span>
          </div>
        </div>
      </div>

      <div class="app-modal__actions app-modal__actions--end">
        <button type="button" class="app-modal__btn app-modal__btn--outline-green" @click="close">
          Fechar
        </button>
      </div>
    </div>
  </v-dialog>
</template>
