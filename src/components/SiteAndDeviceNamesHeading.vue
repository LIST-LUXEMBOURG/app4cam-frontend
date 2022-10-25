<script setup lang="ts">
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
    caption: error.message ? error.message : '',
    color: 'negative',
  })
}
</script>

<template>
  <h5 class="q-mt-none">
    {{ store.general.siteName }} {{ store.general.deviceName }}
  </h5>
</template>
