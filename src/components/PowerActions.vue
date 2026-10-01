<!--
Copyright (C) since 2026 Luxembourg Institute of Science and Technology

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
import ApiClientService from '@/helpers/ApiClientService'
import NotificationCreator from '@/helpers/NotificationCreator'
import { useQuasar } from 'quasar'

const quasar = useQuasar()

function onRestartButtonClick() {
  quasar
    .dialog({
      title: 'Confirm',
      message: 'Would you like to restart the device?',
      cancel: true,
      persistent: true,
    })
    .onOk(() => {
      ApiClientService.postReboot()
        .then(() => {
          quasar.notify({
            message: 'The device is being restarted.',
            color: 'positive',
          })
        })
        .catch((error) => {
          NotificationCreator.showErrorNotification(
            quasar,
            error,
            'The device could not be restarted.',
          )
        })
    })
}

function onShutDownButtonClick() {
  quasar
    .dialog({
      title: 'Confirm',
      message: 'Would you like to shut down the device?',
      cancel: true,
      persistent: true,
    })
    .onOk(() => {
      ApiClientService.postShutDown()
        .then(() => {
          quasar.notify({
            message: 'The device is being shut down.',
            color: 'positive',
          })
        })
        .catch((error) => {
          NotificationCreator.showErrorNotification(
            quasar,
            error,
            'The device could not be shut down.',
          )
        })
    })
}
</script>

<template>
  <div class="column q-gutter-sm">
    <div>
      <q-btn
        color="primary"
        label="Shut down device"
        @click="onShutDownButtonClick"
      />
    </div>
    <div>
      <q-btn
        color="primary"
        label="Restart device"
        @click="onRestartButtonClick"
      />
    </div>
  </div>
</template>
