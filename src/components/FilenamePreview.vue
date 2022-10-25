<script setup lang="ts">
import { computed } from 'vue'
import FilenameCreator from '../helpers/FilenameCreator'

const props = defineProps<{
  deviceName: string | undefined
  siteName: string | undefined
  systemTime: string | undefined
  timeZone: string | undefined
}>()

const filenamePreview = computed(() =>
  FilenameCreator.createFilename({
    deviceName: props.deviceName,
    siteName: props.siteName,
    systemTime: props.systemTime ? new Date(props.systemTime) : undefined,
    timeZone: props.timeZone,
    extension: 'extension',
  }),
)
</script>

<template>
  <h6 class="q-mt-none q-mb-sm">Filename preview</h6>
  <div data-test-id="filenamePreview">{{ filenamePreview }}</div>
</template>
