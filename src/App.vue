<script setup lang="ts">
import { useQuasar } from 'quasar'
import DateConverter from './helpers/DateConverter'
import { useSettingsStore } from './stores/settings'
import TimeOutOfSyncDialog from 'components/TimeOutOfSyncDialog.vue'

const quasar = useQuasar()
const settingsStore = useSettingsStore()

try {
  settingsStore.fetchSettings()
  if (
    !settingsStore.general.systemTime ||
    DateConverter.getAbsoluteDifferenceInMinutes(
      new Date(settingsStore.general.systemTime),
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
    caption: error.message ? error.message : '',
    color: 'negative',
  })
}
</script>

<template>
  <router-view />
</template>
