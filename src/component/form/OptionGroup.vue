<template>
  <div>
    <div v-if="label" class="text-body2 q-ma-xs"><span v-html="labelData" /></div>
    <q-option-group
      ref="field"
      @update:model-value="value => { validate(); $emit('update:model-value', value) }"
      :model-value="modelValue"
      :options="optionsList"

      :type="type"

      :disable="disable"

      :color="color"
      :inline="inline"
      :size="size"
      :dense="dense"
    >
    </q-option-group>
    <q-slide-transition :duration="200" class="q-pl-sm">
      <div v-if="isDirty && required && (!modelValue || modelValue.length === 0)" class="text-caption text-negative">
        {{ typeof required === 'string' ? required : multiple ? `Escolha no mínimo ${minLength || 1} opção` : 'É obrigatório escolher uma opção' }}
      </div>
      <div v-else-if="isDirty && multiple && maxLength && modelValue.length > maxLength" class="text-caption text-negative">
        Escolha no máximo {{ maxLength }} opções
      </div>
      <div v-else-if="multiple && maxLength" class="text-caption text-grey-7">
        Selecionado {{ modelValue.length }} de {{ maxLength }} opções
      </div>
      <div v-else-if="hint" class="text-caption text-grey-7">{{ hint }}</div>
    </q-slide-transition>
  </div>
</template>

<script>
export default {
  name: 'JalanOptionGroup',
  props: {
    // obrigatórios
    modelValue: {
      required: true,
      type: [Array, String]
    },
    options: {
      type: Array,
      default: () => []
    },
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

    // muda o tipo de grupo
    multiple: {
      type: Boolean,
      default: false
    },

    // Regras
    required: {
      type: Boolean,
      default: null
    },
    maxLength: {
      type: Number,
      default: null
    },
    minLength: {
      type: Number,
      default: null
    },

    // Habilitar/Desabilitar
    disable: {
      type: Boolean,
      default: null
    },

    // estilos
    color: {
      type: String,
      default: 'primary'
    },
    inline: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null
    },
    dense: {
      type: Boolean,
      default: null
    }
  },

  data () {
    return {
      isDirty: false
    }
  },

  computed: {
    type () {
      return this.multiple ? 'checkbox' : 'radio'
    },

    optionsList () {
      return this.options.map(op => {
        // Se tiver marcado o máximo de opções
        if (this.multiple && this.modelValue.length === this.maxLength) {
          return {
            ...op,
            disable: !this.modelValue.includes(op.value)
          }
        }

        return {
          ...op
        }
      })
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
      const response = true
      if (!!this.required && !this.modelValue) response = false
      if (this.multiple && this.maxLength && this.modelValue.length > this.maxLength) response = false
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
