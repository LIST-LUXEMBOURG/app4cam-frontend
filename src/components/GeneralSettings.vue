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
import { ValidationRule, debounce, useQuasar } from 'quasar'
import { computed, ref } from 'vue'
import FilenamePreview from '../components/FilenamePreview.vue'
import ApiClientService from '../helpers/ApiClientService'
import DateConverter from '../helpers/DateConverter'
import { usePropertiesStore } from '../stores/properties'
import { useSettingsStore } from '../stores/settings'
import NotificationCreator from 'src/helpers/NotificationCreator'

const propertiesStore = usePropertiesStore()
const quasar = useQuasar()
const settingsStore = useSettingsStore()

const LATITUDE_MINIMUM = -90
const LATITUDE_MAXIMUM = 90
const LONGITUDE_MINIMUM = -180
const LONGITUDE_MAXIMUM = 180

defineProps<{
  isLoadingSettings: boolean
}>()

const noInvalidLatitudeRules: ValidationRule[] = [
  (val) => !val || /^-?\d+(\.\d{1,7})?$/.test(val) || 'Please use a number.',
  (val) =>
    !val ||
    (LATITUDE_MINIMUM <= val && val <= LATITUDE_MAXIMUM) ||
    'Please enter a valid latitude.',
]
const noInvalidLongitudeRules: ValidationRule[] = [
  (val) => !val || /^-?\d+(\.\d{1,7})?$/.test(val) || 'Please use a number.',
  (val) =>
    !val ||
    (LONGITUDE_MINIMUM <= val && val <= LONGITUDE_MAXIMUM) ||
    'Please enter a valid longitude.',
]
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
const localiseMeButtonLoading = ref(false)

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

function clearLocation() {
  settingsStore.current.general.latitude = null
  settingsStore.current.general.locationAccuracy = null
  settingsStore.current.general.longitude = null
}

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

function localiseMeAndFillCoordinates() {
  localiseMeButtonLoading.value = true

  function success(position: GeolocationPosition) {
    localiseMeButtonLoading.value = false

    settingsStore.current.general.latitude = position.coords.latitude
    settingsStore.current.general.locationAccuracy = position.coords.accuracy
    settingsStore.current.general.longitude = position.coords.longitude
  }

  function error(error: GeolocationPositionError) {
    localiseMeButtonLoading.value = false

    let caption: string | undefined = undefined
    switch (error.code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        caption = 'The permission was not given.'
        break
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        caption = 'The position is not unavailable on the device.'
        break
    }

    quasar.notify({
      message: 'Unable to retrieve your location.',
      caption,
      color: 'negative',
    })
  }

  if (!navigator.geolocation) {
    localiseMeButtonLoading.value = false
    quasar.notify({
      message: 'Geolocation is not supported by your browser.',
      color: 'negative',
    })
  } else {
    const options = {
      enableHighAccuracy: true,
    }
    navigator.geolocation.getCurrentPosition(success, error, options)
  }
}

function onSubmitGeneralSettings() {
  settingsStore
    .uploadChangedGeneralSettings()
    .then(notifySettingsSaved)
    .catch((error) => {
      if (
        settingsStore.current.general.deviceName !==
          settingsStore.initial.general.deviceName ||
        settingsStore.current.general.password !==
          settingsStore.initial.general.password
      ) {
        // There is a high chance that the request went through but that the access point was renamed or the password updated.
        quasar.dialog({
          title: 'Connection Lost',
          message:
            'The access point name was updated with the device name, or the access point password was changed. Please connect to the new Wi-Fi network now and reload this page.',
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

function notifySettingsNotSavedError(error: unknown) {
  NotificationCreator.showErrorNotification(
    quasar,
    error,
    'The general settings could not be saved.',
  )
}

function unsetLocationAccuracy() {
  settingsStore.current.general.locationAccuracy = null
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
      class="q-mb-lg"
      :disable="isLoadingSettings"
      hint="Use a unique device name per site because it is also used as access point name."
      label="Device name"
      lazy-rules
      outlined
      :rules="notEmptyAndNoSpecialCharactersRules"
    />
    <div>
      Location (optional)
      <div class="q-ml-lg q-mt-sm q-mb-md">
        <q-input
          v-model.number="settingsStore.current.general.latitude"
          class="q-pb-sm"
          :disable="isLoadingSettings"
          label="Latitude"
          lazy-rules
          :max="LATITUDE_MAXIMUM"
          :min="LATITUDE_MINIMUM"
          outlined
          :rules="noInvalidLatitudeRules"
          step="0.0000001"
          type="number"
          @update:model-value="unsetLocationAccuracy"
        />
        <q-input
          v-model.number="settingsStore.current.general.longitude"
          class="q-pb-sm"
          :disable="isLoadingSettings"
          label="Longitude"
          lazy-rules
          :max="LONGITUDE_MAXIMUM"
          :min="LONGITUDE_MINIMUM"
          outlined
          :rules="noInvalidLongitudeRules"
          step="0.0000001"
          type="number"
          @update:model-value="unsetLocationAccuracy"
        />
        <q-input
          v-model.number="settingsStore.current.general.locationAccuracy"
          class="q-pb-sm"
          label="Accuracy in meters"
          outlined
          readonly
        />
        <div class="row">
          <div class="col">
            <div class="row q-col-gutter-md">
              <div class="col-4">
                <q-btn
                  class="full-width"
                  flat
                  label="Clear"
                  @click="clearLocation"
                />
              </div>
              <div class="col-8">
                <q-btn
                  class="full-width"
                  icon="my_location"
                  label="Localise me"
                  :loading="localiseMeButtonLoading"
                  @click="localiseMeAndFillCoordinates"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
