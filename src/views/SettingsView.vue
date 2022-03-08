<script setup lang="ts">
import { debounce, useQuasar, ValidationRule } from 'quasar'
import { computed, ref } from 'vue'
import { useStore } from '../store'
import { Actions } from '../store/action-types'
import FilenameCreator from '../services/FilenameCreator'
import DateConverter from '../services/DateConverter'
import ApiClientService from '../services/ApiClientService'
import { FileDownloader } from '../services/FileDownloader'
import { cloneDeep } from '../services/ObjectHelper'

const EXPORT_FILENAME_SUFFIX = 'settings'

const quasar = useQuasar()
const store = useStore()

const notEmptyAndNoSpecialCharactersRules: ValidationRule[] = [
  (val) => (val !== null && val !== '') || 'Please enter something.',
  (val) =>
    /^[a-zA-Z0-9-]+$/.test(val) ||
    'Please only use letters, numbers, underscores and hyphens.',
]

const deviceId = ref('')
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
  .dispatch(Actions.FETCH_SETTINGS)
  .then(() => {
    isLoading.value = false
    deviceId.value = store.state.deviceId
    siteName.value = store.state.siteName
    systemTime.value = store.state.systemTime
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

function onSubmit() {
  store
    .dispatch(Actions.SAVE_SETTINGS, {
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
  <div class="q-pa-md q-mx-auto" style="max-width: 400px">
    <q-form
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      class="q-gutter-md"
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
      <q-btn label="Save" type="submit" color="primary" />
    </q-form>
    <q-btn
      class="q-my-md"
      label="Export"
      color="primary"
      @click="onExportButtonClick"
    />
  </div>
</template>
