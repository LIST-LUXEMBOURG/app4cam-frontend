<script setup lang="ts">
import { useQuasar } from 'quasar'
import { computed, reactive } from 'vue'
import ApiClientService from '../services/ApiClientService'
import { FileDownloader } from '../services/FileDownloader'
import { FileDownloadResponse } from '../services/ApiTypings'
import { useFilesStore } from '../stores/files'

const quasar = useQuasar()
const store = useFilesStore()

store.fetchFiles().catch((error) => {
  quasar.notify({
    message: 'The files could not be loaded.',
    caption: error.message ? error.message : '',
    color: 'negative',
  })
})

const selectedFiles: string[] = reactive([])

const files = computed(() => store.files)
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
  function handleFileDeleteSuccess(): void {
    selectedFiles.splice(0)
    quasar.notify({
      message: 'Successfully deleted',
      color: 'positive',
    })
  }

  if (selectedFiles.length === 0) {
    return
  } else if (selectedFiles.length === 1) {
    store
      .deleteFile(selectedFiles[0])
      .then(handleFileDeleteSuccess)
      .catch((error) => {
        quasar.notify({
          message: 'The file could not be deleted.',
          caption: error.message ? error.message : '',
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
          caption: error.message ? error.message : '',
          color: 'negative',
        })
      })
  }
}

function onDownloadButtonClick() {
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
      message: 'The shots could not be downloaded.',
      caption: error.message ? error.message : '',
      color: 'negative',
    })
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
  <div class="q-mx-auto wrapper">
    <div>
      <div v-for="(file, index) in files" :key="index">
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
    </div>
    <div class="row justify-center q-my-md">
      <q-btn
        color="primary"
        class="q-mr-sm"
        label="Select all"
        :disable="areAllFilesSelected"
        data-test-id="select-all-button"
        @click="onSelectAllButtonClick"
      />
      <q-btn
        color="primary"
        label="Unselect all"
        :disable="isNoFileSelected"
        data-test-id="unselect-all-button"
        @click="onUnselectAllButtonClick"
      />
    </div>
    <div class="row justify-center q-my-md">
      <q-btn
        color="primary"
        class="q-mr-sm"
        label="Download"
        :disable="isNoFileSelected"
        data-test-id="download-button"
        @click="onDownloadButtonClick"
      />
      <q-btn
        color="primary"
        label="Delete"
        :disable="isNoFileSelected"
        data-test-id="delete-button"
        @click="onDeleteButtonClick"
      />
    </div>
  </div>
</template>

<style>
.wrapper {
  max-width: 400px;
}
</style>
