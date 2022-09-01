<script setup lang="ts">
import { debounce, useQuasar, ValidationRule } from 'quasar'
import { computed, Ref, ref } from 'vue'
import ExportImport from '../components/ExportImport.vue'
import FilenamePreview from '../components/FilenamePreview.vue'
import ApiClientService from '../helpers/ApiClientService'
import DateConverter from '../helpers/DateConverter'
import { useSettingsStore } from '../stores/settings'
import { usePropertiesStore } from 'src/stores/properties'

const propertiesStore = usePropertiesStore()
const quasar = useQuasar()
const settingsStore = useSettingsStore()

const notEmptyAndNoSpecialCharactersRules: ValidationRule[] = [
  (val) => (val !== null && val !== '') || 'Please enter something.',
  (val) =>
    /^[a-zA-Z0-9-]+$/.test(val) ||
    'Please only use letters, numbers, underscores and hyphens.',
]

const noTimeZoneSelected: ValidationRule[] = [
  (val) => (val !== null && val !== '') || 'Please select a time zone.',
]

const availableTimeZones: Ref<string[]> = ref([])
const deviceName = ref('')
const filteredTimeZones: Ref<string[]> = ref([])
const isLoadingSettings = ref(true)
const siteName = ref('')
const systemTime = ref(new Date())
const timeZone = ref('')

const date = computed({
  get: () => {
    if (!systemTime.value || !timeZone.value) {
      return ''
    }
    return DateConverter.formatDateAsDashedYearMonthDayInTimeZone(
      systemTime.value,
      timeZone.value,
    )
  },
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
  get: () => {
    if (!systemTime.value || !timeZone.value) {
      return ''
    }
    return DateConverter.formatDateAsHoursColonMinutesInTimeZone(
      systemTime.value,
      timeZone.value,
    )
  },
  set: debounce((value) => {
    const hours = parseInt(value.slice(0, 2))
    const minutes = parseInt(value.slice(3, 5))
    const date = new Date(systemTime.value.valueOf())
    date.setHours(hours)
    date.setMinutes(minutes)
    systemTime.value = date
  }, 500),
})

propertiesStore.fetchDeviceId().catch((error) => {
  quasar.notify({
    message: 'The device ID could not be loaded.',
    caption: error.message ? error.message : '',
    color: 'negative',
  })
})

settingsStore
  .fetchSettings()
  .then(() => {
    isLoadingSettings.value = false
    loadSettingsFromStore()
  })
  .catch((error) => {
    quasar.notify({
      message: 'The settings could not be loaded.',
      caption: error.message ? error.message : '',
      color: 'negative',
    })
  })

ApiClientService.getAvailableTimeZones()
  .then((data) => {
    availableTimeZones.value = data.timeZones
    filteredTimeZones.value = data.timeZones
  })
  .catch((error) => {
    quasar.notify({
      message: 'The time zones available could not be loaded.',
      caption: error.message ? error.message : '',
      color: 'negative',
    })
  })

function filterTimeZones(
  val: string,
  update: (callbackFn: () => void) => void,
) {
  update(() => {
    const needle = val.toLowerCase()
    filteredTimeZones.value = availableTimeZones.value.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1,
    )
  })
}

function loadSettingsFromStore() {
  deviceName.value = settingsStore.deviceName
  siteName.value = settingsStore.siteName
  systemTime.value = settingsStore.systemTime
  timeZone.value = settingsStore.timeZone
}

function onSubmit() {
  settingsStore
    .patchSettings({
      deviceName: deviceName.value,
      siteName: siteName.value,
      systemTime: systemTime.value,
      timeZone: timeZone.value,
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
      class="q-gutter-sm q-mb-xl"
      @submit="onSubmit"
    >
      <q-input
        v-model="siteName"
        :disable="isLoadingSettings"
        label="Site name"
        lazy-rules
        outlined
        :rules="notEmptyAndNoSpecialCharactersRules"
      />
      <q-input
        v-model="deviceName"
        :disable="isLoadingSettings"
        label="Device name"
        lazy-rules
        outlined
        :rules="notEmptyAndNoSpecialCharactersRules"
      />
      <q-input
        v-model="propertiesStore.deviceId"
        class="q-pb-md"
        label="Device ID"
        outlined
        readonly
      />
      <q-select
        v-model="timeZone"
        :disable="isLoadingSettings"
        fill-input
        hide-selected
        input-debounce="0"
        label="Time zone"
        lazy-rules
        :options="filteredTimeZones"
        outlined
        :rules="noTimeZoneSelected"
        use-input
        @filter="filterTimeZones"
      >
        <template #no-option>
          <q-item>
            <q-item-section>No results</q-item-section>
          </q-item>
        </template>
      </q-select>
      <div class="row q-mb-lg">
        <div class="q-mr-md">
          <q-input
            v-model="date"
            :disable="isLoadingSettings"
            label="Date"
            outlined
            stack-label
            type="date"
          />
        </div>
        <div>
          <q-input
            v-model="time"
            :disable="isLoadingSettings"
            label="Time"
            outlined
            stack-label
            type="time"
          />
        </div>
      </div>
      <FilenamePreview
        :device-name="deviceName"
        :site-name="siteName"
        :system-time="systemTime"
        :time-zone="timeZone"
      />
      <q-btn
        color="primary"
        label="Save"
        type="submit"
      />
    </q-form>
    <ExportImport @imported="loadSettingsFromStore" />
  </div>
</template>
