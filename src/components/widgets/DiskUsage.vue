<!--
Copyright (C) since 2022 Luxembourg Institute of Science and Technology

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
import type { ChartConfiguration, ChartDataset } from 'chart.js'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
} from 'chart.js'
import { useQuasar } from 'quasar'
import { onMounted, ref } from 'vue'
import NotificationCreator from '../../helpers/NotificationCreator'
import { useStorageStore } from '../../stores/storage'

Chart.register(BarController, BarElement, CategoryScale, Legend, LinearScale)

const CHART_BAR_COLORS = ['#FF9800', '#2196F3']
const CHART_BAR_THICKNESS = 25
const CHART_CONFIGURATION: ChartConfiguration<'bar'> = {
  data: {
    labels: ['Storage'],
    datasets: [],
  },
  options: {
    animation: false,
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          boxWidth: 12,
        },
        onClick: () => {},
        position: 'bottom',
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        stacked: true,
      },
    },
  },
  type: 'bar',
}

const quasar = useQuasar()
const store = useStorageStore()

let chart: Chart

const capacityGb = ref(0)
const canvas = ref(null)

function addDatasetsToChart(datasets: ChartDataset[]) {
  chart.options.scales!.x!.max = capacityGb.value
  datasets.forEach((dataset) => {
    chart.data.datasets.push(dataset)
  })
  chart.update()
}

function convertKbToGb(input: number): number {
  return input / 1024 / 1024
}

function initialiseChart() {
  if (!canvas.value) {
    return
  }
  chart = new Chart(canvas.value, CHART_CONFIGURATION)
}

async function loadStorageUsage() {
  try {
    await store.fetchStorage()
  } catch (error: unknown) {
    NotificationCreator.showErrorNotification(
      quasar,
      error,
      'The storage usage details could not be loaded.',
    )
    return
  }
  const usedKb = (store.usage.capacityKb * store.usage.usedPercentage) / 100
  const usedGb = convertKbToGb(usedKb)
  const availableKb = store.usage.capacityKb - usedKb
  const availableGb = convertKbToGb(availableKb)
  capacityGb.value = Math.round(usedGb + availableGb)
  const datasets: ChartDataset[] = [
    {
      backgroundColor: CHART_BAR_COLORS[0],
      barThickness: CHART_BAR_THICKNESS,
      data: [usedGb],
      label: `${usedGb.toFixed(2)} GB used`,
    },
    {
      backgroundColor: CHART_BAR_COLORS[1],
      barThickness: CHART_BAR_THICKNESS,
      data: [availableGb],
      label: `${availableGb.toFixed(2)} GB available`,
    },
  ]
  addDatasetsToChart(datasets)
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

onMounted(async () => {
  initialiseChart()
  await loadStorageUsage()
  await reloadStatus()
})
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
        <canvas ref="canvas"></canvas>
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
