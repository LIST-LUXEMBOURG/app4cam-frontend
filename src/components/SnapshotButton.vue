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
import ApiClientService from '../helpers/ApiClientService'
import { FileDownloadResponse } from '../helpers/ApiTypings'
import SnapshotDialog from './SnapshotDialog.vue'

const quasar = useQuasar()

defineProps<{ outline: boolean }>()

function onTakeSnapshotButtonClick() {
  ApiClientService.getSnapshot()
    .then((response: FileDownloadResponse) => {
      const file = new Blob([response.data], { type: response.contentType })
      const snapshotUrl = URL.createObjectURL(file)
      quasar.dialog({
        component: SnapshotDialog,
        componentProps: {
          snapshotUrl,
        },
      })
    })
    .catch((error) => {
      quasar.notify({
        message: 'Taking or displaying the snapshot failed.',
        caption: error.response.data.message
          ? error.response.data.message
          : error.message,
        color: 'negative',
      })
    })
}
</script>

<template>
  <q-btn
    color="primary"
    label="Take snapshot"
    :outline="outline"
    @click="onTakeSnapshotButtonClick"
  />
</template>

<style scoped>
.snapshot {
  max-width: 100%;
}
</style>
