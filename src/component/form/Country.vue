<template>
  <div v-if="label" class="text-body2 q-ma-xs"><span v-html="labelData" /></div>
  <q-select
    ref="field"
    options-selected-class="text-bold bg-grey-2"

    @update:model-value="$emit('update:model-value', $event)"
    :model-value="modelValue"

    :placeholder="modelValue ? '' : placeholder"
    :hint="hint"

    :options="filteredOptions"

    :use-input="true"
    :emit-value="true"
    :map-options="true"
    :input-debounce="0"

    :loading="loading"
    :disable="disable"
    :readonly="readonly"

    :filled="inputStyle === 'filled'"
    :outlined="inputStyle === 'outlined'"
    :dense="dense"
    :color="color"
    :hide-bottom-space="hideBottomSpace"
    :class="inputClass"

    :rules="rules"
    :lazy-rules="true"

    @filter="filterFn"

    @focus="$refs.field.resetValidation(); $emit('focus', $event)"
    @blur="$emit('blur', $event)"
  >
    <template v-if="icon" v-slot:[iconAppendPosition]>
      <q-icon :name="icon" />
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          Sem resultados
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import countries from './supportData/countries'

export default {
  name: 'JalanCountry',
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
    behavior: {
      default: 'default',
      type: String
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
    countryOptions () {
      return countries.map(e => {
        return {
          value: e.label,
          label: e.label
        }
      })
    },

    filteredOptions () {
      if (!this.searchValue) return this.countryOptions

      const needle = this.normalizeString(this.searchValue)
      const options = this.countryOptions.filter(e => this.normalizeString(e.label || '').indexOf(needle) > -1)

      return options
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
    normalizeString (str) {
      // normaliza a string para uma pesquisa, assim não considera letras maiusculas/minusculas e acentos
      return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    },

    filterFn (searchValue, update) {
      update(() => {
        this.searchValue = searchValue
      })
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
    },

    showPopup () {
      this.$refs.field.showPopup()
    },

    hidePopup () {
      this.$refs.field.hidePopup()
    }
  }
}
</script>
