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
import { QOptionGroupProps, ValidationRule, useQuasar } from 'quasar'
import { VNodeRef, computed, onMounted, ref, watch } from 'vue'
import { TRIGGER_THRESHOLD_MINIMUM, useSettingsStore } from '../stores/settings'
import ApiClientService from 'src/helpers/ApiClientService'
import NotificationCreator from 'src/helpers/NotificationCreator'

const quasar = useQuasar()
const settingsStore = useSettingsStore()

const props = defineProps<{
  isLoadingSettings: boolean
}>()

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

const sleepingTime = ref('')
const sunrise = ref('')
const sunset = ref('')
const triggerLightFieldRef = ref<VNodeRef>()
const wakingUpTime = ref('')
const workingTimeEnabled = ref(false)

const thresholdHint = computed(
  () =>
    `This is the number of pixels that need to change for the device to trigger. It can range from ${TRIGGER_THRESHOLD_MINIMUM} to ${settingsStore.current.triggering.thresholdMaximum}.`,
)

function enableSwitchOnWorkingTimesSet() {
  if (sleepingTime.value && wakingUpTime.value) {
    workingTimeEnabled.value = true
  }
}

async function getNextSunsetAndSunriseTimes() {
  try {
    const response = await ApiClientService.getNextSunsetAndSunriseTimes()
    sunrise.value =
      response.sunrise.hour.toString().padStart(2, '0') +
      ':' +
      response.sunrise.minute.toString().padStart(2, '0')
    sunset.value =
      response.sunset.hour.toString().padStart(2, '0') +
      ':' +
      response.sunset.minute.toString().padStart(2, '0')
  } catch (error: unknown) {
    NotificationCreator.showErrorNotification(
      quasar,
      error,
      'The next sunset and sunrise times could not be loaded.',
    )
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
    message: 'The trigger settings were saved.',
    color: 'positive',
  })
}

function notifySettingsNotSavedError(error: unknown) {
  NotificationCreator.showErrorNotification(
    quasar,
    error,
    'The trigger settings could not be saved.',
  )
}

function onSubmitTriggerSettings() {
  settingsStore
    .uploadChangedTriggerSettings()
    .then(notifySettingsSaved)
    .catch(notifySettingsNotSavedError)
}

watch(
  () => props.isLoadingSettings,
  (newValue) => {
    if (!newValue) {
      loadWorkingTimes()
    }
  },
)

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

  // Disable sunrise and sunset times when this functionality is enabled.
  if (value) {
    settingsStore.current.triggering.useSunriseAndSunsetTimes = false
  }
})

watch(
  () => settingsStore.current.triggering.useSunriseAndSunsetTimes,
  async (value) => {
    if (value) {
      // Abort and warn when no location is set.
      if (
        !settingsStore.current.general.latitude ||
        !settingsStore.current.general.longitude
      ) {
        quasar.notify({
          message: 'The location must be set first!',
          color: 'warning',
        })
        settingsStore.current.triggering.useSunriseAndSunsetTimes = false
        return
      }

      // Disable working times when this functionality is enabled.
      workingTimeEnabled.value = false

      // Display next sunset and sunrise times.
      await getNextSunsetAndSunriseTimes()
    }
  },
)

onMounted(async () => {
  if (settingsStore.current.triggering.useSunriseAndSunsetTimes) {
    await getNextSunsetAndSunriseTimes()
  }
})
</script>

<template>
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
          label="Turn on during the following interval"
        />
      </div>
      <div class="q-gutter-sm row items-center q-ml-xl">
        <q-input
          v-model="wakingUpTime"
          data-test-id="wakingUpTime-field"
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
          data-test-id="sleepingTime-field"
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
      <div class="row">
        <q-toggle
          v-model="settingsStore.current.triggering.useSunriseAndSunsetTimes"
          :disable="isLoadingSettings"
          label="Turn on between sunrise and sunset"
        />
      </div>
      <div
        v-if="sunset && sunrise"
        class="row q-ml-xl q-pl-sm"
      >
        Next sunset at {{ sunset }} sunrise at {{ sunrise }}
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
      class="q-mb-lg"
      :disable="isLoadingSettings"
      :hint="thresholdHint"
      label="Threshold"
      lazy-rules
      outlined
      :rules="notEmptyAndBetweenMinMaxThreshold"
      type="number"
    />
    <q-input
      v-if="settingsStore.current.triggering.isTemperatureThresholdEnabled"
      v-model.number="settingsStore.current.triggering.temperatureThreshold"
      class="q-mb-md"
      clearable
      :disable="isLoadingSettings"
      hint="Shots will only be taken when the temperature is equal to or above this temperature in degree Celsius. Leave empty if you do not want to use this threshold."
      label="Temperature threshold"
      lazy-rules
      outlined
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
</template>
