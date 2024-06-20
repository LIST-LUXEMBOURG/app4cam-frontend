<script setup lang="ts">
// © 2024 Luxembourg Institute of Science and Technology
import { ApexOptions } from 'apexcharts'
import { useQuasar } from 'quasar'
import { Ref, computed, reactive, ref } from 'vue'
import ApiClientService from 'src/helpers/ApiClientService'

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
  dataLabels: {
    enabled: false,
  },
  grid: {
    padding: {
      left: -25,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: '90%',
      dataLabels: {
        position: 'top',
      },
    },
  },
  theme: {
    palette: 'palette7',
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
  yaxis: {
    labels: {
      offsetX: -22,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
  quasar.notify({
    message: 'The numbers of media taken over the day could not be loaded.',
    caption:
      error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message,
    color: 'negative',
  })
}

let shotTypes: Ref<string[]> = ref([])
try {
  const response = await ApiClientService.getShotTypes()
  shotTypes.value = response.shotTypes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
  quasar.notify({
    message: 'The shot types could not be loaded.',
    caption:
      error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message,
    color: 'negative',
  })
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
  <h6 class="q-mb-xs">Media taken over the day</h6>
  <apexchart
    width="350"
    type="bar"
    :options="chartOptions"
    :series="chartSeries"
  />
  <div v-if="shotTypes.length && note">{{ note }}</div>
</template>
