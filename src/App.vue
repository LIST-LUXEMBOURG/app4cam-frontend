<script
  setup
  lang="ts"
>
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { useVersionStore } from './stores/version'

const quasar = useQuasar()
const store = useVersionStore()

const frontendCommitHash = __COMMIT_HASH__
const frontendVersion = __APP_VERSION__

const backendCommitHash = computed(() => store.commitHash)
const backendVersion = computed(() => store.version)

store.fetchVersion().catch((error) => {
  quasar.notify({
    message: 'The backend version could not be loaded.',
    caption: error.message ? error.message : '',
    color: 'negative',
  })
})
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      bordered
      class="bg-primary text-white"
      height-hint="98"
    >
      <q-toolbar>
        <q-toolbar-title>App4Cam</q-toolbar-title>
      </q-toolbar>
      <q-tabs>
        <q-route-tab
          :to="{ name: 'Dashboard' }"
          label="Dashboard"
        />
        <q-route-tab
          :to="{ name: 'Shots' }"
          label="Shots"
        />
        <q-route-tab
          :to="{ name: 'Settings' }"
          label="Settings"
        />
      </q-tabs>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <p class="q-mt-xl text-grey-7 text-caption">
      version: frontend {{ frontendVersion }} &ndash;
      {{ frontendCommitHash }} &mdash; backend {{ backendVersion }} &ndash;
      {{ backendCommitHash }}
    </p>
  </q-layout>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
