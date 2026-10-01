<!--
Copyright (C) since 2022 Luxembourg Institute of Science and Technology

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
import PowerActions from '@/components/PowerActions.vue'
import ExportImport from '../components/ExportImport.vue'
import LogFileDownloads from '../components/LogFileDownloads.vue'
import UpgradeButton from '../components/UpgradeButton.vue'
</script>

<template>
  <q-list bordered>
    <q-expansion-item
      group="tools"
      icon="swap_horiz"
      label="Export & import settings"
    >
      <q-card>
        <q-card-section>
          <ExportImport />
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-separator />

    <q-expansion-item
      group="tools"
      icon="list_alt"
      label="Download log files"
    >
      <q-card>
        <q-card-section>
          <LogFileDownloads />
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-separator />

    <q-expansion-item
      group="tools"
      icon="power_settings_new"
      label="Shut down & restart device"
    >
      <q-card>
        <q-card-section>
          <PowerActions />
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-separator />

    <q-expansion-item
      group="tools"
      icon="upgrade"
      label="Upgrade App4Cam"
    >
      <q-card>
        <q-card-section>
          <UpgradeButton />
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>
