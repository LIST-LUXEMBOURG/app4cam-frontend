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
