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
<template>
  <q-card>
    <q-card-section class="row q-gutter-sm q-pb-none">
      <q-icon
        name="schedule"
        size="md"
      />
      <div
        class="text-h5"
        role="heading"
      >
        Time Out Of Sync
      </div>
    </q-card-section>

    <q-card-section>
      The difference between the time of the trap and the time of your browser
      is larger than 1 minute. Please check the currently configured trap time.
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        v-close-popup
        flat
        label="Cancel"
      />
      <q-btn
        v-close-popup
        color="primary"
        flat
        label="Go to settings"
        to="/settings"
      />
    </q-card-actions>
  </q-card>
</template>
