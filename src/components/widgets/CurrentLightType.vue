<!--
Copyright (C) 2026 Luxembourg Institute of Science and Technology

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
import NotificationCreator from 'src/helpers/NotificationCreator'
import { usePropertiesStore } from 'src/stores/properties'

const quasar = useQuasar()
const properties = usePropertiesStore()

try {
  await properties.fetchLightType()
} catch (error: unknown) {
  NotificationCreator.showErrorNotification(
    quasar,
    error,
    'The current light type could not be loaded.',
  )
}
</script>

<template>
  <q-card
    v-if="properties.lightType !== 'unsupported'"
    class="q-mb-lg overflow-auto"
    data-test-id="light-type-widget"
  >
    <q-card-section class="q-pa-sm">
      <div class="row justify-between items-center">
        <div
          class="text-h6"
          role="heading"
        >
          Current light type
        </div>
        <div>{{ properties.lightType }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>
