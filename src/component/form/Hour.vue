<template>
  <div>
    <div v-if="label" class="text-body2 q-ma-xs"><span v-html="labelData" /></div>
    <q-input
      ref="field"
      @update:model-value="value => $emit('update:model-value', value)"
      :model-value="modelValue"

      placeholder="HH:MM"
      :hint="hint"

      type="tel"
      mask="##:##"

      :loading="loading"
      :disable="disable"
      :readonly="readonly"

      :rules="[
        ...rules,
        val => !val || checkHour(val) || 'Hora inválida'
      ]"
      :lazy-rules="true"

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
  name: 'JalanHour',

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
    checkHour (val) {
      if (val && val.length < 5) return false
      const [hour, minute] = val.split(':')
      if (parseInt(hour) > 23) return false
      else if (parseInt(minute) > 59) return false
      return true
    },

    async validate () {
      const response = await this.$refs.field.validate()
      if (response) this.$emit('on-validate-success')
      else this.$emit('on-validate-error')
      return response
    },

    resetValidation () {
      this.$refs.field.resetValidation()
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
