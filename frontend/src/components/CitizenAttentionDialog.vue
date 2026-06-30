<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  citizen: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'continue'])

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
    <div class="app-modal">
      <button type="button" class="app-modal__close" aria-label="Fechar" @click="close">
        <v-icon size="20">mdi-close</v-icon>
      </button>

      <div class="app-modal__header">
        <div class="app-modal__icon app-modal__icon--warning">
          <v-icon size="24">mdi-exclamation</v-icon>
        </div>
        <h3 class="app-modal__title">Atenção!</h3>
      </div>

      <div class="app-modal__text">
        <p class="app-modal__text-line">Esta ação é irreversível.</p>
        <p class="app-modal__text-line">
          Todos os dados deste cidadão serão removidos permanentemente do sistema.
        </p>
      </div>

      <div v-if="citizen" class="app-modal__info app-modal__info--warning">
        <div class="app-modal__info-row">
          <span class="app-modal__info-label">Nome</span>
          <span class="app-modal__info-value">{{ citizen.name }}</span>
        </div>
        <div class="app-modal__info-row">
          <span class="app-modal__info-label">CPF</span>
          <span class="app-modal__info-value">{{ citizen.cpfFormatted }}</span>
        </div>
      </div>

      <div class="app-modal__actions app-modal__actions--split">
        <button type="button" class="app-modal__btn app-modal__btn--cancel" @click="close">
          Cancelar
        </button>
        <button
          type="button"
          class="app-modal__btn app-modal__btn--warning app-modal__btn--action"
          @click="emit('continue')"
        >
          <v-icon size="18">mdi-alert-outline</v-icon>
          Continuar mesmo assim
        </button>
      </div>
    </div>
  </v-dialog>
</template>
