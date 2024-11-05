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
import { Ref, computed, reactive, ref } from 'vue'
import ApiClientService from 'src/helpers/ApiClientService'
import NotificationCreator from 'src/helpers/NotificationCreator'

const quasar = useQuasar()

const chartOptions: ApexOptions = reactive({
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  colors: ['#ff9800'],
  dataLabels: {
    enabled: false,
  },
  grid: {
    padding: {
      left: -5,
      top: -15,
      right: 0,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: '90%',
    },
  },
  tooltip: {
    enabled: true,
    x: {
      formatter: (value) => `${value}:00 - ${value}:59`,
    },
    y: {
      title: {
        formatter: () => '',
      },
    },
  },
  xaxis: {
    axisTicks: {
      show: false,
    },
    offsetY: -2,
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return val.toFixed(0)
      },
      offsetX: -10,
    },
  },
})
const chartSeries: { data: { x: number; y: number }[] }[] = reactive([])

let mediaPerHourOfDay: number[] = []
try {
  const response = await ApiClientService.getNumberFilesPerHourOfDay()
  mediaPerHourOfDay = response.hoursOfDayCounts
  chartSeries.slice(0)
  const data = []
  for (let i = 0; i < mediaPerHourOfDay.length; i++) {
    data.push({
      x: i,
      y: mediaPerHourOfDay[i],
    })
  }
  chartSeries.push({ data })
} catch (error: unknown) {
  NotificationCreator.showErrorNotification(
    quasar,
    error,
    'The numbers of media taken over the day could not be loaded.',
  )
}

let shotTypes: Ref<string[]> = ref([])
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
        <apexchart
          height="100%"
          type="bar"
          width="334"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>
    </q-card-section>
  </q-card>
</template>
