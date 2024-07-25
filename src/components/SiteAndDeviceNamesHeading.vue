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
import { onMounted, ref } from 'vue'
import ApiClientService from 'src/helpers/ApiClientService'
import NotificationCreator from 'src/helpers/NotificationCreator'

const quasar = useQuasar()

const deviceName = ref('')
const siteName = ref('')

onMounted(async () => {
  try {
    const deviceNameResponse = await ApiClientService.getDeviceName()
    if (deviceNameResponse.deviceName) {
      deviceName.value = deviceNameResponse.deviceName
    }
  } catch (error: unknown) {
    NotificationCreator.showErrorNotification(
      quasar,
      error,
      'The device name could not be loaded.',
    )
  }

  try {
    const siteNameResponse = await ApiClientService.getSiteName()
    if (siteNameResponse.siteName) {
      siteName.value = siteNameResponse.siteName
    }
  } catch (error: unknown) {
    NotificationCreator.showErrorNotification(
      quasar,
      error,
      'The device name could not be loaded.',
    )
  }
})
</script>

<template>
  <h5 class="q-mt-none">{{ siteName }} {{ deviceName }}</h5>
</template>
