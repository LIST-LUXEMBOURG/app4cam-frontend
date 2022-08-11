<script setup lang="ts">
import { useQuasar, ValidationRule } from 'quasar'
import { SettingsDto } from 'src/settings'
import { ref } from 'vue'
import ApiClientService from '../helpers/ApiClientService'
import { FileDownloader } from '../helpers/FileDownloader'
import FilenameCreator from '../helpers/FilenameCreator'
import { cloneDeep } from '../helpers/ObjectHelper'
import { useSettingsStore } from '../stores/settings'

const EXPORT_FILENAME_SUFFIX = 'settings'

const quasar = useQuasar()
const store = useSettingsStore()

const checkNoFile: ValidationRule[] = [
  (val) => (val !== null && val !== '') || 'Please select a file.',
]

const emit = defineEmits<{
  (event: 'imported'): void
}>()

const file = ref(null)

function onExportButtonClick() {
  ApiClientService.getSettings()
    .then((settings) => {
      const settingsToExport: Partial<SettingsDto> = cloneDeep(settings)
      delete settingsToExport.systemTime
      const filename = FilenameCreator.createFilename(
        store.deviceId,
        store.siteName,
        store.systemTime,
        store.timeZone,
        'json',
        EXPORT_FILENAME_SUFFIX,
      )
      FileDownloader.downloadFile(
        [JSON.stringify(settingsToExport)],
        'text/json',
        filename,
      )
    })
    .catch((error) => {
      quasar.notify({
        message: 'The settings could not be exported.',
        caption: error.message ? error.message : '',
        color: 'negative',
      })
    })
}

function importSettings(event: ProgressEvent<FileReader>) {
  const string = event.target?.result
  if (typeof string === 'string') {
    const json = JSON.parse(string)
    store
      .putSettings(json)
      .then(() => {
        emit('imported')
        quasar.notify({
          message: 'The settings were imported.',
          color: 'positive',
        })
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        quasar.notify({
          message: 'The settings could not be imported.',
          caption: error.message ? error.message : '',
          color: 'negative',
        })
      })
  } else {
    quasar.notify({
      message: 'The settings could not be imported.',
      color: 'negative',
    })
  }
}

function submitImportSettingsForm() {
  if (!file.value) {
    console.log('empty')
    return
  }
  const reader = new FileReader()
  reader.onload = importSettings
  reader.readAsText(file.value)
}
</script>

<template>
  <h5 class="q-mb-md">Export & import</h5>
  <q-btn
    color="primary"
    label="Export"
    @click="onExportButtonClick"
  />
  <q-form
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    class="q-mt-md row justify-between"
    @submit="submitImportSettingsForm"
  >
    <q-file
      v-model="file"
      accept="application/json"
      class="col"
      label="Settings file"
      lazy-rules="ondemand"
      outlined
      :rules="checkNoFile"
    >
      <template #prepend>
        <q-icon
          name="upload"
          @click.stop
        />
      </template>
    </q-file>
    <div class="col-auto q-ml-sm">
      <q-btn
        class="q-mt-sm"
        color="primary"
        label="Import"
        type="submit"
      />
    </div>
  </q-form>
</template>
