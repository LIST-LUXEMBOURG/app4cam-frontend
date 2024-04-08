<script setup lang="ts">
// © 2024 Luxembourg Institute of Science and Technology
import { ValidationRule, debounce, useQuasar } from 'quasar'
import { computed, ref } from 'vue'
import FilenamePreview from '../components/FilenamePreview.vue'
import ApiClientService from '../helpers/ApiClientService'
import DateConverter from '../helpers/DateConverter'
import { usePropertiesStore } from '../stores/properties'
import { useSettingsStore } from '../stores/settings'

const propertiesStore = usePropertiesStore()
const quasar = useQuasar()
const settingsStore = useSettingsStore()

defineProps<{
  isLoadingSettings: boolean
}>()

const noInvalidWiFiPassword: ValidationRule[] = [
  (val) =>
    /^[ -~]{8,63}$/.test(val) ||
    'Please use 8 to 63 printable ASCII characters.',
]
const notEmptyAndNoSpecialCharactersRules: ValidationRule[] = [
  (val) => (val !== null && val !== '') || 'Please enter something.',
  (val) =>
    /^[a-zA-Z0-9-]+$/.test(val) ||
    'Please only use letters, numbers and hyphens.',
]
const noSpecialCharactersIfNotEmptyRules: ValidationRule[] = [
  (val) =>
    /^[a-zA-Z0-9-]*$/.test(val) ||
    'Please only use letters, numbers and hyphens.',
]
const noTimeZoneSelected: ValidationRule[] = [
  (val) => (val !== null && val !== '') || 'Please select a time zone.',
]

const availableTimeZones = ref<string[]>([])
const filteredTimeZones = ref<string[]>([])

const date = computed({
  get: () => {
    if (
      !settingsStore.current.general.systemTime ||
      !settingsStore.current.general.timeZone
    ) {
      return ''
    }
    return DateConverter.formatDateAsDashedYearMonthDayInTimeZone(
      systemTimeAsDate.value,
      settingsStore.current.general.timeZone,
    )
  },
  set: (value) => {
    const year = parseInt(value.slice(0, 4))
    const month = parseInt(value.slice(5, 7))
    const day = parseInt(value.slice(8, 10))
    let date
    if (settingsStore.current.general.systemTime) {
      date = new Date(settingsStore.current.general.systemTime.valueOf())
    } else {
      date = new Date()
    }
    date.setFullYear(year)
    date.setMonth(month - 1)
    date.setDate(day)
    systemTimeAsDate.value = date
  },
})
const systemTimeAsDate = computed({
  get: () => new Date(settingsStore.current.general.systemTime),
  set: (value) => {
    settingsStore.current.general.systemTime = value.toISOString()
  },
})
const time = computed({
  get: () => {
    if (
      !settingsStore.current.general.systemTime ||
      !settingsStore.current.general.timeZone
    ) {
      return ''
    }
    return DateConverter.formatDateAsHoursColonMinutesInTimeZone(
      systemTimeAsDate.value,
      settingsStore.current.general.timeZone,
    )
  },
  set: debounce((value) => {
    const hours = parseInt(value.slice(0, 2))
    const minutes = parseInt(value.slice(3, 5))
    let date
    if (settingsStore.current.general.systemTime) {
      date = new Date(settingsStore.current.general.systemTime.valueOf())
    } else {
      date = new Date()
    }
    date.setHours(hours)
    date.setMinutes(minutes)
    systemTimeAsDate.value = date
  }, 200),
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

function onSubmitGeneralSettings() {
  settingsStore
    .uploadChangedGeneralSettings()
    .then(notifySettingsSaved)
    .catch((error) => {
      if (
        settingsStore.current.general.deviceName !==
        settingsStore.initial.general.deviceName
      ) {
        // There is a high chance that the request went through but that the access point has been renamed.
        quasar.dialog({
          title: 'Connection lost',
          message:
            'You need to connect to the new Wi-Fi network now. The access point name has been updated with the device name, so you lost the connection.',
          persistent: true,
        })
      } else {
        notifySettingsNotSavedError(error)
      }
    })
}

function notifySettingsSaved() {
  quasar.notify({
    message: 'The general settings were saved.',
    color: 'positive',
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function notifySettingsNotSavedError(error: any) {
  quasar.notify({
    message: 'The general settings could not be saved.',
    caption: error.response?.data.message
      ? error.response.data.message
      : error.message,
    color: 'negative',
  })
}

ApiClientService.getAvailableTimeZones()
  .then((data) => {
    availableTimeZones.value = data.timeZones
    filteredTimeZones.value = data.timeZones
  })
  .catch((error) => {
    quasar.notify({
      message: 'The available time zones could not be loaded.',
      caption: error.response?.data.message
        ? error.response.data.message
        : error.message,
      color: 'negative',
    })
  })
</script>

<template>
  <q-form
    autocapitalize="off"
    autocomplete="off"
    autocorrect="off"
    class="q-gutter-sm"
    @submit="onSubmitGeneralSettings"
  >
    <q-input
      v-model="settingsStore.current.general.siteName"
      :disable="isLoadingSettings"
      label="Site name (optional)"
      lazy-rules
      outlined
      :rules="noSpecialCharactersIfNotEmptyRules"
    />
    <q-input
      v-model="settingsStore.current.general.deviceName"
      class="q-mb-xl"
      :disable="isLoadingSettings"
      hint="Use a unique device name per site because it is also used as access point name."
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
      v-model="settingsStore.current.general.timeZone"
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
      :device-name="settingsStore.current.general.deviceName"
      :site-name="settingsStore.current.general.siteName"
      :system-time="settingsStore.current.general.systemTime"
      :time-zone="settingsStore.current.general.timeZone"
    />
    <q-input
      v-model="settingsStore.current.general.password"
      class="q-mt-lg q-mb-sm"
      :disable="isLoadingSettings"
      label="Wi-Fi password"
      lazy-rules
      outlined
      :rules="noInvalidWiFiPassword"
    />
    <q-btn
      color="primary"
      class="q-mt-md"
      :disable="isLoadingSettings"
      label="Save"
      type="submit"
    />
  </q-form>
</template>
