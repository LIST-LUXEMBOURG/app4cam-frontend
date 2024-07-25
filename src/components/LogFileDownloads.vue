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
import { FileDownloader } from '../helpers/FileDownloader'
import ApiClientService from 'src/helpers/ApiClientService'
import { FileDownloadResponse } from 'src/helpers/ApiTypings'
import NotificationCreator from 'src/helpers/NotificationCreator'

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

function handleFileDownloadError(error: unknown): void {
  NotificationCreator.showErrorNotification(
    quasar,
    error,
    'The log file could not be downloaded.',
  )
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
