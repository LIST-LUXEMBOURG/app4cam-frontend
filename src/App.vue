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
import { onMounted } from 'vue'
import ApiClientService from './helpers/ApiClientService'
import DateConverter from './helpers/DateConverter'
import NotificationCreator from './helpers/NotificationCreator'
import TimeOutOfSyncDialog from 'components/TimeOutOfSyncDialog.vue'

const quasar = useQuasar()

const MAX_TIME_DIFFERENCE_IN_MIN = 1

onMounted(async () => {
  try {
    const response = await ApiClientService.getSystemTime()
    if (
      !response.systemTime ||
      DateConverter.getAbsoluteDifferenceInMinutes(
        new Date(response.systemTime),
        new Date(),
      ) > MAX_TIME_DIFFERENCE_IN_MIN
    ) {
      quasar.dialog({
        component: TimeOutOfSyncDialog,
      })
    }
  } catch (error: unknown) {
    NotificationCreator.showErrorNotification(
      quasar,
      error,
      'The system time could not be loaded.',
    )
  }
})
</script>

<template>
  <router-view />
</template>
