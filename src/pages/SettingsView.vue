<script setup lang="ts">
import { debounce, QOptionGroupProps, useQuasar, ValidationRule } from 'quasar'
import { computed, ref } from 'vue'
import ExportImport from '../components/ExportImport.vue'
import FilenamePreview from '../components/FilenamePreview.vue'
import ApiClientService from '../helpers/ApiClientService'
import DateConverter from '../helpers/DateConverter'
import { useSettingsStore } from '../stores/settings'
import { ShotType } from 'src/settings'
import { usePropertiesStore } from 'src/stores/properties'

const propertiesStore = usePropertiesStore()
const quasar = useQuasar()
const settingsStore = useSettingsStore()

const SHOT_TYPE_OPTIONS: QOptionGroupProps['options'] = [
  {
    label: 'Pictures',
    value: 'pictures',
  },
  {
    label: 'Videos',
    value: 'videos',
  },
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
const deviceName = ref('')
const filteredTimeZones = ref<string[]>([])
const isLoadingSettings = ref(true)
const shotTypes = ref<ShotType[]>([])
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
      message: 'The available time zones could not be loaded.',
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
  shotTypes.value = settingsStore.shotTypes
  siteName.value = settingsStore.siteName
  systemTime.value = settingsStore.systemTime
  timeZone.value = settingsStore.timeZone
}

function onSubmit() {
  settingsStore
    .patchSettings({
      deviceName: deviceName.value,
      shotTypes: shotTypes.value,
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
    <q-form
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      class="q-gutter-sm q-mb-xl"
      @submit="onSubmit"
    >
      <q-list bordered>
        <q-expansion-item
          default-opened
          group="settings"
          icon="settings"
          label="General settings"
        >
          <q-card>
            <q-card-section>
              <q-input
                v-model="siteName"
                :disable="isLoadingSettings"
                label="Site name (optional)"
                lazy-rules
                outlined
                :rules="noSpecialCharactersIfNotEmptyRules"
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
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-separator />

        <q-expansion-item
          group="settings"
          icon="camera"
          label="Camera settings"
        >
          <q-card>
            <q-card-section>
              Types of shots:
              <q-option-group
                v-model="shotTypes"
                :options="SHOT_TYPE_OPTIONS"
                color="green"
                type="checkbox"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <q-btn
        color="primary"
        class="q-ml-lg q-mt-md"
        label="Save"
        type="submit"
      />
    </q-form>

    <ExportImport @imported="loadSettingsFromStore" />
  </div>
</template>
