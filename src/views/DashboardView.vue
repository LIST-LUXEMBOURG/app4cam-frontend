<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import ApiClientService from '../services/ApiClientService'
import { FileDownloadResponse } from '../services/ApiTypings'
import { useStore } from '../store'
import { Actions } from '../store/action-types'

const quasar = useQuasar()
const store = useStore()

const deviceId = ref('')
const siteName = ref('')
const isSnapshotDialogOpen = ref(false)
const snapshotUrl = ref('')

store
  .dispatch(Actions.FETCH_SETTINGS)
  .then(() => {
    deviceId.value = store.state.deviceId
    siteName.value = store.state.siteName
  })
  .catch((error) => {
    quasar.notify({
      message: 'The site name and device ID could not be loaded.',
      caption: error.message ? error.message : '',
      color: 'negative',
    })
  })

function onTakeSnapshotButtonClick() {
  ApiClientService.getSnapshot()
    .then((response: FileDownloadResponse) => {
      const file = new Blob([response.data], { type: response.contentType })
      snapshotUrl.value = URL.createObjectURL(file)
      isSnapshotDialogOpen.value = true
    })
    .catch((error) => {
      quasar.notify({
        message: 'Taking or displaying the snapshot failed.',
        caption: error.message ? error.message : '',
        color: 'negative',
      })
    })
}
</script>

<template>
  <h5 class="q-my-md" data-test-id="deviceInformation">
    {{ siteName }} {{ deviceId }}
  </h5>
  <q-btn
    color="primary"
    label="Take snapshot"
    @click="onTakeSnapshotButtonClick"
  />
  <q-dialog v-model="isSnapshotDialogOpen" full-width>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Snapshot</div>
        <q-space />
        <q-btn v-close-popup icon="close" flat round dense />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <img class="snapshot" :src="snapshotUrl" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.snapshot {
  max-width: 100%;
}
</style>
