<script setup lang="ts">
import { computed } from 'vue'
import FilenameCreator from '../helpers/FilenameCreator'

const props = defineProps<{
  deviceId: string
  siteName: string
  systemTime: Date
  timeZone: string
}>()

const filenamePreview = computed(() =>
  FilenameCreator.createFilename(
    props.deviceId,
    props.siteName,
    props.systemTime,
    props.timeZone,
    'extension',
  ),
)
</script>

<template>
  <h6 class="q-mb-sm">Filename preview</h6>
  <p data-test-id="filenamePreview">{{ filenamePreview }}</p>
</template>
