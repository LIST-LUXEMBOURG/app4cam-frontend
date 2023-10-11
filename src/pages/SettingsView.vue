<script setup lang="ts">
import {
  debounce,
  QOptionGroupProps,
  QSelectOption,
  useQuasar,
  ValidationRule,
} from 'quasar'
import { computed, ref, watch } from 'vue'
import ExportImport from '../components/ExportImport.vue'
import FilenamePreview from '../components/FilenamePreview.vue'
import ApiClientService from '../helpers/ApiClientService'
import DateConverter from '../helpers/DateConverter'
import {
  useSettingsStore,
  TRIGGER_THRESHOLD_MINIMUM,
  TRIGGER_THRESHOLD_MAXIMUM,
} from '../stores/settings'
import LogFileDownloads from 'src/components/LogFileDownloads.vue'
import { usePropertiesStore } from 'src/stores/properties'

const propertiesStore = usePropertiesStore()
const quasar = useQuasar()
const settingsStore = useSettingsStore()

const LIGHT_TYPE_OPTIONS: QOptionGroupProps['options'] = [
  {
    label: 'Infrared',
    value: 'infrared',
  },
  {
    label: 'Visible',
    value: 'visible',
  },
]

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

const SHOT_QUALITIES: QSelectOption<number>[] = [
  {
    label: 'low',
    value: 40,
  },
  {
    label: 'medium',
    value: 60,
  },
  {
    label: 'high',
    value: 80,
  },
  {
    label: 'ultra-high',
    value: 90,
  },
  {
    label: 'highest',
    value: 100,
  },
]

const noInvalidCameraLightType: ValidationRule[] = [
  (val) =>
    settingsStore.triggering.light !== 'visible' ||
    val !== 'infrared' ||
    'It is not possible to use infrared recording light when visible trigger light is used.',
]
const noInvalidTriggeringLightType: ValidationRule[] = [
  (val) =>
    settingsStore.camera.light !== 'infrared' ||
    val !== 'visible' ||
    'It is not possible to use visible trigger light when infrared recording light is used.',
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
const notEmptyAndBetweenMinMaxThreshold: ValidationRule[] = [
  (val) => (val !== null && val !== '') || 'Please enter something.',
  (val) =>
    (val >= TRIGGER_THRESHOLD_MINIMUM && val <= TRIGGER_THRESHOLD_MAXIMUM) ||
    `Please provide a value between ${TRIGGER_THRESHOLD_MINIMUM} and ${TRIGGER_THRESHOLD_MAXIMUM}.`,
]
const noTimeZoneSelected: ValidationRule[] = [
  (val) => (val !== null && val !== '') || 'Please select a time zone.',
]

const availableTimeZones = ref<string[]>([])
const filteredTimeZones = ref<string[]>([])
const isLoadingSettings = ref(true)
const workingTimeEnabled = ref(false)

const date = computed({
  get: () => {
    if (!settingsStore.general.systemTime || !settingsStore.general.timeZone) {
      return ''
    }
    return DateConverter.formatDateAsDashedYearMonthDayInTimeZone(
      systemTimeAsDate.value,
      settingsStore.general.timeZone,
    )
  },
  set: (value) => {
    const year = parseInt(value.slice(0, 4))
    const month = parseInt(value.slice(5, 7))
    const day = parseInt(value.slice(8, 10))
    let date
    if (settingsStore.general.systemTime) {
      date = new Date(settingsStore.general.systemTime.valueOf())
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
  get: () => new Date(settingsStore.general.systemTime),
  set: (value) => {
    settingsStore.general.systemTime = value.toISOString()
  },
})
const time = computed({
  get: () => {
    if (!settingsStore.general.systemTime || !settingsStore.general.timeZone) {
      return ''
    }
    return DateConverter.formatDateAsHoursColonMinutesInTimeZone(
      systemTimeAsDate.value,
      settingsStore.general.timeZone,
    )
  },
  set: debounce((value) => {
    const hours = parseInt(value.slice(0, 2))
    const minutes = parseInt(value.slice(3, 5))
    let date
    if (settingsStore.general.systemTime) {
      date = new Date(settingsStore.general.systemTime.valueOf())
    } else {
      date = new Date()
    }
    date.setHours(hours)
    date.setMinutes(minutes)
    systemTimeAsDate.value = date
  }, 200),
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
  .catch((error) => {
    quasar.notify({
      message: 'The settings could not be loaded.',
      caption: error.message ? error.message : '',
      color: 'negative',
    })
  })
  .finally(() => {
    isLoadingSettings.value = false
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

function notifySettingsSaved() {
  quasar.notify({
    message: 'The settings were saved.',
    color: 'positive',
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function notifySettingsNotSavedError(error: any) {
  quasar.notify({
    message: 'The settings could not be saved.',
    caption: error.message ? error.message : '',
    color: 'negative',
  })
}

function onSubmitCameraSettings() {
  settingsStore
    .uploadAllCameraSettings()
    .then(notifySettingsSaved)
    .catch(notifySettingsNotSavedError)
}

function onSubmitGeneralSettings() {
  settingsStore
    .uploadAllGeneralSettings()
    .then(notifySettingsSaved)
    .catch(notifySettingsNotSavedError)
}

function onSubmitTriggerSettings() {
  settingsStore
    .uploadAllTriggerSettings()
    .then(notifySettingsSaved)
    .catch(notifySettingsNotSavedError)
}

watch(workingTimeEnabled, (value) => {
  // Empty sleeping times when this functionality is disabled.
  if (!value) {
    settingsStore.triggering.sleepingTime = ''
    settingsStore.triggering.wakingUpTime = ''
  }
})
</script>

<template>
  <div
    class="q-pa-md q-mx-auto text-left"
    style="max-width: 400px"
  >
    <q-list bordered>
      <q-expansion-item
        group="settings"
        icon="settings"
        label="General settings"
      >
        <q-card>
          <q-card-section>
            <q-form
              autocapitalize="off"
              autocomplete="off"
              autocorrect="off"
              class="q-gutter-sm"
              @submit="onSubmitGeneralSettings"
            >
              <q-input
                v-model="settingsStore.general.siteName"
                :disable="isLoadingSettings"
                label="Site name (optional)"
                lazy-rules
                outlined
                :rules="noSpecialCharactersIfNotEmptyRules"
              />
              <q-input
                v-model="settingsStore.general.deviceName"
                class="q-mb-xl"
                :disable="isLoadingSettings"
                hint="Make sure to use a unique device name per site as it is also used as access point name. When it is changed, you need to connect to the new Wi-Fi network."
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
                v-model="settingsStore.general.timeZone"
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
                :device-name="settingsStore.general.deviceName"
                :site-name="settingsStore.general.siteName"
                :system-time="settingsStore.general.systemTime"
                :time-zone="settingsStore.general.timeZone"
              />
              <q-btn
                color="primary"
                class="q-mt-md"
                :disable="isLoadingSettings"
                label="Save"
                type="submit"
              />
            </q-form>
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
            <q-form
              autocapitalize="off"
              autocomplete="off"
              autocorrect="off"
              class="q-gutter-sm"
              @submit="onSubmitCameraSettings"
            >
              <div>
                Types of shots
                <q-option-group
                  v-model="settingsStore.camera.shotTypes"
                  :disable="isLoadingSettings"
                  :options="SHOT_TYPE_OPTIONS"
                  color="green"
                  type="checkbox"
                />
              </div>
              <q-select
                v-model="settingsStore.camera.pictureQuality"
                :disable="isLoadingSettings"
                emit-value
                label="Picture quality"
                map-options
                :options="SHOT_QUALITIES"
                outlined
              />
              <q-select
                v-model="settingsStore.camera.videoQuality"
                :disable="isLoadingSettings"
                emit-value
                label="Video quality"
                map-options
                :options="SHOT_QUALITIES"
                outlined
              />
              <q-field
                v-model="settingsStore.camera.light"
                label="Recording light"
                :rules="noInvalidCameraLightType"
                stack-label
              >
                <template #control>
                  <q-option-group
                    v-model="settingsStore.camera.light"
                    :disable="isLoadingSettings"
                    :options="LIGHT_TYPE_OPTIONS"
                  />
                </template>
              </q-field>
              <q-btn
                color="primary"
                class="q-mt-md"
                :disable="isLoadingSettings"
                label="Save"
                type="submit"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-separator />

      <q-expansion-item
        group="settings"
        icon="bolt"
        label="Trigger settings"
      >
        <q-card>
          <q-card-section>
            <q-form
              autocapitalize="off"
              autocomplete="off"
              autocorrect="off"
              class="q-gutter-sm"
              @submit="onSubmitTriggerSettings"
            >
              <div>
                Working time
                <div class="row">
                  <q-toggle
                    v-model="workingTimeEnabled"
                    :disable="isLoadingSettings"
                    label="Turn on only during the following interval"
                  />
                </div>
                <div class="q-gutter-sm row items-center q-ml-xl">
                  <q-input
                    v-model="settingsStore.triggering.wakingUpTime"
                    :disable="isLoadingSettings || !workingTimeEnabled"
                    filled
                    mask="time"
                    :rules="['time']"
                    style="width: 120px"
                  >
                    <template #append>
                      <q-icon
                        class="cursor-pointer"
                        name="access_time"
                      >
                        <q-popup-proxy
                          cover
                          transition-hide="scale"
                          transition-show="scale"
                        >
                          <q-time
                            v-model="settingsStore.triggering.wakingUpTime"
                            format24h
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                color="primary"
                                flat
                                label="Close"
                              />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <div class="q-pb-md">&ndash;</div>
                  <q-input
                    v-model="settingsStore.triggering.sleepingTime"
                    :disable="isLoadingSettings || !workingTimeEnabled"
                    filled
                    mask="time"
                    :rules="['time']"
                    style="width: 120px"
                  >
                    <template #append>
                      <q-icon
                        class="cursor-pointer"
                        name="access_time"
                      >
                        <q-popup-proxy
                          cover
                          transition-hide="scale"
                          transition-show="scale"
                        >
                          <q-time
                            v-model="settingsStore.triggering.sleepingTime"
                            format24h
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                color="primary"
                                flat
                                label="Close"
                              />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
              <q-field
                v-model="settingsStore.triggering.light"
                class="q-mb-md"
                label="Trigger light"
                :rules="noInvalidTriggeringLightType"
                stack-label
              >
                <template #control>
                  <q-option-group
                    v-model="settingsStore.triggering.light"
                    :disable="isLoadingSettings"
                    :options="LIGHT_TYPE_OPTIONS"
                  />
                </template>
              </q-field>
              <q-input
                v-model.number="settingsStore.triggering.threshold"
                class="q-mb-md"
                :disable="isLoadingSettings"
                hint="This is the number of pixels that need to change for the device to trigger."
                label="Threshold"
                lazy-rules
                outlined
                :rules="notEmptyAndBetweenMinMaxThreshold"
                type="number"
              />
              <q-btn
                color="primary"
                class="q-mt-md"
                :disable="isLoadingSettings"
                label="Save"
                type="submit"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>

    <ExportImport />

    <LogFileDownloads />
  </div>
</template>
