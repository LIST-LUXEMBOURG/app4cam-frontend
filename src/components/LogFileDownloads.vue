<script setup lang="ts">
// © 2023 Luxembourg Institute of Science and Technology
import { useQuasar } from 'quasar'
import { FileDownloader } from '../helpers/FileDownloader'
import ApiClientService from 'src/helpers/ApiClientService'
import { FileDownloadResponse } from 'src/helpers/ApiTypings'

const quasar = useQuasar()

function onDownloadAppLogButtonClick() {
  ApiClientService.getAppLogFile()
    .then(handleFileDownloadResponse)
    .catch(handleFileDownloadError)
}

function onDownloadMotionLogButtonClick() {
  ApiClientService.getMotionLogFile()
    .then(handleFileDownloadResponse)
    .catch(handleFileDownloadError)
}

function handleFileDownloadResponse(response: FileDownloadResponse): void {
  FileDownloader.downloadFile(
    [response.data],
    response.contentType,
    response.filename,
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleFileDownloadError(error: any): void {
  quasar.notify({
    message: 'The log file could not be downloaded.',
    caption: error.message ? error.message : '',
    color: 'negative',
  })
}
</script>

<template>
  <h6 class="q-mt-sm q-mb-md">Log files</h6>
  <div class="q-px-md">
    <q-btn-dropdown
      color="primary"
      label="Download log file"
    >
      <q-list>
        <q-item
          v-close-popup
          clickable
          @click="onDownloadAppLogButtonClick"
        >
          <q-item-section side>
            <q-icon
              color="gray"
              name="download"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>App log file</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-close-popup
          clickable
          @click="onDownloadMotionLogButtonClick"
        >
          <q-item-section side>
            <q-icon
              color="gray"
              name="download"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>Motion log file</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>
