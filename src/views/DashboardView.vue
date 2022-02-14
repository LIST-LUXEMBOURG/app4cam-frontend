<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import { useStore } from '../store'
import { Actions } from '../store/action-types'

const quasar = useQuasar()
const store = useStore()

const deviceId = ref('')
const siteName = ref('')

store
  .dispatch(Actions.FETCH_SETTINGS)
  .then(() => {
    deviceId.value = store.state.deviceId
    siteName.value = store.state.siteName
  })
  .catch((error) => {
    quasar.notify({
      message: 'The site name and device ID could not be loaded.',
      caption: error.message ? error.message : '',
      color: 'negative',
    })
  })
</script>

<template>
  <h5 class="q-my-md" data-test-id="deviceInformation">
    {{ siteName }} {{ deviceId }}
  </h5>
</template>

<style scoped></style>
