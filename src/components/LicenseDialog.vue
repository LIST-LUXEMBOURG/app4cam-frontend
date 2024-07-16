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

defineEmits([...useDialogPluginComponent.emits])
</script>

<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card>
      <q-card-section class="row q-gutter-sm q-pb-none">
        <div
          class="text-h5"
          role="heading"
        >
          License
        </div>
        <q-space />
        <q-btn
          v-close-popup
          dense
          flat
          icon="close"
          round
        />
      </q-card-section>

      <q-card-section>
        Copyright (C) 2022-2024 Luxembourg Institute of Science and
        Technology<br /><br />

        App4Cam is free software: you can redistribute it and/or modify it under
        the terms of the GNU General Public License as published by the Free
        Software Foundation, either version 3 of the License, or (at your
        option) any later version.<br /><br />

        App4Cam is distributed in the hope that it will be useful, but WITHOUT
        ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
        FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
        more details.<br /><br />

        You should have received a copy of the GNU General Public License along
        with App4Cam. If not, see
        <a href="https://www.gnu.org/licenses/">https://www.gnu.org/licenses/</a
        >.
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
