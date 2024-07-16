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
import { useSettingsStore } from '../stores/settings'

const quasar = useQuasar()
const store = useSettingsStore()

try {
  await store.fetchSettings()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (error: any) {
  quasar.notify({
    message: 'The site name and device ID could not be loaded.',
    caption: error.response.data.message
      ? error.response.data.message
      : error.message,
    color: 'negative',
  })
}
</script>

<template>
  <h5 class="q-mt-none">
    {{ store.current.general.siteName }} {{ store.current.general.deviceName }}
  </h5>
</template>
