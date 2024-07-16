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
import { computed, reactive, ref } from 'vue'
import ApiClientService from '../helpers/ApiClientService'
import { FileDownloadResponse } from '../helpers/ApiTypings'
import { FileDownloader } from '../helpers/FileDownloader'
import { useFilesStore } from '../stores/files'

const DISPLAY_DOWNLOAD_MULTIPLE_FILES_DIALOG_THRESHOLD = 10

const quasar = useQuasar()
const store = useFilesStore()

store.fetchFiles().catch((error) => {
  quasar.notify({
    message: 'The files could not be loaded.',
    caption: error.response.data.message
      ? error.response.data.message
      : error.message,
    color: 'negative',
  })
})

const typeFilterOptions = ['Pictures', 'Videos']

const isDeleteConfirmationDialogOpen = ref(false)
const isDownloadConfirmationDialogOpen = ref(false)
const typeFilterSelectedOption = ref(null)

const selectedFiles: string[] = reactive([])

const files = computed(() => {
  if (typeFilterSelectedOption.value === 'Pictures') {
    return store.pictures
  } else if (typeFilterSelectedOption.value === 'Videos') {
    return store.videos
  } else {
    return store.files
  }
})
const areAllFilesSelected = computed(
  () => selectedFiles.length === files.value.length,
)
const isNoFileSelected = computed(() => selectedFiles.length === 0)

function onSelectionClick(filename: string) {
  const filenameIndex = selectedFiles.indexOf(filename)
  if (filenameIndex !== -1) {
    selectedFiles.splice(filenameIndex, 1)
  } else {
    selectedFiles.push(filename)
  }
}

function onDeleteButtonClick() {
  if (selectedFiles.length === 0) {
    return
  }
  isDeleteConfirmationDialogOpen.value = true
}

function onConfirmDeleteButtonClick() {
  function handleFileDeleteSuccess(): void {
    selectedFiles.splice(0)
    quasar.notify({
      message: 'Successfully deleted',
      color: 'positive',
    })
  }

  isDeleteConfirmationDialogOpen.value = false

  if (selectedFiles.length === 0) {
    return
  } else if (selectedFiles.length === 1) {
    store
      .deleteFile(selectedFiles[0])
      .then(handleFileDeleteSuccess)
      .catch((error) => {
        quasar.notify({
          message: 'The file could not be deleted.',
          caption: error.response.data.message
            ? error.response.data.message
            : error.message,
          color: 'negative',
        })
      })
  } else {
    store
      .deleteFiles(selectedFiles)
      .then(handleFileDeleteSuccess)
      .catch((error) => {
        quasar.notify({
          message: 'One or more files could not be deleted.',
          caption: error.response.data.message
            ? error.response.data.message
            : error.message,
          color: 'negative',
        })
      })
  }
}

function onDownloadButtonClick() {
  if (selectedFiles.length > DISPLAY_DOWNLOAD_MULTIPLE_FILES_DIALOG_THRESHOLD) {
    isDownloadConfirmationDialogOpen.value = true
  } else {
    onConfirmDownloadButtonClick()
  }
}

function onConfirmDownloadButtonClick() {
  if (isDownloadConfirmationDialogOpen.value) {
    isDownloadConfirmationDialogOpen.value = false
  }

  if (selectedFiles.length === 0) {
    return
  } else if (selectedFiles.length === 1) {
    ApiClientService.getFile(selectedFiles[0])
      .then(handleFileDownloadResponse)
      .catch(handleFileDownloadError)
  } else {
    ApiClientService.getFiles(selectedFiles)
      .then(handleFileDownloadResponse)
      .catch(handleFileDownloadError)
  }
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
    message: 'The media could not be downloaded.',
    caption: error.response.data.message
      ? error.response.data.message
      : error.message,
    color: 'negative',
  })
}

function onSelectAllButtonClick() {
  selectedFiles.splice(0)
  const allFileNames = files.value.map((file) => file.name)
  selectedFiles.push(...allFileNames)
}

function onUnselectAllButtonClick() {
  selectedFiles.splice(0)
}
</script>

<template>
  <p class="text-grey-10">
    The filenames include the local time of the trap while the time below shows
    their creation UTC time.
  </p>
  <q-select
    v-model="typeFilterSelectedOption"
    class="q-mb-md"
    clearable
    dense
    label="Filter by type"
    outlined
    :options="typeFilterOptions"
    width="auto"
  />
  <q-scroll-area
    class="scroll-area bg-grey-2"
    visible
  >
    <div
      v-for="(file, index) in files"
      :key="index"
    >
      <q-item
        v-ripple
        :active="selectedFiles.includes(file.name)"
        clickable
        :dark="false"
        data-test-id="file"
        active-class="bg-blue-1 text-blue-10"
        @click="onSelectionClick(file.name)"
      >
        <q-item-section>
          <q-item-label>{{ file.name }}</q-item-label>
          <q-item-label caption>{{ file.creationTime }}</q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </q-scroll-area>
  <div class="row justify-center q-mt-md">
    <q-btn
      color="primary"
      class="q-mr-sm"
      label="Select all"
      :disable="areAllFilesSelected"
      @click="onSelectAllButtonClick"
    />
    <q-btn
      color="primary"
      label="Unselect all"
      :disable="isNoFileSelected"
      @click="onUnselectAllButtonClick"
    />
  </div>
  <div class="row justify-center q-mt-sm">
    <q-btn
      color="primary"
      class="q-mr-sm"
      label="Download"
      :disable="isNoFileSelected"
      @click="onDownloadButtonClick"
    />
    <q-btn
      color="red"
      label="Delete"
      :disable="isNoFileSelected"
      @click="onDeleteButtonClick"
    />
  </div>
  <q-dialog
    v-model="isDeleteConfirmationDialogOpen"
    persistent
  >
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar
          icon="warning"
          color="red-8"
          text-color="white"
        />
        <span class="q-ml-sm"
          >Do you really want to delete the selected item{{
            selectedFiles.length > 1 ? 's' : ''
          }}?</span
        >
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          v-close-popup
          flat
          label="No"
          color="primary"
        />
        <q-btn
          flat
          label="Yes"
          color="red-8"
          @click="onConfirmDeleteButtonClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog
    v-model="isDownloadConfirmationDialogOpen"
    persistent
  >
    <q-card>
      <q-card-section>
        Downloading multiple files may take a lot of time as they need to be
        zipped first. Consider downloading multiple files via FTP. Do you still
        want to continue?
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          v-close-popup
          flat
          label="No"
          color="primary"
        />
        <q-btn
          flat
          label="Yes"
          color="orange-8"
          @click="onConfirmDownloadButtonClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.scroll-area {
  height: calc(100vh - 370px);
  min-height: 200px;
}
</style>
