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
import { ref, watch } from 'vue'
import SnapshotButton from '../SnapshotButton.vue'
import { usePropertiesStore } from 'src/stores/properties'

const store = usePropertiesStore()

const message = ref('')

function adaptMessage() {
  if (store.isCameraConnected === null) {
    message.value =
      'Unknown camera connection status. Try to restart the device.'
  } else if (store.isCameraConnected) {
    message.value = 'The camera is connected.'
  } else {
    message.value = 'The camera is disconnected.'
  }
}

async function reloadStatus() {
  try {
    await store.fetchCameraStatus()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    let newMessage = 'The camera connection status could not be loaded.'
    if (error.message) {
      newMessage += ' ' + error.message
    }
    message.value = newMessage
  }
}

watch(() => store.isCameraConnected, adaptMessage)

adaptMessage()
reloadStatus()
</script>

<template>
  <q-card class="q-mb-lg overflow-auto">
    <q-card-section class="q-pa-sm">
      <div class="row justify-between items-center">
        <div
          class="text-h6"
          role="heading"
        >
          Camera
        </div>
        <SnapshotButton :outline="false" />
      </div>
      <div
        aria-label="status"
        class="row q-mt-sm rounded-borders q-pa-sm text-white justify-between items-center"
        :class="{
          'bg-positive': store.isCameraConnected,
          'bg-negative': !store.isCameraConnected,
        }"
        data-test-id="status"
      >
        <div>
          <q-icon
            v-if="store.isCameraConnected"
            name="check_circle"
            size="xs"
          />
          <q-icon
            v-else
            name="cancel"
            size="xs"
          />
        </div>
        <div class="col q-px-sm">
          {{ message }}
        </div>
        <div>
          <q-btn
            flat
            icon="refresh"
            round
            @click="reloadStatus"
          >
            <q-tooltip>Reload status</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.snapshot {
  max-width: 100%;
}
</style>
