<script
  setup
  lang="ts"
>
import { useQuasar } from 'quasar'
import { computed, reactive, ref } from 'vue'
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

const typeFilterOptions = ['Pictures', 'Videos']

const isDeleteConfirmationDialogOpen = ref(false)
const typeFilterSelectedOption = ref(null)

const selectedFiles: string[] = reactive([])

const files = computed(() => {
  if (typeFilterSelectedOption.value === 'Pictures') {
    return store.files.filter((f) => f.name.endsWith('jpg'))
  } else if (typeFilterSelectedOption.value === 'Videos') {
    return store.files.filter((f) => f.name.endsWith('mkv'))
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
    <q-select
      v-model="typeFilterSelectedOption"
      outlined
      :options="typeFilterOptions"
      label="Filter by type"
      class="q-mb-md q-mx-xl"
      clearable
    />
    <div>
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
        color="red"
        label="Delete"
        :disable="isNoFileSelected"
        data-test-id="delete-button"
        @click="onDeleteButtonClick"
      />
    </div>
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
          >Do you really want to delete the selected shot{{
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
</template>

<style>
.wrapper {
  max-width: 400px;
}
</style>
