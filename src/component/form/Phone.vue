<template>
  <div>
    <div v-if="label" class="text-body2 q-ma-xs"><span v-html="labelData" /></div>
    <div class="row">
      <q-select
        ref="ddi"
        class="col-auto q-pr-sm"
        :class="inputClass"
        v-model="ddi"

        :disable="disable"
        :readonly="readonly"

        :rules="[...rules]"
        :options="ddiList"
        emit-value map-options

        :filled="inputStyle === 'filled'"
        :outlined="inputStyle === 'outlined'"
        :dense="dense"
        :color="color"
        :hide-bottom-space="hideBottomSpace"
      >
        <template v-slot:selected-item="scope">
          <img :src="scope.opt.flag" width="30" class="q-mr-md" />
          {{ scope.opt.label }}
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
            <q-item-section avatar>
              <img :src="scope.opt.flag" width="30" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <!-- {{ phone }} -->
      <q-input
        ref="phone"
        class="col"
        :class="inputClass"
        v-model="phone"

        :placeholder="placeholder"
        :hint="hint"

        type="tel"
        :mask="(ddi === '55' && phone) ? (phone.length < 11 ? '(##) ####-#####' : '(##) # ####-####') : ''"
        unmasked-value

        :loading="loading"
        :disable="disable"
        :readonly="readonly"

        :rules="[
          ...rules,
          val => !val || (ddi === '55' ? val.length >= 10 : val.length >= 7) || 'Formato incorreto'
        ]"
        :lazy-rules="true"

        :filled="inputStyle === 'filled'"
        :outlined="inputStyle === 'outlined'"
        :dense="dense"
        :color="color"
        :hide-bottom-space="hideBottomSpace"

        @focus="$refs.phone.resetValidation(); $emit('focus', $event)"
        @blur="$emit('blur', $event)"
      >
        <template v-if="icon" v-slot:[iconAppendPosition]>
          <q-icon :name="icon" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
import ddi from './supportData/ddi'

export default {
  name: 'JalanPhone',
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
      ddi: '',
      phone: ''
    }
  },
  computed: {
    ddiList () {
      const ddiList = []
      for (const key in ddi) {
        if (ddi[key].TelPref) {
          ddiList.push({
            value: ddi[key].TelPref,
            label: '+' + ddi[key].TelPref,
            name: ddi[key].Name,
            flag: `https://jalanevents.s3.amazonaws.com/flags/${key}.svg`
          })
        }
        ddiList.sort((a, b) => parseInt(a.value) - parseInt(b.value))
      }
      return ddiList
    },

    mountedPhone () {
      return (this.ddi && this.phone) ? '+' + this.ddi + ' ' + this.phone : ''
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

  watch: {
    modelValue (val) {
      if (val) {
        const phoneParts = val.split(' ')
        if (phoneParts.length === 2) {
          this.ddi = phoneParts[0].replace('+', '')
          this.phone = phoneParts[1]
        }
      }
    },

    mountedPhone (val) {
      setTimeout(() => {
        this.$emit('update:model-value', this.mountedPhone)
      }, 100)
    }
  },

  methods: {
    async validate () {
      const responseDDI = await this.$refs.ddi.validate()
      const responsePhone = await this.$refs.phone.validate()
      if (responseDDI && responsePhone) this.$emit('on-validate-success')
      else this.$emit('on-validate-error')
      return responseDDI && responsePhone
    },

    resetValidation () {
      this.$refs.phone.resetValidation()
    },

    focus () {
      this.$refs.phone.focus()
    },

    blur () {
      this.$refs.phone.blur()
    }
  },

  mounted () {
    this.ddi = '55'
    if (this.modelValue) {
      const phoneParts = this.modelValue.split(' ')
      if (phoneParts.length === 2) {
        this.ddi = phoneParts[0].replace('+', '')
        this.phone = phoneParts[1]
      }
    }
  }
}
</script>
