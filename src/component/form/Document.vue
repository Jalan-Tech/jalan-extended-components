<template>
  <div v-if="label" class="text-body2 q-ma-xs"><span v-html="labelData" /></div>
  <q-input
    ref="field"
    @update:model-value="value => $emit('update:model-value', value)"
    :model-value="modelValue"

    :placeholder="placeholder"
    :hint="hint"

    type="tel"
    :mask="mask"
    :unmasked-value="unmaskedValue"

    :loading="loading"
    :disable="disable"
    :readonly="readonly"

    :rules="[...rules, ...validationRules]"
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
</template>

<script>
export default {
  name: 'JalanDocument',
  props: {
    // obrigatório
    modelValue: {
      required: true,
      default: undefined
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

    // opcionais especificos
    isBrazil: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: null
    },
    unmaskedValue: {
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
  data () {
    return {
      searchValue: ''
    }
  },
  computed: {
    mask () {
      if (!this.isBrazil) return undefined
      if (this.type === 'cpf') return '###.###.###-##'
      if (this.type === 'cnpj') return '##.###.###/####-##'
      if (this.modelValue.length > 14) return '##.###.###/####-##'
      return '###.###.###-#####'
    },

    isValidCPF () {
      const value = this.modelValue.replace(/[.-]/g, '')

      // invalid options
      const invalid = (process.env.NODE_ENV === 'production') // liberando o 11111111111 para o teste do antifraude
        ? ['00000000000', '11111111111', '22222222222', '33333333333', '44444444444', '55555555555', '66666666666', '77777777777', '88888888888', '99999999999']
        : ['00000000000', '22222222222', '33333333333', '44444444444', '55555555555', '66666666666', '77777777777', '88888888888', '99999999999']
      if (invalid.find(cpf => cpf === value)) return false

      // calc validation
      let sum = 0, rest = 0

      // checking first digit
      sum = 0
      for (let i = 1; i <= 9; i++) sum = sum + parseInt(value.substring(i - 1, i)) * (11 - i)
      rest = (sum * 10) % 11
      if (rest === 10 || rest === 11) rest = 0
      if (rest !== parseInt(value.substring(9, 10))) return false

      // checking second digit
      sum = 0
      for (let i = 1; i <= 10; i++) sum = sum + parseInt(value.substring(i - 1, i)) * (12 - i)
      rest = (sum * 10) % 11
      if (rest === 10 || rest === 11) rest = 0
      if (rest !== parseInt(value.substring(10, 11))) return false

      return true
    },

    isValidCNPJ () {
      const value = this.modelValue.replace(/[/.-]/g, '')

      // invalid options
      const invalid = ['00000000000000', '11111111111111', '22222222222222', '33333333333333', '44444444444444', '55555555555555', '66666666666666', '77777777777777', '88888888888888', '99999999999999']
      if (invalid.find(cnpj => cnpj === value)) return false

      // calc validation
      let sum = 0, rest = 0
      const peso1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      const peso2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

      // checking first digit
      sum = 0
      for (let i = 0; i <= 11; i++) sum = sum + parseInt(value.charAt(i) * peso1[i])
      rest = sum % 11
      if (rest < 2 && parseInt(value.charAt(12)) !== 0) return false
      else if (rest >= 2 && ((11 - rest) !== parseInt(value.charAt(12)))) return false

      // checking second digit
      sum = 0
      for (let i = 0; i <= 12; i++) sum = sum + parseInt(value.charAt(i) * peso2[i])
      rest = sum % 11
      if (rest < 2 && parseInt(value.charAt(13)) !== 0) return false
      else if (rest >= 2 && ((11 - rest) !== parseInt(value.charAt(13)))) return false

      return true
    },

    validationRules () {
      if (!this.isBrazil) return []
      if (this.type === 'cpf') return [val => !val || this.isValidCPF || 'Formato Inválido']
      if (this.type === 'cnpj') return [val => !val || this.isValidCNPJ || 'Formato Inválido']
      if (this.modelValue.length > 14) return [val => !val || this.isValidCNPJ || 'Formato Inválido']
      return [val => !val || this.isValidCPF || 'Formato Inválido']
    },

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

    focus () {
      this.$refs.field.focus()
    },

    blur () {
      this.$refs.field.blur()
    }
  }
}
</script>
