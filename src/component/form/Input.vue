<template>
  <div>
    <div v-if="label" class="text-body2 q-ma-xs"><span v-html="labelData" /></div>
    <q-input
      ref="field"
      @update:model-value="value => $emit('update:model-value', value)"
      :model-value="modelValue"

      :placeholder="placeholder"
      :hint="hint"

      :type="type"
      :mask="mask"
      :unmasked-value="unmaskedValue"
      :multiline="multiline"

      :loading="loading"
      :disable="disable"
      :readonly="readonly"

      :rules="rules"
      :lazy-rules="true"
      :maxlength="maxLength"
      :counter="!!maxLength"

      :filled="inputStyle === 'filled'"
      :outlined="inputStyle === 'outlined'"
      :dense="dense"
      :color="color"
      :hide-bottom-space="hideBottomSpace"
      :class="inputClass"

      @focus="$refs.field.resetValidation(); $emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
      <template v-if="icon" v-slot:[iconAppendPosition]>
        <q-icon :name="icon" />
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  name: 'JalanInput',

  props: {
    // obrigatório
    modelValue: {
      type: String,
      default: ''
    },

    // opcionais informativos
    label: {
      type: String,
      default: ''
    },
    requiredTag: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: undefined
    },
    icon: {
      type: String,
      default: ''
    },
    iconPosition: {
      type: String,
      default: 'left'
    },

    // opcionais espeficicos
    type: {
      type: String,
      default: 'text'
    },
    mask: {
      type: String,
      default: ''
    },
    unmaskedValue: {
      type: Boolean,
      default: false
    },
    multiline: {
      type: Boolean,
      default: false
    },

    // modo desabilitado
    loading: {
      type: Boolean,
      default: false
    },
    disable: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },

    // regras
    rules: {
      type: Array,
      default: () => []
    },
    maxLength: {
      type: [String, Number],
      default: undefined
    },

    // Estilo
    inputStyle: { // standard, filled ou outlined
      type: String,
      default: 'outlined'
    },
    dense: {
      type: Boolean,
      default: undefined
    },
    color: {
      type: String,
      default: undefined
    },
    hideBottomSpace: {
      type: Boolean,
      default: true
    },
    inputClass: {
      type: String,
      default: 'q-pb-md'
    }
  },

  computed: {
    iconAppendPosition () {
      return this.iconPosition === 'right' ? 'append' : 'prepend'
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
      const response = await this.$refs.field.validate()
      if (response) this.$emit('on-validate-success')
      else this.$emit('on-validate-error')
      return response
    },

    resetValidation () {
      this.$refs.field.resetValidation()
    },

    normalizeText(value) {
      const normalizedText = normalizeUnicodeText(value);
      return normalizedText
    },

    emitText(value) {
      this.$emit('update:model-value', normalizeText(value))
    },

    focus () {
      this.$refs.field.focus()
    },

    blur () {
      this.$refs.field.blur()
    }
  }
}
</script>
