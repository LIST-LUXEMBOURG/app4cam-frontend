<!--
Copyright (C) 2022-2024  Luxembourg Institute of Science and Technology

App4Cam is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

App4Cam is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with App4Cam.  If not, see <https://www.gnu.org/licenses/>.
-->
<script setup lang="ts">
import { QBtn, QFile, QForm, QIcon, useQuasar, ValidationRule } from 'quasar'
import { ref } from 'vue'
import { FileDownloader } from '../helpers/FileDownloader'
import FilenameCreator from '../helpers/FilenameCreator'
import { useSettingsStore } from '../stores/settings'
import NotificationCreator from 'src/helpers/NotificationCreator'

const EXPORT_FILENAME_SUFFIX = 'settings'

const quasar = useQuasar()
const store = useSettingsStore()

const checkNoFile: ValidationRule[] = [
  (val) => (val !== null && val !== '') || 'Please select a file.',
]

const emit = defineEmits<{
  imported: []
}>()

const file = ref(null)

function onExportButtonClick() {
  store
    .fetchSettings()
    .then(() => {
      const settingsToExport = store.persistentSettings
      const filename = FilenameCreator.createFilename({
        deviceName: store.current.general.deviceName,
        siteName: store.current.general.siteName,
        systemTime: new Date(store.current.general.systemTime),
        timeZone: store.current.general.timeZone,
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
        caption: error.response.data.message
          ? error.response.data.message
          : error.message,
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
      .catch((error: unknown) => {
        NotificationCreator.showErrorNotification(
          quasar,
          error,
          'The settings could not be imported.',
        )
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
  <q-btn
    color="primary"
    label="Export settings"
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
