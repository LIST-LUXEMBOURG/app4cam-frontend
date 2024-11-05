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
import { ApexOptions } from 'apexcharts'
import { useQuasar } from 'quasar'
import { reactive, ref } from 'vue'
import { useStorageStore } from '../../stores/storage'
import NotificationCreator from 'src/helpers/NotificationCreator'

const quasar = useQuasar()
const store = useStorageStore()

const capacityGb = ref(0)
const chartOptions: ApexOptions = reactive({
  chart: {
    stacked: true,
    stackType: '100%',
    toolbar: {
      show: false,
    },
    type: 'bar',
  },
  colors: ['#ff9800', '#2196f3'],
  fill: {
    opacity: 1,
  },
  grid: {
    show: false,
    padding: {
      bottom: -10,
      left: -25,
      right: -5,
      top: -29,
    },
  },
  legend: {
    horizontalAlign: 'left',
    offsetX: -33,
  },
  plotOptions: {
    bar: {
      barHeight: '100%',
      horizontal: true,
    },
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      show: false,
    },
    labels: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    show: false,
  },
})
const chartSeries: { name: string; data: number[] }[] = reactive([])

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
} catch (error: unknown) {
  NotificationCreator.showErrorNotification(
    quasar,
    error,
    'The storage usage details could not be loaded.',
  )
}

chartSeries.splice(0)
const usedKb = (store.usage.capacityKb * store.usage.usedPercentage) / 100
const usedMb = convertKbToGb(usedKb)
const availableKb = store.usage.capacityKb - usedKb
const availableMb = convertKbToGb(availableKb)
chartSeries.push(
  { name: `${usedMb.toFixed(2)} GB used`, data: [usedMb] },
  { name: `${availableMb.toFixed(2)} GB available`, data: [availableMb] },
)
capacityGb.value = Math.round(usedMb + availableMb)

reloadStatus()
</script>

<template>
  <q-card class="q-mb-lg">
    <q-card-section class="q-pa-sm">
      <div
        class="text-h6"
        role="heading"
      >
        Disk storage
      </div>
    </q-card-section>
    <q-card-section class="q-pa-sm">
      <div class="q-mb-sm">Total capacity: {{ capacityGb }} GB</div>
      <div style="height: 55px">
        <apexchart
          height="100%"
          width="334"
          type="bar"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>
      <div
        class="row q-mt-sm rounded-borders q-pa-sm text-white justify-between items-center"
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
    </q-card-section>
  </q-card>
</template>
