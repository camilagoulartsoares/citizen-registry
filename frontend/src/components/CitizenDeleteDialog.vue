<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  citizen: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

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
        <div class="app-modal__icon app-modal__icon--danger">
          <v-icon size="24">mdi-alert</v-icon>
        </div>
        <h3 class="app-modal__title">Confirmar exclusão</h3>
      </div>

      <p class="app-modal__text--primary">
        Tem certeza que deseja excluir este cidadão?
      </p>
      <p class="app-modal__text--secondary">
        Esta ação não poderá ser desfeita.
      </p>

      <div v-if="citizen" class="app-modal__info app-modal__info--neutral">
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
        <button
          type="button"
          class="app-modal__btn app-modal__btn--cancel"
          :disabled="loading"
          @click="close"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="app-modal__btn app-modal__btn--danger app-modal__btn--action"
          :class="{ 'app-modal__btn--loading': loading }"
          :disabled="loading"
          @click="emit('confirm')"
        >
          <v-icon v-if="!loading" size="18">mdi-trash-can-outline</v-icon>
          Excluir cidadão
        </button>
      </div>
    </div>
  </v-dialog>
</template>
