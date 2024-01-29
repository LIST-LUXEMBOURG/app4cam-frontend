<script setup lang="ts">
import { useQuasar } from 'quasar'
import { usePropertiesStore } from 'src/stores/properties'

const quasar = useQuasar()
const properties = usePropertiesStore()

try {
  await properties.fetchBatteryVoltage()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
  quasar.notify({
    message: 'The battery status could not be loaded.',
    caption: error.message ? error.message : '',
    color: 'negative',
  })
}
</script>

<template>
  <h6 class="q-mb-sm">Battery status</h6>
  <p>Battery voltage: {{ properties.batteryVoltage }}</p>
</template>
