<script
  setup
  lang="ts"
>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useSettingsStore } from '../stores/settings'

const quasar = useQuasar()
const store = useSettingsStore()

const deviceId = ref('')
const siteName = ref('')

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

deviceId.value = store.deviceId
siteName.value = store.siteName
</script>

<template>
  <h5
    class="q-mt-none"
    data-test-id="deviceInformation"
  >
    {{ siteName }} {{ deviceId }}
  </h5>
</template>
