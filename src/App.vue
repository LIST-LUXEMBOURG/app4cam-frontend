<script setup lang="ts">
// © 2021-2023 Luxembourg Institute of Science and Technology
import { useQuasar } from 'quasar'
import DateConverter from './helpers/DateConverter'
import { useSettingsStore } from './stores/settings'
import TimeOutOfSyncDialog from 'components/TimeOutOfSyncDialog.vue'

const quasar = useQuasar()
const settingsStore = useSettingsStore()

try {
  settingsStore.fetchSettings()
  if (
    !settingsStore.current.general.systemTime ||
    DateConverter.getAbsoluteDifferenceInMinutes(
      new Date(settingsStore.current.general.systemTime),
      new Date(),
    ) > 1
  ) {
    quasar.dialog({
      component: TimeOutOfSyncDialog,
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
  quasar.notify({
    message: 'The system time could not be loaded.',
    caption: error.response.data.message
      ? error.response.data.message
      : error.message,
    color: 'negative',
  })
}
</script>

<template>
  <router-view />
</template>
