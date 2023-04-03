import JFormInput from '../component/form/Input.vue'
import JFormCheckbox from '../component/form/Checkbox.vue'
import JFormSelect from '../component/form/Select.vue'
import JFormOptionGroup from '../component/form/OptionGroup.vue'

import JFormDate from '../component/form/Date.vue'
import JFormHour from '../component/form/Hour.vue'
import JFormDocument from '../component/form/Document.vue'
import JFormPhone from '../component/form/Phone.vue'

import JFormCountry from '../component/form/Country.vue'
import JFormState from '../component/form/State.vue'
import JFormZipCode from '../component/form/ZipCode.vue'

import JFormFileUploader from '../component/form/FileUploader.vue'

import JPrivaceDialog from '../component/privacy/Dialog.vue'

// we globally register our component with Vue
export default ({ app }) => {
  // app.component('my-component', MyComponent)
  // app.component('another-test', AnotherTest)
  // app.component('one-more', OneMore)
  app.component('j-form-input', JFormInput)
  app.component('j-form-checkbox', JFormCheckbox)
  app.component('j-form-select', JFormSelect)
  app.component('j-form-option-group', JFormOptionGroup)

  app.component('j-form-date', JFormDate)
  app.component('j-form-hour', JFormHour)
  app.component('j-form-document', JFormDocument)
  app.component('j-form-phone', JFormPhone)

  app.component('j-form-country', JFormCountry)
  app.component('j-form-state', JFormState)
  app.component('j-form-zip-code', JFormZipCode)

  app.component('j-form-file-uploader', JFormFileUploader)

  app.component('j-privacy-dialog', JPrivaceDialog)
}