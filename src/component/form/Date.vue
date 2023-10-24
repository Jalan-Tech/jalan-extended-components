<template>
  <div>
    <div v-if="label" class="text-body2 q-ma-xs"><span v-html="labelData" /></div>
    <q-input
      ref="field"
      @update:model-value="value => $emit('update:model-value', value)"
      :model-value="modelValue"

      :placeholder="format === 'date-month' ? 'DD/MM' : format === 'month-year' ? 'MM/AAAA' : 'DD/MM/AAAA'"
      :hint="hint"

      type="tel"
      :mask="format === 'date-month' ? '##/##' : format === 'month-year' ? '##/####' : '##/##/####'"

      :loading="loading"
      :disable="disable"
      :readonly="readonly"

      :rules="[
        ...rules,
        val => !val || checkDate(val) || 'Data inválida'
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
import { date } from 'quasar'

export default {
  name: 'JalanDate',

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
    format: {
      // date-month, month-year, full
      type: String,
      default: 'full'
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
    checkDate (val) {
      if (!val) return false

      let dateString = val

      if (this.format === 'date-month') {
        if (dateString.length < 5) return false
        const nowYear = new Date().getFullYear()
        dateString = dateString + '/' + nowYear
      }

      if (this.format === 'month-year') {
        if (dateString.length < 7) return false
        dateString = '01/' + dateString
      }

      const reverDate = dateString.split('/').reverse().join('-')
      return !!date.isValid(reverDate)
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
