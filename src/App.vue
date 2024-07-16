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
