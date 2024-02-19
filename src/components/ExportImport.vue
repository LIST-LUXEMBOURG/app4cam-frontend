<script setup lang="ts">
// © 2022-2023 Luxembourg Institute of Science and Technology
import { QBtn, QFile, QForm, QIcon, useQuasar, ValidationRule } from 'quasar'
import { ref } from 'vue'
import { FileDownloader } from '../helpers/FileDownloader'
import FilenameCreator from '../helpers/FilenameCreator'
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
  store
    .fetchSettings()
    .then(() => {
      const settingsToExport = store.getPersistentSettings()
      const filename = FilenameCreator.createFilename({
        deviceName: store.general.deviceName,
        siteName: store.general.siteName,
        systemTime: new Date(store.general.systemTime),
        timeZone: store.general.timeZone,
        extension: 'json',
        suffix: EXPORT_FILENAME_SUFFIX,
      })
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
    store.updatePersistentSettings(json)
    store
      .uploadPersistentSettings()
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
  <h6 class="q-mb-md">Export & import settings</h6>
  <div class="q-px-md">
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
  </div>
</template>
