<template>
  <div>
    <q-checkbox
      class="checkbox-jalan-class"
      :class="inputClass"
      @update:model-value="value => { validate(); $emit('update:model-value', value) }"
      :model-value="(trueValue === true && falseValue === false) ? !!modelValue : modelValue"

      :true-value="trueValue"
      :false-value="falseValue"

      :disable="disable"

      :color="color"
      :dense="dense"
    >
      <slot><span v-html="labelData" /></slot>
      <q-slide-transition :duration="200">
        <div v-if="isDirty && required && modelValue === falseValue" class="text-caption text-negative">{{ errorMessage }}</div>
        <div v-else-if="hint" class="text-caption text-grey-7">{{ hint }}</div>
      </q-slide-transition>
    </q-checkbox>
  </div>
</template>

<script>
export default {
  name: 'JalanCheckbox',

  props: {
    // obrigatorio
    modelValue: {
      default: false
    },
    // opcionais
    label: {
      type: String,
      default: ''
    },
    requiredTag: {
      type: String,
      default: null
    },
    hint: {
      type: String,
      default: undefined
    },
    // opcionais especificos
    trueValue: {
      type: [String, Boolean],
      default: true
    },
    falseValue: {
      type: [String, Boolean],
      default: false
    },

    // Modo desabilitado
    disable: {
      type: Boolean,
      default: false
    },

    // Regras
    required: {
      type: [String, Boolean],
      default: false
    },

    // Estilo
    color: {
      type: String,
      default: undefined
    },
    dense: {
      type: Boolean,
      default: false
    },
    inputClass: {
      type: String,
      default: 'q-pb-md'
    }
  },

  data () {
    return {
      isDirty: false
    }
  },

  computed: {
    errorMessage () {
      if (typeof this.required === 'string') return this.required
      return 'É obrigatório marcar a opção'
    },

    labelData () {
      let label = this.label
      if (this.requiredTag === 'required') label += ' &nbsp; <small class="text-grey text-bold"><i>Obrigatório</i></small>&nbsp;'
      if (this.requiredTag === 'optional') label += ' &nbsp; <small class="text-grey text-weight-regular"><i>Opcional</i></small>&nbsp;'
      return label
    }
  },

  methods: {
    async validate () {
      this.isDirty = true
      const response = !this.required || this.modelValue === this.trueValue
      if (response) this.$emit('on-validate-success')
      else this.$emit('on-validate-error')
      return response
    },

    resetValidation () {
      this.isDirty = false
    }
  }
}
</script>

<style lang="sass">
.checkbox-jalan-class
  align-items: flex-start

  &:not(.q-checkbox--dense) .q-checkbox__label
    padding-top: 10px
</style>
