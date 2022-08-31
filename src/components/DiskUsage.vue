<script setup lang="ts">
import { ApexOptions } from 'apexcharts'
import { useQuasar } from 'quasar'
import { reactive, ref } from 'vue'
import { useStorageStore } from '../stores/storage'

const quasar = useQuasar()
const store = useStorageStore()

const capacityGb = ref(0)
const chartOptions: ApexOptions = reactive({
  labels: ['used', 'available'],
  plotOptions: {
    pie: {
      expandOnClick: false,
    },
  },
  theme: {
    palette: 'palette7',
  },
  tooltip: {
    enabled: false,
  },
})
const chartSeries: number[] = reactive([])

function convertKbToGb(input: number): number {
  return input / 1024 / 1024
}

try {
  await store.fetchStorage()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
  quasar.notify({
    message: 'The disk space usage data could not be loaded.',
    caption: error.message ? error.message : '',
    color: 'negative',
  })
}

chartSeries.splice(0)
const usedKb = (store.capacityKb * store.usedPercentage) / 100
const usedMb = convertKbToGb(usedKb)
const availableKb = store.capacityKb - usedKb
const availableMb = convertKbToGb(availableKb)
chartSeries.push(usedMb, availableMb)
if (chartOptions.labels) {
  chartOptions.labels[0] = `${usedMb.toFixed(2)} GB used`
  chartOptions.labels[1] = `${availableMb.toFixed(2)} GB available`
}
capacityGb.value = Math.round(usedMb + availableMb)
</script>

<template>
  <h6 class="q-mb-sm">Disk storage</h6>
  <p>Total capacity: {{ capacityGb }} GB</p>
  <apexchart
    width="400"
    type="pie"
    :options="chartOptions"
    :series="chartSeries"
  />
</template>
