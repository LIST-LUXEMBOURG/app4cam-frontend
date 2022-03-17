<script
  setup
  lang="ts"
>
import { debounce, useQuasar, ValidationRule } from 'quasar'
import { computed, ref } from 'vue'
import FilenameCreator from '../services/FilenameCreator'
import DateConverter from '../services/DateConverter'
import ApiClientService from '../services/ApiClientService'
import { FileDownloader } from '../services/FileDownloader'
import { cloneDeep } from '../services/ObjectHelper'
import { useSettingsStore } from '../stores/settings'

const EXPORT_FILENAME_SUFFIX = 'settings'

const quasar = useQuasar()
const store = useSettingsStore()

const notEmptyAndNoSpecialCharactersRules: ValidationRule[] = [
  (val) => (val !== null && val !== '') || 'Please enter something.',
  (val) =>
    /^[a-zA-Z0-9-]+$/.test(val) ||
    'Please only use letters, numbers, underscores and hyphens.',
]

const deviceId = ref('')
const file = ref(null)
const isLoading = ref(true)
const siteName = ref('')
const systemTime = ref(new Date())

const date = computed({
  get: () => DateConverter.convertDateToIso8601Date(systemTime.value),
  set: (value) => {
    const year = parseInt(value.slice(0, 4))
    const month = parseInt(value.slice(5, 7))
    const day = parseInt(value.slice(8, 10))
    const date = new Date(systemTime.value.valueOf())
    date.setFullYear(year)
    date.setMonth(month - 1)
    date.setDate(day)
    systemTime.value = date
  },
})
const time = computed({
  get: () => systemTime.value.getHours() + ':' + systemTime.value.getMinutes(),
  set: debounce((value) => {
    const hours = parseInt(value.slice(0, 2))
    const minutes = parseInt(value.slice(3, 5))
    const date = new Date(systemTime.value.valueOf())
    date.setHours(hours)
    date.setMinutes(minutes)
    systemTime.value = date
  }, 500),
})
const filenamePreview = computed(() =>
  FilenameCreator.createFilename(
    deviceId.value,
    siteName.value,
    systemTime.value,
    'extension',
  ),
)

store
  .fetchSettings()
  .then(() => {
    isLoading.value = false
    deviceId.value = store.deviceId
    siteName.value = store.siteName
    systemTime.value = store.systemTime
  })
  .catch((error) => {
    quasar.notify({
      message: 'The settings could not be loaded.',
      caption: error.message ? error.message : '',
      color: 'negative',
    })
  })

function onExportButtonClick() {
  ApiClientService.getSettings()
    .then((settings) => {
      const settingsToExport: Partial<SettingsDto> = cloneDeep(settings)
      delete settingsToExport.systemTime
      const filename = FilenameCreator.createFilename(
        deviceId.value,
        siteName.value,
        new Date(),
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
        deviceId.value = store.deviceId
        siteName.value = store.siteName
        quasar.notify({
          message: 'The settings were imported.',
          color: 'positive',
        })
      })
      .catch((error) => {
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

function onImportButtonClick() {
  if (!file.value) {
    return
  }
  const reader = new FileReader()
  reader.onload = importSettings
  reader.readAsText(file.value)
}

function onSubmit() {
  store
    .patchSettings({
      deviceId: deviceId.value,
      siteName: siteName.value,
      systemTime: systemTime.value,
    })
    .then(() => {
      quasar.notify({
        message: 'The settings were saved.',
        color: 'positive',
      })
    })
    .catch((error) => {
      quasar.notify({
        message: 'The settings could not be saved.',
        caption: error.message ? error.message : '',
        color: 'negative',
      })
    })
}
</script>

<template>
  <div
    class="q-pa-md q-mx-auto text-left"
    style="max-width: 400px"
  >
    <h5 class="q-mb-lg q-mt-none">General settings</h5>
    <q-form
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      class="q-gutter-sm"
      @submit="onSubmit"
    >
      <q-input
        v-model="siteName"
        outlined
        :disable="isLoading"
        label="Site name"
        lazy-rules
        :rules="notEmptyAndNoSpecialCharactersRules"
      />
      <q-input
        v-model="deviceId"
        outlined
        :disable="isLoading"
        label="Device ID"
        lazy-rules
        :rules="notEmptyAndNoSpecialCharactersRules"
      />
      <div class="row">
        <div class="q-mr-md">
          <q-input
            v-model="date"
            outlined
            type="date"
            label="Date"
            stack-label
            :disable="isLoading"
          />
        </div>
        <div>
          <q-input
            v-model="time"
            outlined
            type="time"
            label="Time"
            stack-label
            :disable="isLoading"
          />
        </div>
      </div>
      <p class="text-left text-grey-7">
        The date and and time shown above are in your host's system time zone.
        The trap internally uses UTC time.
      </p>
      <h6 class="q-mb-md q-mt-lg">Filename preview</h6>
      <p data-test-id="filenamePreview">{{ filenamePreview }}</p>
      <q-btn
        label="Save"
        type="submit"
        color="primary"
      />
    </q-form>

    <h5 class="q-mt-xl q-mb-md">Export & import</h5>
    <q-btn
      label="Export"
      color="primary"
      @click="onExportButtonClick"
    />
    <q-file
      v-model="file"
      accept="application/json"
      class="q-mt-md"
      outlined
      label="Settings file"
    >
      <template #prepend>
        <q-icon
          name="upload"
          @click.stop
        />
      </template>
      <template #after>
        <q-btn
          label="Import"
          color="primary"
          @click="onImportButtonClick"
        />
      </template>
    </q-file>
  </div>
</template>
