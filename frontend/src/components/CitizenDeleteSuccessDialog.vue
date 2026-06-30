<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  citizen: { type: Object, default: null },
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
    <div class="app-modal">
      <button type="button" class="app-modal__close" aria-label="Fechar" @click="close">
        <v-icon size="20">mdi-close</v-icon>
      </button>

      <div class="app-modal__header">
        <div class="app-modal__icon app-modal__icon--success">
          <v-icon size="26">mdi-check</v-icon>
        </div>
        <h3 class="app-modal__title">Cidadão excluído com sucesso!</h3>
      </div>

      <p class="app-modal__text">O cidadão foi removido do sistema.</p>

      <div v-if="citizen" class="app-modal__info app-modal__info--success">
        <div class="app-modal__info-row">
          <span class="app-modal__info-label">Nome</span>
          <span class="app-modal__info-value">{{ citizen.name }}</span>
        </div>
        <div class="app-modal__info-row">
          <span class="app-modal__info-label">CPF</span>
          <span class="app-modal__info-value">{{ citizen.cpfFormatted }}</span>
        </div>
      </div>

      <button type="button" class="app-modal__btn app-modal__btn--save app-modal__btn--full" @click="close">
        Fechar
      </button>
    </div>
  </v-dialog>
</template>
