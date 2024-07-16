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
