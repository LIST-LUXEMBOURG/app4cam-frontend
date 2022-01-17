<script setup lang="ts">
import { useQuasar } from 'quasar'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { Actions } from '../store/action-types'

const quasar = useQuasar()
const store = useStore()

const deviceId = ref('')
const isLoading = ref(true)
const siteName = ref('')

const filenamePreview = computed(() => siteName.value + ' ' + deviceId.value)

store
  .dispatch(Actions.FETCH_SETTINGS)
  .then(() => {
    isLoading.value = false
    deviceId.value = store.state.deviceId
    siteName.value = store.state.siteName
  })
  .catch((error) => {
    quasar.notify({
      message: 'The settings could not be loaded.',
      caption: error.message ? error.message : '',
      color: 'negative',
    })
  })

function onSubmit() {
  store
    .dispatch(Actions.SAVE_SETTINGS, {
      deviceId: deviceId.value,
      siteName: siteName.value,
    })
    .then(() => {
      quasar.notify({
        message: 'The settings were saved.',
        color: 'positive',
      })
    })
    .catch((error) => {
      quasar.notify({
        message: 'The settings could not be saved.',
        caption: error.message ? error.message : '',
        color: 'negative',
      })
    })
}
</script>

<template>
  <h5 class="q-my-md">Settings</h5>
  <div class="q-pa-md q-mx-auto" style="max-width: 400px">
    <q-form
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      class="q-gutter-md"
      @submit="onSubmit"
    >
      <q-input v-model="siteName" :disable="isLoading" label="Site name" />
      <q-input v-model="deviceId" :disable="isLoading" label="Device ID" />
      <h6 class="q-my-md">Filename preview</h6>
      <p>{{ filenamePreview }}</p>
      <q-btn label="Save" type="submit" color="primary" />
    </q-form>
  </div>
</template>
