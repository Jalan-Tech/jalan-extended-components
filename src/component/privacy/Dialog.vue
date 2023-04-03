<template>
  <q-dialog
    ref="dialog"

    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"

    :maximized="$q.screen.lt.sm"
    :full-width="$q.screen.lt.sm"
  >
    <q-card
      class="full-height q-pb-none overflow-hidden"
      style="width: 80%; max-width: 960px;"
    >
      <q-toolbar class="q-mt-xs">
        <q-toolbar-title class="text-h6 text-bold text-left">{{ title }}</q-toolbar-title>

        <!-- Se houver uma url para a política, você pode clicar no icon e ir até ela -->
        <q-btn
          v-if="url !== ''"
          flat dense round
          icon="open_in_new"
          @click="openURL"
          color="primary"
        />
        <q-btn
          flat dense round
          class="q-ml-md"
          icon="close"
          v-close-popup
        />
      </q-toolbar>

      <!-- Política de privacidade ques está na url por ser vista aqui -->
      <q-card-section class="full-height" :style="dialogHeight">
        <iframe
          :src="url"
          width="100%"
          :style="dialogHeight"
          style="border: none; height: 87%;"
        />
      </q-card-section>
      <q-card-actions class="absolute-bottom bg-white q-pa-md q-mb-none">
        <q-btn
          color="primary"
          class="full-width"
          label="Li e concordo"
          @click="accepted"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'PrivacyDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Política de Privacidade'
    },
    url: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
    dialogHeight () {
      return 'height: 80%; max-height: ' + this.$q.screen.height - 500
    }
  },
  methods: {
    accepted () {
      this.$emit('accepted')
      setTimeout(() => { this.$refs.dialog.hide() }, 200)
    },
    openURL () {
      window.open(this.url)
    }
  }
}
</script>
