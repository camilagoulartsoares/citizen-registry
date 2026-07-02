import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useCpfMask } from '@/composables/useCpfMask'

const AUTOFILL_ANIMATION = 'cpf-autofill-start'

/**
 * Sincroniza CPF com máscara, autofill do navegador e checagem de disponibilidade.
 * Autofill costuma não disparar update:model-value — lê o input no blur e via animation.
 */
export function useCpfFormField(cpf, { scheduleCheck, resetCpfCheck, onApply } = {}) {
  const { mask, unmask, isValid } = useCpfMask()
  const cpfFieldRef = ref(null)

  function applyCpfValue(raw) {
    const masked = mask(raw ?? '')
    const prevDigits = unmask(cpf.value)
    const nextDigits = unmask(masked)
    cpf.value = masked
    onApply?.()
    if (nextDigits !== prevDigits) {
      resetCpfCheck()
    }
    scheduleCheck(masked)
  }

  function onCpfInput(value) {
    applyCpfValue(value)
  }

  function readCpfFromDom() {
    const input = cpfFieldRef.value?.$el?.querySelector('input')
    const raw = input?.value?.trim()
    if (!raw) return

    const domDigits = unmask(raw)
    const modelDigits = unmask(cpf.value)
    if (domDigits !== modelDigits || (isValid(raw) && domDigits.length === 11)) {
      applyCpfValue(raw)
    }
  }

  function onCpfBlur() {
    readCpfFromDom()
  }

  /** Após autofill no nome, o CPF pode ser preenchido ms depois. */
  function pollAutofillAfterName() {
    readCpfFromDom()
    setTimeout(readCpfFromDom, 150)
    setTimeout(readCpfFromDom, 400)
  }

  function bindNativeInput() {
    const input = cpfFieldRef.value?.$el?.querySelector('input')
    if (!input || input.dataset.cpfBound) return
    input.dataset.cpfBound = '1'
    input.addEventListener('change', readCpfFromDom)
  }

  function unbindNativeInput() {
    const input = cpfFieldRef.value?.$el?.querySelector('input')
    if (!input?.dataset.cpfBound) return
    delete input.dataset.cpfBound
    input.removeEventListener('change', readCpfFromDom)
  }

  function onAutofillAnimation(event) {
    if (event.animationName !== AUTOFILL_ANIMATION) return
    const input = event.target
    if (!cpfFieldRef.value?.$el?.contains(input)) return
    readCpfFromDom()
  }

  onMounted(async () => {
    document.addEventListener('animationstart', onAutofillAnimation, true)
    await nextTick()
    bindNativeInput()
  })

  watch(cpfFieldRef, () => {
    nextTick(() => bindNativeInput())
  })

  onUnmounted(() => {
    document.removeEventListener('animationstart', onAutofillAnimation, true)
    unbindNativeInput()
  })

  return {
    cpfFieldRef,
    onCpfInput,
    onCpfBlur,
    pollAutofillAfterName,
    readCpfFromDom,
    applyCpfValue,
  }
}

export { AUTOFILL_ANIMATION }
