<script setup lang="ts">
// © 2022-2024 Luxembourg Institute of Science and Technology
import { useQuasar } from 'quasar'
import { useFilesStore } from '../stores/files'

const quasar = useQuasar()
const store = useFilesStore()

try {
  await store.fetchFiles()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
  quasar.notify({
    message: 'The numbers of media could not be loaded.',
    caption: error.message ? error.message : '',
    color: 'negative',
  })
}
</script>

<template>
  <h6 class="q-mb-sm">Media</h6>
  <p>Pictures: {{ store.pictureCount }}</p>
  <p>Videos: {{ store.videoCount }}</p>
</template>
