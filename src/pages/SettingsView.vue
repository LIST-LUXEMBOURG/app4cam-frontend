<script setup lang="ts">
// © 2022-2024 Luxembourg Institute of Science and Technology
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import CameraSettings from '../components/CameraSettings.vue'
import ExportImport from '../components/ExportImport.vue'
import GeneralSettings from '../components/GeneralSettings.vue'
import TriggerSettings from '../components/TriggerSettings.vue'
import { useSettingsStore } from '../stores/settings'
import LogFileDownloads from 'src/components/LogFileDownloads.vue'
import { usePropertiesStore } from 'src/stores/properties'

const propertiesStore = usePropertiesStore()
const quasar = useQuasar()
const settingsStore = useSettingsStore()

const isLoadingSettings = ref(true)

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
          <CameraSettings :is-loading-settings="isLoadingSettings" />
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
          <TriggerSettings :is-loading-settings="isLoadingSettings" />
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>

  <ExportImport />

  <LogFileDownloads />
</template>
