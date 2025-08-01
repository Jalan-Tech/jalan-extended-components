<template>
  <div>
    <div v-if="label" class="text-body2 q-ma-xs"><span v-html="labelData" /></div>
    <q-select
      ref="field"
      options-selected-class="text-bold bg-grey-2"

      @update:model-value="$emit('update:model-value', $event)"
      :model-value="modelValue"

      :placeholder="placeholder"
      :hint="hint"

      :multiple="multiple && (typeof modelValue) !== 'string'"
      :options="filteredOptions"
      :option-label="optionLabel"

      :use-chips="useChips !== undefined ? useChips : !!multiple"
      :use-input="useInput"
      :emit-value="emitValue"
      :map-options="mapOptions"
      :input-debounce="0"

      :loading="loading"
      :disable="disable"
      :readonly="readonly"

      :filled="inputStyle === 'filled'"
      :outlined="inputStyle === 'outlined'"
      :dense="dense"
      :color="color"
      :hide-bottom-space="hideBottomSpace"
      :behavior="behavior"
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
      <template v-if="hasDetails && !showDetails" v-slot:selected-item="scope">
        <img v-if="scope.opt.img" :src="scope.opt.img" class="q-mr-sm" style="height: 30px; width: 40px; object-fit: contain;" />
        <div>
          {{ scope.opt.label }}
          <div v-if="scope.opt.caption" class="text-caption">{{ scope.opt.caption }}</div>
        </div>
      </template>
      <template v-if="hasDetails" v-slot:option="scope">
        <q-item
          v-bind="scope.itemProps"
        >
          <q-item-section side v-if="scope.opt.img">
            <img :src="scope.opt.img" style="height: 30px; width: 40px; object-fit: contain;" />
          </q-item-section>
          <q-item-section>
            <q-item-label><template v-html="scope.opt[optionLabel] || scope.opt" /></q-item-label>
            <q-item-label v-if="scope.opt.caption" caption>{{ scope.opt.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Sem resultados
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <div class="row q-pb-md" v-if="showDetails && modelValue" style="max-width: 900px">
      <div v-if="selectedItem.description" class="col-md-7 col-12 q-pr-md q-mb-md" v-html="selectedItem.description" />
      <div v-if="selectedItem.img" class="col-md-5 col-12" style="max-height: 450px">
        <q-img :src="selectedItem.img" contain/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JalanSelect',
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

    // opcionais espeficicos
    options: {
      required: true,
      type: Array,
      default: () => []
    },
    optionLabel: {
      default: 'label',
      type: String
    },
    multiple: {
      type: Boolean,
      default: false
    },
    hasDetails: {
      type: Boolean,
      default: false
    },
    showDetails: {
      type: Boolean,
      default: false
    },

    // configurações especificas
    useChips: {
      type: Boolean
    },
    useInput: {
      default: false,
      type: Boolean
    },
    emitValue: {
      default: true,
      type: Boolean
    },
    mapOptions: {
      default: true,
      type: Boolean
    },
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
    filteredOptions () {
      if (!this.searchValue) return this.options

      const needle = this.normalizeString(this.searchValue)
      const options = this.options.filter(v => this.normalizeString(v[this.optionLabel] || v || '').indexOf(needle) > -1)

      return options
    },
    selectedItem () {
      if (this.modelValue && this.hasDetails && this.showDetails) {
        const selectedItem = this.options.find(e => e.value === this.modelValue)
        return selectedItem || null
      }
      return null
    },

    iconAppendPosition () {
      return this.iconPosition === 'right' ? 'append' : 'prepend'
    },

    labelData () {
      let label = this.label
      if (this.requiredTag === 'required') label += ' &nbsp; <small class="text-grey text-bold"><i>Obrigatório</i></small>&nbsp;'
      if (this.requiredTag === 'optional') label += ' &nbsp; <small class="text-grey text-weight-regular"><i>Opcional</i></small>&nbsp;'
      return label
    },

    hasError () {
      return this.$refs.field.hasError
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
