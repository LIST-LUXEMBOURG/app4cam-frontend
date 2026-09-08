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
  Chart,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { useQuasar } from 'quasar'
import type { Ref } from 'vue'
import { computed, onMounted, ref } from 'vue'
import ApiClientService from '../../helpers/ApiClientService'
import NotificationCreator from '../../helpers/NotificationCreator'

Chart.register(BarController, BarElement, LinearScale, Tooltip)

const CHART_BAR_COLOR = '#FF9800'
const CHART_CONFIGURATION: ChartConfiguration<'bar'> = {
  data: {
    labels: Array.from({ length: 24 }, (_, i) => String(i)),
    datasets: [],
  },
  options: {
    animation: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (items) => `${items[0]!.label}:00 - ${items[0]!.label}:59`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
        },
      },
      y: { border: { display: false }, grid: { drawTicks: false } },
    },
  },
  type: 'bar',
}

const quasar = useQuasar()

let chart: Chart

const canvas = ref(null)
const shotTypes: Ref<string[]> = ref([])

const note = computed(() => {
  if (
    shotTypes.value.includes('pictures') &&
    shotTypes.value.includes('videos')
  ) {
    return 'Only videos are counted as they are unique. Both pictures and videos are configured to be taken.'
  } else if (shotTypes.value.includes('videos')) {
    return 'Only videos are counted as no pictures are taken.'
  } else if (shotTypes.value.includes('pictures')) {
    return 'Only pictures are counted as no videos are taken.'
  }
  return ''
})

function addDatasetToChart(dataset: ChartDataset) {
  chart.data.datasets.push(dataset)
  chart.update()
}

function initialiseChart() {
  if (!canvas.value) {
    return
  }
  chart = new Chart(canvas.value, CHART_CONFIGURATION)
}

async function loadNumberFilesPerHourOfDay() {
  try {
    const response = await ApiClientService.getNumberFilesPerHourOfDay()
    const mediaPerHourOfDay = response.hoursOfDayCounts
    const datasets: ChartDataset = {
      backgroundColor: CHART_BAR_COLOR,
      barPercentage: 1.1,
      data: mediaPerHourOfDay,
    }
    addDatasetToChart(datasets)
  } catch (error: unknown) {
    NotificationCreator.showErrorNotification(
      quasar,
      error,
      'The numbers of media taken over the day could not be loaded.',
    )
  }
}

async function loadShotTypes() {
  try {
    const response = await ApiClientService.getShotTypes()
    shotTypes.value = response.shotTypes
  } catch (error: unknown) {
    NotificationCreator.showErrorNotification(
      quasar,
      error,
      'The shot types could not be loaded.',
    )
  }
}

onMounted(async () => {
  initialiseChart()
  await loadNumberFilesPerHourOfDay()
  await loadShotTypes()
})
</script>

<template>
  <q-card class="q-mb-lg">
    <q-card-section class="q-pa-sm">
      <div class="row justify-between items-center">
        <div
          class="text-h6"
          role="heading"
        >
          Total observations over the day
        </div>
        <q-icon
          v-if="shotTypes.length && note"
          name="info"
          size="sm"
        >
          <q-tooltip
            class="text-body2"
            max-width="350px"
          >
            {{ note }}
          </q-tooltip>
        </q-icon>
      </div>
    </q-card-section>
    <q-card-section class="q-pa-sm">
      <div style="height: 200px">
        <canvas ref="canvas"></canvas>
      </div>
    </q-card-section>
  </q-card>
</template>
