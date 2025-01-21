<template>
  <div>
    <div v-if="label" class="text-body2 q-ma-xs"><span v-html="labelData" /></div>
    <q-input
      ref="field"
      @update:model-value="emitText"
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
    modelValue: {
      type: String,
      default: ''
    },
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
    rules: {
      type: Array,
      default: () => []
    },
    maxLength: {
      type: [String, Number],
      default: undefined
    },
    inputStyle: {
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

  data() {
    return {
      lastInputTime: null, // Tempo da última entrada
      debounceTimer: null, // Referência ao timer para debouncing
      bufferedValue: '' // Buffer temporário para os caracteres
    }
  },

  computed: {
    iconAppendPosition() {
      return this.iconPosition === 'right' ? 'append' : 'prepend'
    },
    labelData() {
      let label = this.label
      if (this.requiredTag === 'required') label += ' &nbsp; <small class="text-grey text-bold"><i>Obrigatório</i></small>&nbsp;'
      if (this.requiredTag === 'optional') label += ' &nbsp; <small class="text-grey text-weight-regular"><i>Opcional</i></small>&nbsp;'
      return label
    }
  },

  methods: {
    async validate() {
      const response = await this.$refs.field.validate()
      if (response) this.$emit('on-validate-success')
      else this.$emit('on-validate-error')
      return response
    },

    resetValidation() {
      this.$refs.field.resetValidation()
    },

    normalizeTextUnicode(text) {
      if (!text) return ''
      return text.replace(/[$&+,:;=?[\]@#|{}'<>.^*()%!-/°®ŧ←↓→øþæßðđŋħˀĸł«»©“”µ─·¹²³£¢¬§]/, '')
        .replace(/[\u{1D400}-\u{1D7FF}]/gu, char => {
          const charMap = {
            '𝓔': 'E',
            '𝓶': 'm',
            '𝓾': 'u',
            '𝓭': 'd',
            '𝓲': 'i',
            '𝓪': 'a',
            '𝓬': 'c',
            '𝓸': 'o',
            '𝓱': 'h',
            '𝓳': 'j',
            '𝔄': 'A',
            '𝔅': 'B',
            '𝔒': 'O',
            '𝔏': 'L',
            '𝔖': 'S',
            '𝔻': 'D',
            '𝔊': 'G',
            '𝔑': 'N',
            '𝔘': 'U',
            '𝕬': 'A',
            '𝕭': 'B',
            '𝕮': 'C',
            '𝕯': 'D',
            '𝕰': 'E',
            '𝙰': 'A',
            '𝙱': 'B',
            '𝙲': 'C',
            '𝙳': 'D',
            '𝙴': 'E',
            '𝚊': 'a',
            '𝚋': 'b',
            '𝚌': 'c',
            '𝚍': 'd',
            '𝚎': 'e',
            '𝕒': 'a',
            '𝕓': 'b',
            '𝕔': 'c',
            '𝕕': 'd',
            '𝕖': 'e',
            '𝔸': 'A',
            '𝔹': 'B',
            '𝕆': 'O',
            '𝕀': 'I',
            '𝕋': 'T',
            '𝖆': 'a',
            '𝖇': 'b',
            '𝖈': 'c',
            '𝖉': 'd',
            '𝖊': 'e',
            '𝐴': 'A',
            '𝐵': 'B',
            '𝑂': 'O',
            '𝐷': 'D',
            '𝑇': 'T',
            '𝑎': 'a',
            '𝑏': 'b',
            '𝑐': 'c',
            '𝑑': 'd',
            '𝑒': 'e',
            '𝐹': 'F',
            '𝐼': 'I'
          }
          return charMap[char] || char
        })
    },

    emitText(value) {
      // Buffer temporário para os caracteres
      this.bufferedValue += value

      // Limpar o timeout anterior para garantir que o valor será enviado após o intervalo
      clearTimeout(this.debounceTimer)

      // Definir o novo timer
      this.debounceTimer = setTimeout(() => {
        const normalizedValue = this.normalizeTextUnicode(this.bufferedValue)
        this.$emit('update:model-value', normalizedValue) // Emitir o valor final
        this.bufferedValue = '' // Limpar o buffer após o envio
      }, 300) // O valor será processado após 300ms
    },

    focus() {
      this.$refs.field.focus()
    },

    blur() {
      this.$refs.field.blur()
    }
  }
}
</script>
