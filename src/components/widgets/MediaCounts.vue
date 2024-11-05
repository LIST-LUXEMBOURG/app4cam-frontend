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
import { useFilesStore } from '../../stores/files'
import NotificationCreator from 'src/helpers/NotificationCreator'

const quasar = useQuasar()
const store = useFilesStore()

try {
  await store.fetchFiles()
} catch (error: unknown) {
  NotificationCreator.showErrorNotification(
    quasar,
    error,
    'The numbers of media could not be loaded.',
  )
}
</script>

<template>
  <q-card class="q-mb-lg overflow-auto">
    <q-card-section class="q-pa-sm">
      <div
        class="text-h6"
        role="heading"
      >
        Media
      </div>
    </q-card-section>
    <q-card-section class="q-pa-sm">
      <ul class="q-my-none no-padding">
        <li>Pictures: {{ store.pictureCount }}</li>
        <li>Videos: {{ store.videoCount }}</li>
      </ul>
    </q-card-section>
  </q-card>
</template>

<style scoped>
ul {
  list-style-type: none;
}
</style>
