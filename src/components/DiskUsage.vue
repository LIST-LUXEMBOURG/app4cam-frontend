<script setup lang="ts">
// © 2022-2024 Luxembourg Institute of Science and Technology
import { ApexOptions } from 'apexcharts'
import { useQuasar } from 'quasar'
import { reactive, ref } from 'vue'
import { useStorageStore } from '../stores/storage'

const quasar = useQuasar()
const store = useStorageStore()

const capacityGb = ref(0)
const chartOptions: ApexOptions = reactive({
  grid: {
    padding: {
      left: -25,
    },
  },
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

async function reloadStatus() {
  try {
    await store.fetchStorageStatus()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    store.status.isAvailable = false
    let message = 'The storage status could not be loaded.'
    if (error.message) {
      message += ' ' + error.message
    }
    store.status.message = message
  }
}

try {
  await store.fetchStorage()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
  quasar.notify({
    message: 'The storage usage details could not be loaded.',
    caption: error.message ? error.message : '',
    color: 'negative',
  })
}

chartSeries.splice(0)
const usedKb = (store.usage.capacityKb * store.usage.usedPercentage) / 100
const usedMb = convertKbToGb(usedKb)
const availableKb = store.usage.capacityKb - usedKb
const availableMb = convertKbToGb(availableKb)
chartSeries.push(usedMb, availableMb)
if (chartOptions.labels) {
  chartOptions.labels[0] = `${usedMb.toFixed(2)} GB used`
  chartOptions.labels[1] = `${availableMb.toFixed(2)} GB available`
}
capacityGb.value = Math.round(usedMb + availableMb)

reloadStatus()
</script>

<template>
  <h6 class="q-mb-sm">Disk storage</h6>
  <p>Total capacity: {{ capacityGb }} GB</p>
  <apexchart
    width="350"
    type="pie"
    :options="chartOptions"
    :series="chartSeries"
  />
  <div
    class="row q-mt-md rounded-borders q-pa-sm text-white justify-between"
    :class="{
      'bg-positive': store.status.isAvailable,
      'bg-negative': !store.status.isAvailable,
    }"
  >
    <div>
      <q-icon
        v-if="store.status.isAvailable"
        name="check_circle"
        size="xs"
      />
      <q-icon
        v-else
        name="cancel"
        size="xs"
      />
    </div>
    <div class="col q-px-sm">
      {{ store.status.message }}
    </div>
    <div>
      <q-btn
        flat
        icon="refresh"
        round
        @click="reloadStatus"
      >
        <q-tooltip>Reload status</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>
