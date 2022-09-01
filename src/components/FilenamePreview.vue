<script setup lang="ts">
import { computed } from 'vue'
import FilenameCreator from '../helpers/FilenameCreator'

const props = defineProps<{
  deviceName: string | undefined
  siteName: string | undefined
  systemTime: Date | undefined
  timeZone: string | undefined
}>()

const filenamePreview = computed(() =>
  FilenameCreator.createFilename({
    deviceName: props.deviceName,
    siteName: props.siteName,
    systemTime: props.systemTime,
    timeZone: props.timeZone,
    extension: 'extension',
  }),
)
</script>

<template>
  <h6 class="q-mb-sm">Filename preview</h6>
  <p data-test-id="filenamePreview">{{ filenamePreview }}</p>
</template>
