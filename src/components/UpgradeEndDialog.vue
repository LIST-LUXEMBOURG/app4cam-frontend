<!--
Copyright (C) 2024  Luxembourg Institute of Science and Technology

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

const { dialogRef, onDialogOK } = useDialogPluginComponent()

defineProps<{ iconName: string; message: string; title: string }>()

defineEmits([...useDialogPluginComponent.emits])
</script>

<template>
  <q-dialog
    ref="dialogRef"
    persistent
  >
    <q-card style="max-width: 300px">
      <q-card-section>
        <div class="text-h5">{{ title }}</div>
      </q-card-section>
      <q-card-section class="text-center">
        <q-icon
          color="primary"
          :name="iconName"
          size="5em"
        />
      </q-card-section>
      <q-card-section v-if="message">{{ message }}</q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          flat
          label="OK"
          @click="onDialogOK"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
