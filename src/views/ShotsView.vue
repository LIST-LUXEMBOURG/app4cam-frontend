<script setup lang="ts">
import { useQuasar } from 'quasar'
import { computed, reactive } from 'vue'
import { useStore } from '../store'
import { Actions } from '../store/action-types'
import ApiClientService, {
  FileDownloadResponse,
} from '../services/ApiClientService'

const quasar = useQuasar()
const store = useStore()

store.dispatch(Actions.FETCH_FILES).catch((error) => {
  quasar.notify({
    message: 'The files could not be loaded.',
    caption: error.message ? error.message : '',
    color: 'negative',
  })
})

const selectedFiles: string[] = reactive([])

const files = computed(() => store.state.files)
const isDownloadButtonDisabled = computed(() => selectedFiles.length === 0)

function onSelectionClick(filename: string) {
  const filenameIndex = selectedFiles.indexOf(filename)
  if (filenameIndex !== -1) {
    selectedFiles.splice(filenameIndex, 1)
  } else {
    selectedFiles.push(filename)
  }
}

function onDownloadButtonClick() {
  function handleFileDownloadResponse(response: FileDownloadResponse): void {
    const file = new Blob([response.data], { type: response.contentType })
    const fileUrl = URL.createObjectURL(file)
    const anchorElement = document.createElement('a')
    anchorElement.download = response.filename
    anchorElement.href = fileUrl
    anchorElement.click()
    URL.revokeObjectURL(anchorElement.href)
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
</script>

<template>
  <h5 class="q-my-md">Shots</h5>
  <div class="q-mx-auto" style="max-width: 400px">
    <div v-for="(file, index) in files" :key="index" class="q-px-md">
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
  <q-btn
    class="q-my-md"
    color="primary"
    label="Download"
    :disable="isDownloadButtonDisabled"
    data-test-id="download-button"
    @click="onDownloadButtonClick"
  />
</template>
