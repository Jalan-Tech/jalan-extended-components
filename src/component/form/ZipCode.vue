<template>
  <div v-if="label" class="text-body2 q-ma-xs"><span v-html="labelData" /></div>
  <q-input
    ref="field"
    @update:model-value="updateModel"
    :model-value="modelValue"

    :placeholder="placeholder"
    :hint="hint"

    type="tel"
    :mask="isBrazil ? '#####-###' : undefined"
    :unmasked-value="true"

    :loading="loading || searchLoading"
    :disable="disable"
    :readonly="readonly"

    :rules="[...rules, val => !val || (!!val && val.length === 8) || !isBrazil || 'Formato inválido']"
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
  name: 'JalanZipCode',

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

    // opcionais especificos
    isBrazil: {
      type: Boolean,
      default: true
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
      searchLoading: false
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
    updateModel (value) {
      this.$emit('update:model-value', value)
      this.getAddressInfo(value)
    },

    getAddressInfo (value) {
      if (value.length >= 8 && this.isBrazil) {
        const cepNumber = value.split('-').join('')
        this.searchLoading = true

        this.$axios.get(`https://viacep.com.br/ws/${cepNumber}/json`)
          .then(response => {
            const address = {}
            if (response.data && !response.data.erro) {
              address.neighborhood = response.data.bairro || ''
              address.city = response.data.localidade || ''
              address.street = response.data.logradouro || ''
              address.state = response.data.uf || ''
            }
            this.$emit('addressInfo', address)
          })
          .catch(() => {
            this.$emit('addressInfo', {})
          })
          .finally(() => {
            this.searchLoading = false
          })
      }
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
