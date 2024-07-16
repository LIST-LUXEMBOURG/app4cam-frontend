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
import {
  QOptionGroupProps,
  QSelectOption,
  ValidationRule,
  useQuasar,
} from 'quasar'
import { VNodeRef, computed, ref, watch } from 'vue'
import { useSettingsStore } from '../stores/settings'

const quasar = useQuasar()
const settingsStore = useSettingsStore()

defineProps<{
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
const notEmptyAndBetweenMinMaxFocus: ValidationRule[] = [
  (val) => (val !== null && val !== '') || 'Please enter a value.',
  (val) =>
    (val >= settingsStore.current.camera.focusMinimum &&
      val <= settingsStore.current.camera.focusMaximum) ||
    `Please provide a value between ${settingsStore.current.camera.focusMinimum} and ${settingsStore.current.camera.focusMaximum}.`,
]

const cameraLightFieldRef = ref<VNodeRef>()

const focusHint = computed(
  () =>
    `This value can range from ${settingsStore.current.camera.focusMinimum} to ${settingsStore.current.camera.focusMaximum}.`,
)

function notifySettingsSaved() {
  quasar.notify({
    message: 'The camera settings were saved.',
    color: 'positive',
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function notifySettingsNotSavedError(error: any) {
  quasar.notify({
    message: 'The camera settings could not be saved.',
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
</template>
