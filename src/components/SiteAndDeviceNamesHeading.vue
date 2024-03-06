<script setup lang="ts">
// © 2022-2023 Luxembourg Institute of Science and Technology
import { useQuasar } from 'quasar'
import { useSettingsStore } from '../stores/settings'

const quasar = useQuasar()
const store = useSettingsStore()

try {
  await store.fetchSettings()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
  quasar.notify({
    message: 'The site name and device ID could not be loaded.',
    caption: error.response.data.message
      ? error.response.data.message
      : error.message,
    color: 'negative',
  })
}
</script>

<template>
  <h5 class="q-mt-none">
    {{ store.current.general.siteName }} {{ store.current.general.deviceName }}
  </h5>
</template>
