<script setup lang="ts">
// © 2022-2024 Luxembourg Institute of Science and Technology
import {
  QOptionGroupProps,
  QSelectOption,
  useQuasar,
  ValidationRule,
} from 'quasar'
import { computed, ref, VNodeRef, watch } from 'vue'
import ExportImport from '../components/ExportImport.vue'
import GeneralSettings from '../components/GeneralSettings.vue'
import { useSettingsStore, TRIGGER_THRESHOLD_MINIMUM } from '../stores/settings'
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
    settingsStore.current.triggering.light !== 'visible' ||
    val !== 'infrared' ||
    'It is not possible to use infrared recording light when visible trigger light is used.',
]
const noInvalidTriggeringLightType: ValidationRule[] = [
  (val) =>
    settingsStore.current.camera.light !== 'infrared' ||
    val !== 'visible' ||
    'It is not possible to use visible trigger light when infrared recording light is used.',
]
const notEmptyAndBetweenMinMaxThreshold: ValidationRule[] = [
  (val) => (val !== null && val !== '') || 'Please enter a value.',
  (val) =>
    (val >= TRIGGER_THRESHOLD_MINIMUM &&
      val <= settingsStore.current.triggering.thresholdMaximum) ||
    `Please provide a value between ${TRIGGER_THRESHOLD_MINIMUM} and ${settingsStore.current.triggering.thresholdMaximum}.`,
]
const notEmptyAndBetweenMinMaxFocus: ValidationRule[] = [
  (val) => (val !== null && val !== '') || 'Please enter a value.',
  (val) =>
    (val >= settingsStore.current.camera.focusMinimum &&
      val <= settingsStore.current.camera.focusMaximum) ||
    `Please provide a value between ${settingsStore.current.camera.focusMinimum} and ${settingsStore.current.camera.focusMaximum}.`,
]

const cameraLightFieldRef = ref<VNodeRef>()
const isLoadingSettings = ref(true)
const sleepingTime = ref('')
const triggerLightFieldRef = ref<VNodeRef>()
const wakingUpTime = ref('')
const workingTimeEnabled = ref(false)

const focusHint = computed(
  () =>
    `This value can range from ${settingsStore.current.camera.focusMinimum} to ${settingsStore.current.camera.focusMaximum}.`,
)
const thresholdHint = computed(
  () =>
    `This is the number of pixels that need to change for the device to trigger. It can range from ${TRIGGER_THRESHOLD_MINIMUM} to ${settingsStore.current.triggering.thresholdMaximum}.`,
)

propertiesStore.fetchDeviceId().catch((error) => {
  quasar.notify({
    message: 'The device ID could not be loaded.',
    caption: error.response.data.message
      ? error.response.data.message
      : error.message,
    color: 'negative',
  })
})

settingsStore
  .fetchSettings()
  .then(loadWorkingTimes)
  .catch((error) => {
    quasar.notify({
      message: 'The settings could not be loaded.',
      caption: error.response.data.message
        ? error.response.data.message
        : error.message,
      color: 'negative',
    })
  })
  .finally(() => {
    isLoadingSettings.value = false
  })

function enableSwitchOnWorkingTimesSet() {
  if (sleepingTime.value && wakingUpTime.value) {
    workingTimeEnabled.value = true
  }
}

function loadWorkingTimes() {
  if (settingsStore.current.triggering.sleepingTime) {
    let time = settingsStore.current.triggering.sleepingTime.hour
      .toString()
      .padStart(2, '0')
    time += ':'
    time += settingsStore.current.triggering.sleepingTime.minute
      .toString()
      .padStart(2, '0')
    sleepingTime.value = time
  }
  if (settingsStore.current.triggering.wakingUpTime) {
    let time = settingsStore.current.triggering.wakingUpTime.hour
      .toString()
      .padStart(2, '0')
    time += ':'
    time += settingsStore.current.triggering.wakingUpTime.minute
      .toString()
      .padStart(2, '0')
    wakingUpTime.value = time
  }
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
    caption: error.response.data.message
      ? error.response.data.message
      : error.message,
    color: 'negative',
  })
}

function onSubmitCameraSettings() {
  settingsStore
    .uploadChangedCameraSettings()
    .then(notifySettingsSaved)
    .catch(notifySettingsNotSavedError)
}

function onSubmitTriggerSettings() {
  settingsStore
    .uploadChangedTriggerSettings()
    .then(notifySettingsSaved)
    .catch(notifySettingsNotSavedError)
}

watch(sleepingTime, (value) => {
  if (!value) {
    settingsStore.current.triggering.sleepingTime = null
  } else {
    const hour = parseInt(value.substring(0, 2))
    const minute = parseInt(value.substring(3, 5))
    settingsStore.current.triggering.sleepingTime = { hour, minute }
  }
})

watch(sleepingTime, enableSwitchOnWorkingTimesSet)

watch(wakingUpTime, (value) => {
  if (!value) {
    settingsStore.current.triggering.wakingUpTime = null
  } else {
    const hour = parseInt(value.substring(0, 2))
    const minute = parseInt(value.substring(3, 5))
    settingsStore.current.triggering.wakingUpTime = { hour, minute }
  }
})

watch(wakingUpTime, enableSwitchOnWorkingTimesSet)

watch(workingTimeEnabled, (value) => {
  // Empty working times when this functionality is disabled.
  if (!value) {
    sleepingTime.value = ''
    wakingUpTime.value = ''
  }
})

watch(
  // Reset validation of trigger light if camera light is changed.
  () => settingsStore.current.camera.light,
  () => {
    if (triggerLightFieldRef.value) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(triggerLightFieldRef.value as any).resetValidation()
    }
  },
)

watch(
  // Reset validation of camera light if trigger light is changed.
  () => settingsStore.current.triggering.light,
  () => {
    if (cameraLightFieldRef.value) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(cameraLightFieldRef.value as any).resetValidation()
    }
  },
)
</script>

<template>
  <q-list bordered>
    <q-expansion-item
      group="settings"
      icon="settings"
      label="General settings"
    >
      <q-card>
        <q-card-section>
          <GeneralSettings :is-loading-settings="isLoadingSettings" />
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
                v-model="settingsStore.current.camera.shotTypes"
                :disable="isLoadingSettings"
                :options="SHOT_TYPE_OPTIONS"
                color="green"
                type="checkbox"
              />
            </div>
            <q-select
              v-model="settingsStore.current.camera.pictureQuality"
              :disable="isLoadingSettings"
              emit-value
              label="Picture quality"
              map-options
              :options="SHOT_QUALITIES"
              outlined
            />
            <q-select
              v-model="settingsStore.current.camera.videoQuality"
              :disable="isLoadingSettings"
              emit-value
              label="Video quality"
              map-options
              :options="SHOT_QUALITIES"
              outlined
            />
            <q-input
              v-model.number="settingsStore.current.camera.focus"
              :disable="isLoadingSettings"
              :hint="focusHint"
              label="Focus"
              lazy-rules
              outlined
              :rules="notEmptyAndBetweenMinMaxFocus"
              type="number"
            />
            <q-field
              v-if="settingsStore.current.camera.isLightEnabled"
              ref="cameraLightFieldRef"
              v-model="settingsStore.current.camera.light"
              label="Recording light"
              :rules="noInvalidCameraLightType"
              stack-label
            >
              <template #control>
                <q-option-group
                  v-model="settingsStore.current.camera.light"
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
                  v-model="wakingUpTime"
                  :disable="isLoadingSettings || !workingTimeEnabled"
                  filled
                  mask="time"
                  :rules="['time']"
                  style="width: 115px"
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
                          v-model="wakingUpTime"
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
                  v-model="sleepingTime"
                  :disable="isLoadingSettings || !workingTimeEnabled"
                  filled
                  mask="time"
                  :rules="['time']"
                  style="width: 115px"
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
                          v-model="sleepingTime"
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
              v-if="settingsStore.current.triggering.isLightEnabled"
              ref="triggerLightFieldRef"
              v-model="settingsStore.current.triggering.light"
              class="q-mb-md"
              label="Trigger light"
              :rules="noInvalidTriggeringLightType"
              stack-label
            >
              <template #control>
                <q-option-group
                  v-model="settingsStore.current.triggering.light"
                  :disable="isLoadingSettings"
                  :options="LIGHT_TYPE_OPTIONS"
                />
              </template>
            </q-field>
            <q-input
              v-model.number="settingsStore.current.triggering.threshold"
              class="q-mb-md"
              :disable="isLoadingSettings"
              :hint="thresholdHint"
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
</template>
