<template>
  <div class="full-width" :class="{ 'q-pb-md': !hideBottomSpace }">
    <q-uploader
      ref="uploader"
      url="http://localhost:4444/upload"

      hide-upload-btn
      flat
      bordered

      :color="color"
      :text-color="textColor"
      :style="componentStyle"

      :disable="disable"
      :readonly="readonly"

      :max-file-size="maxFileSize"
      :accept="extensions.join(',')"
      @rejected="onRejected"
      @added="onAdded"
    >
      <template v-slot:header="scope">
        <div class="row q-pa-sm q-gutter-xs" :class="$q.screen.lt.sm ? 'column' : 'items-center no-wrap'">
          <q-spinner class="q-mr-sm" size="md" v-if="isUploading"/>
          <div class="col q-pa-xs" :class="$q.screen.lt.sm? 'row q-gutter-sm items-center':''">
            <div class="q-uploader__title"><span v-html="labelData" /></div>
            <div class="text-negative" v-if="rejected.extensionAccept">Formato do arquivo inválido. Arquivos aceitos: {{ extensions }}</div>
            <div class="text-negative" v-else-if="rejected.maxFileSize">O arquivo é maior que 10MB.</div>
            <div class="text-negative" v-else-if="isDirty && required && !file && !modelValue">Upload obrigatório.</div>
            <div class="text-negative" v-else-if="uploadError">Erro ao realizar upload, tente novamente.</div>
            <div class="text-positive" v-else-if="successfulUpload">Arquivo salvo.</div>
            <div class="q-uploader__subtitle" v-else-if="file">{{ scope.uploadSizeLabel }}</div>
            <div class="text-grey" v-else-if="hint">{{ hint }}</div>
          </div>
          <div v-if="scope.canAddFiles && modelValue === ''">
            <q-btn type="a" icon="sym_o_cloud_upload" label="Adicionar" dense flat @click="rejected = { extensionAccept: false, maxFileSize: false }" :disable="disable">
              <q-uploader-add-trigger v-if="!disable" />
            </q-btn>
          </div>
          <div v-else>
            <q-btn type="a" icon="sym_o_cloud_upload" label="Trocar" dense flat @click="removeFile(scope, $event)" :disable="disable">
              <q-uploader-add-trigger v-if="!disable" />
            </q-btn>
            <q-btn icon="sym_o_delete" label="Excluir" dense flat @click="removeFile(scope, $event)" :disable="disable"/>
          </div>
        </div>
      </template>
      <template v-slot:list="scope">
        <template v-if="modelValue">
          <div class="q-pt-xs">
            <q-btn
              color="primary"
              outline no-caps
              icon="sym_o_picture_as_pdf"
              :label="fileName(modelValue)"
              type="a"
              :href="modelValue"
              target="_blank"
            />
          </div>
        </template>
        <template v-else>
          <div v-for="file in scope.files" :key="file.__key">
            <div v-if="scope.files[0]" class="bg-grey-1 q-py-xs q-px-sm text-caption q-uploader__file">
              <div class="full-width ellipsis text-bold rounded-border text-subtitle2">
                {{ scope.files[0].name }}
              </div>
              <div>
                {{ scope.files[0].__sizeLabel }}
              </div>
            </div>
          </div>
        </template>
      </template>
    </q-uploader>
  </div>
</template>

<script>
import { uid, getCssVar } from 'quasar'

export default {
  name: 'JalanFileUploader',
  props: {
    // obrigatorio
    modelValue: {
      type: String
    },
    // opcionais
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
    // opcionais especificos
    s3Folder: {
      require: true,
      type: String,
      default: 'file/'
    },
    extensions: {
      type: String,
      default: undefined
    },
    manualUpload: {
      type: Boolean,
      default: false
    },

    // Modo desabilitado
    disable: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },

    // Regras
    required: {
      type: [String, Boolean],
      default: false
    },
    maxFileSize: {
      type: [String, Number],
      default: '10485760'
    },

    // Estilo
    componentWidth: {
      type: [String, Number],
      default: '100%'
    },
    componentHeight: {
      type: [String, Number],
      default: 'auto'
    },
    style: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'grey-2'
    },
    textColor: {
      type: String,
      default: 'dark'
    },
    hideBottomSpace: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      rejected: {
        extensionAccept: false,
        maxFileSize: false
      },
      file: '',
      blob: '',
      isUploading: false,
      successfulUpload: false,
      uploadError: false,
      isDirty: false
    }
  },
  computed: {
    componentStyle () {
      let componentStyle = 'width: '
      componentStyle += (typeof this.componentWidth === 'number') ? this.componentWidth + 'px' : this.componentWidth
      componentStyle += '; height: '
      componentStyle += (typeof this.componentHeight === 'number') ? this.componentHeight + 'px' : this.componentHeight

      if (this.rejected.extensionAccept || this.rejected.maxFileSize || (this.isDirty && this.required && !this.file && !this.modelValue) || this.uploadError) {
        componentStyle += '; border-color: ' + getCssVar('negative')
      }

      return componentStyle + ';' + this.style
    },

    hasUploadedFile () {
      return !!(this.file || this.modelValue)
    },

    labelData () {
      let label = this.label
      if (this.requiredTag === 'required') label += ' &nbsp; <small class="text-grey text-bold"><i>Obrigatório</i></small>&nbsp;'
      if (this.requiredTag === 'optional') label += ' &nbsp; <small class="text-grey text-weight-regular"><i>Opcional</i></small>&nbsp;'
      return label
    }
  },
  watch: {
    isUploading (val) {
      this.$emit('isUploading', val)
    }
  },
  methods: {
    removeFile (scope, $event) {
      scope.removeQueuedFiles($event)
      this.file = ''
      this.resetValidation()
      this.$emit('update:model-value', '')
      this.successfulUpload = false
      this.uploadError = false
    },

    onAdded (files) {
      this.file = files[0]
      if (!this.manualUpload) this.uploadFiles()
      this.validate()
    },

    onRejected (rejectedEntries) {
      if (rejectedEntries.length) {
        this.rejected = {
          extensionAccept: rejectedEntries[0].failedPropValidation === 'accept',
          maxFileSize: rejectedEntries[0].failedPropValidation === 'max-file-size'
        }
      }
      this.validate()
      // this.$q.notify({
      //   type: 'negative',
      //   message: `Arquivo inválido. Por favor, escolha um arquivo com uma das seguintes extensões: ${this.extensions.toUpperCase()}`
      // })
    },

    fileName (url) {
      if (typeof url === 'string' && url) {
        const fileArray = url.split('/')
        if (fileArray.length > 1) return fileArray[fileArray.length - 1]
      }
      return ''
    },

    // uploadSignedURL
    uploadSignedURL ({ data, blob }) {
      return this.$axios.post('https://5h22pxjduj.execute-api.us-east-1.amazonaws.com/v1/s3/uploadsignedurl', data)
        .then(async (response) => {
          const resp = JSON.parse(response.data)
          if (resp.uploadURL) {
            try {
              const success = await fetch(resp.uploadURL, { method: 'PUT', body: blob })
              return success.ok
            } catch (error) {
              return false
            }
          } else {
            return false
          }
        })
        .catch(() => {
          return false
        })
    },

    async uploadFiles () {
      if (!this.file) return
      this.isUploading = true
      this.$emit('uploading', true)

      // Criar uid para o file
      const type = this.s3Folder + '/'
      const fileNameArray = this.file.name.split('.')
      const fileName = uid() + '.' + fileNameArray[fileNameArray.length - 1]
      const keyFile = type + fileName

      // Cria o blob a ser enviado
      this.blob = new Blob([this.file], { type: this.file.type })

      const data = {
        contentType: this.file.type,
        key: keyFile
      }

      return this.uploadSignedURL({ data, blob: this.blob })
        .then(response => {
          if (response) {
            const urlS3 = 'https://jalanevents.s3.amazonaws.com/' + keyFile
            this.$emit('update:model-value', urlS3)

            this.successfulUpload = true
            this.uploadError = false
            return urlS3
          } else {
            this.$q.notify({
              message: 'Erro ao realizar upload',
              color: 'negative',
              position: 'top'
            })

            this.uploadError = true
            this.successfulUpload = false
            return false
          }
        })
        .catch(err => {
          console.error(err)
          this.uploadError = false
          this.successfulUpload = false
        })
        .finally(() => {
          this.isUploading = false
          this.$emit('uploading', false)
          return false
        })
    },

    async validate () {
      this.isDirty = true
      let response = true
      if (this.rejected.extensionAccept || this.rejected.maxFileSize) response = false
      if (!!this.required && !this.modelValue && !this.file) response = false
      if (response) this.$emit('on-validate-success')
      else this.$emit('on-validate-error')
      return response
    },

    resetValidation () {
      this.isDirty = false
      this.rejected = {
        extensionAccept: false,
        maxFileSize: false
      }
    }
  }
}
</script>
