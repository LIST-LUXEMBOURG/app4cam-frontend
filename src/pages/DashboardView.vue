<script setup lang="ts">
// © 2022-2024 Luxembourg Institute of Science and Technology
import { useQuasar } from 'quasar'
import { onErrorCaptured, Ref, ref } from 'vue'
import DiskUsage from '../components/DiskUsage.vue'
import MediaCounts from '../components/MediaCounts.vue'
import SiteAndDeviceNamesHeading from '../components/SiteAndDeviceNamesHeading.vue'
import SnapshotSection from '../components/SnapshotSection.vue'
import BatteryStatus from 'src/components/BatteryStatus.vue'
import MediaPerHourOfDay from 'src/components/MediaPerHourOfDay.vue'

const quasar = useQuasar()

const error: Ref<Error | null> = ref(null)

onErrorCaptured((e) => {
  error.value = e
  quasar.notify({
    message: 'Loading one or more components failed.',
    caption: e.message ? e.message : '',
    color: 'negative',
  })
})
</script>

<template>
  <Suspense v-if="!error">
    <template #default>
      <div>
        <site-and-device-names-heading />
        <disk-usage />
        <MediaPerHourOfDay />
        <media-counts />
        <BatteryStatus />
        <snapshot-section />
      </div>
    </template>
    <template #fallback>
      <div>
        <span class="material-icons"> sync </span>
        Loading...
      </div>
    </template>
  </Suspense>
</template>

<style scoped>
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
}

.material-icons {
  font-size: 36px;
  animation: rotation infinite 1s ease-in-out;
}
</style>
