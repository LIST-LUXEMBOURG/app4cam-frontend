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
import { computed } from 'vue'
import { usePropertiesStore } from '../stores/properties'
import LicenseDialog from 'components/LicenseDialog.vue'

const quasar = useQuasar()
const store = usePropertiesStore()

// eslint-disable-next-line no-undef
const frontendCommitHash = __COMMIT_HASH__
// eslint-disable-next-line no-undef
const frontendVersion = __APP_VERSION__

const backendCommitHash = computed(() => store.commitHash)
const backendVersion = computed(() => store.version)

function openLicenseDialog() {
  quasar.dialog({
    component: LicenseDialog,
  })
}

store.fetchVersion().catch((error) => {
  quasar.notify({
    message: 'The backend version could not be loaded.',
    caption: error.response.data.message
      ? error.response.data.message
      : error.message,
    color: 'negative',
  })
})
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      bordered
      class="bg-primary text-white text-center"
      height-hint="98"
    >
      <q-toolbar>
        <q-toolbar-title>App4Cam</q-toolbar-title>
        <img
          alt="Logo of Luxembourg Institute of Science and Technology, abbreviated LIST, representing a sphere with multiple lines"
          src="/list-logo.png"
          style="height: 36px"
        />
      </q-toolbar>
      <q-tabs>
        <q-route-tab
          :to="{ name: 'Dashboard' }"
          label="Dashboard"
        />
        <q-route-tab
          :to="{ name: 'Media' }"
          label="Media"
        />
        <q-route-tab
          :to="{ name: 'Settings' }"
          label="Settings"
        />
      </q-tabs>
    </q-header>
    <q-page-container>
      <div class="q-pt-md q-mx-auto wrapper">
        <router-view />
      </div>
    </q-page-container>
    <footer class="q-mt-lg q-mb-sm q-mx-auto text-grey-8 text-center">
      version: frontend {{ frontendVersion }} &ndash;
      {{ frontendCommitHash }} &mdash; backend {{ backendVersion }} &ndash;
      {{ backendCommitHash }} &mdash; developed by LIST
      <a
        href="#"
        @click="openLicenseDialog"
        >(license)</a
      >
    </footer>
  </q-layout>
</template>

<style scoped>
.q-toolbar,
.wrapper,
footer {
  max-width: 350px;
}

.q-toolbar {
  margin: auto;
  padding: 0;
}

.q-toolbar__title {
  text-align: left;
}

footer {
  font-size: 11px;
}
</style>
