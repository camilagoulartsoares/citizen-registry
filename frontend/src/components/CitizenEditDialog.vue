<script setup>
import { ref, watch, computed } from 'vue'
import { useCpfMask } from '@/composables/useCpfMask'
import { useCpfAvailability } from '@/composables/useCpfAvailability'
import { useCpfFormField } from '@/composables/useCpfFormField'
import { isValidName, NAME_VALIDATION_MESSAGE } from '@/composables/useNameValidation'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  citizen: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
  success: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'save', 'clear-error'])

const { mask, unmask, isValid } = useCpfMask()
const {
  isRegistered: cpfRegistered,
  checking: cpfChecking,
  scheduleCheck,
  reset: resetCpfCheck,
} = useCpfAvailability(() => props.citizen?.cpf ?? null)

const name = ref('')
const cpf = ref('')

const { cpfFieldRef, onCpfInput, onCpfBlur } = useCpfFormField(cpf, {
  scheduleCheck,
  resetCpfCheck,
})

watch(
  () => props.citizen,
  (citizen) => {
    if (citizen) {
      name.value = citizen.name
      cpf.value = mask(citizen.cpf)
      resetCpfCheck()
    }
  },
  { immediate: true },
)

watch(
  () => props.modelValue,
  (open) => {
    if (open && props.citizen) {
      name.value = props.citizen.name
      cpf.value = mask(props.citizen.cpf)
      resetCpfCheck()
    }
  },
)

watch([name, cpf], () => {
  emit('clear-error')
})

const showNameInvalid = computed(() => {
  const trimmed = name.value.trim()
  return trimmed.length > 0 && !isValidName(name.value)
})

const cpfDigits = computed(() => unmask(cpf.value))
const showCpfInvalid = computed(() => cpfDigits.value.length > 0 && !isValid(cpf.value))
const showCpfDuplicate = computed(() => isValid(cpf.value) && cpfRegistered.value)
const showCpfValid = computed(
  () => isValid(cpf.value) && !cpfRegistered.value && !cpfChecking.value,
)

function close() {
  emit('update:modelValue', false)
}

function submit() {
  if (!isValidName(name.value) || !isValid(cpf.value) || cpfRegistered.value || cpfChecking.value) {
    return
  }
  emit('save', { name: name.value, cpf: cpf.value })
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    width="580"
    persistent
    class="app-modal-dialog-root"
    scrim="rgba(15, 23, 42, 0.6)"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="app-modal">
      <button
        type="button"
        class="app-modal__close"
        aria-label="Fechar"
        :disabled="loading"
        @click="close"
      >
        <v-icon size="20">mdi-close</v-icon>
      </button>

      <div v-if="success" class="app-modal__success">
        <div class="app-modal__success-icon">
          <v-icon size="48" color="#16A34A">mdi-check-circle-outline</v-icon>
        </div>
        <p class="app-modal__success-title">Alterações salvas com sucesso!</p>
        <p class="app-modal__success-text">Os dados do cidadão foram atualizados.</p>
      </div>

      <template v-else>
        <div class="app-modal__header">
          <div class="app-modal__icon app-modal__icon--primary">
            <v-icon size="24">mdi-account-outline</v-icon>
          </div>
          <h3 class="app-modal__title">Editar cidadão</h3>
        </div>

        <div v-if="error" class="app-modal__error" role="alert">
          {{ error }}
        </div>

        <div class="app-modal__form">
          <div>
            <label class="app-modal__field-label">
              Nome completo <span class="ui-required">*</span>
            </label>
            <v-text-field
              v-model="name"
              variant="outlined"
              density="comfortable"
              hide-details
              class="app-modal__field-input"
              :disabled="loading"
            />
            <div v-if="showNameInvalid" class="app-modal__field-hint app-modal__field-hint--error">
              <v-icon size="18">mdi-close-circle-outline</v-icon>
              <span>{{ NAME_VALIDATION_MESSAGE }}</span>
            </div>
          </div>

          <div>
            <label class="app-modal__field-label">
              CPF <span class="ui-required">*</span>
            </label>
            <v-text-field
              ref="cpfFieldRef"
              :model-value="cpf"
              variant="outlined"
              density="comfortable"
              hide-details
              class="app-modal__field-input cpf-field-autofill"
              :class="{ 'app-modal__field-input--error': showCpfInvalid }"
              maxlength="14"
              :disabled="loading"
              @update:model-value="onCpfInput"
              @blur="onCpfBlur"
            />
            <div v-if="showCpfInvalid" class="app-modal__field-hint app-modal__field-hint--error">
              <v-icon size="18">mdi-close-circle-outline</v-icon>
              <span>CPF inválido</span>
            </div>
            <div v-else-if="showCpfDuplicate" class="app-modal__field-hint app-modal__field-hint--error">
              <v-icon size="18">mdi-close-circle-outline</v-icon>
              <span>Este CPF já está cadastrado no sistema.</span>
            </div>
            <div v-else-if="cpfChecking" class="app-modal__field-hint">
              <v-progress-circular indeterminate size="16" width="2" color="primary" />
              <span>Verificando CPF...</span>
            </div>
            <div v-else-if="showCpfValid" class="app-modal__field-hint app-modal__field-hint--success">
              <v-icon size="18">mdi-check-circle-outline</v-icon>
              <span>CPF válido</span>
            </div>
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
            class="app-modal__btn app-modal__btn--save app-modal__btn--action"
            :class="{ 'app-modal__btn--loading': loading }"
            :disabled="loading"
            @click="submit"
          >
            <v-icon v-if="!loading" size="18">mdi-checkbox-marked-outline</v-icon>
            Salvar alterações
          </button>
        </div>
      </template>
    </div>
  </v-dialog>
</template>
