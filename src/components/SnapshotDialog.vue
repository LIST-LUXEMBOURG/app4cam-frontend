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
import { useDialogPluginComponent } from 'quasar'

const { dialogRef, onDialogHide } = useDialogPluginComponent()

defineProps<{ snapshotUrl: string }>()

defineEmits([...useDialogPluginComponent.emits])
</script>

<template>
  <q-dialog
    ref="dialogRef"
    maximized
    @hide="onDialogHide"
  >
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Snapshot</div>
        <q-space />
        <q-btn
          v-close-popup
          dense
          flat
          icon="close"
          round
        />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <img
          class="snapshot"
          :src="snapshotUrl"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.snapshot {
  max-width: 100%;
}
</style>
