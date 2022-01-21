<script setup lang="ts">
import { debounce, useQuasar } from 'quasar'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { Actions } from '../store/action-types'

const quasar = useQuasar()
const store = useStore()

const deviceId = ref('')
const isLoading = ref(true)
const siteName = ref('')
const systemTime = ref(new Date())

const date = computed({
  get: () => systemTime.value.toISOString().slice(0, 10),
  set: (value) => {
    const year = parseInt(value.slice(0, 4))
    const month = parseInt(value.slice(5, 7))
    const day = parseInt(value.slice(8, 10))
    const date = new Date(systemTime.value.valueOf())
    date.setUTCFullYear(year)
    date.setUTCMonth(month - 1)
    date.setUTCDate(day)
    systemTime.value = date
  },
})
const time = computed({
  get: () => systemTime.value.toISOString().slice(11, 16),
  set: debounce((value) => {
    const hours = parseInt(value.slice(0, 2))
    const minutes = parseInt(value.slice(3, 5))
    const date = new Date(systemTime.value.valueOf())
    date.setUTCHours(hours)
    date.setUTCMinutes(minutes)
    systemTime.value = date
  }, 500),
})
const filenamePreview = computed(
  () =>
    systemTime.value.toISOString() +
    ' ' +
    siteName.value +
    ' ' +
    deviceId.value,
)

store
  .dispatch(Actions.FETCH_SETTINGS)
  .then(() => {
    isLoading.value = false
    deviceId.value = store.state.deviceId
    siteName.value = store.state.siteName
    systemTime.value = store.state.systemTime
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
      systemTime: systemTime.value,
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
      <q-input
        v-model="siteName"
        outlined
        :disable="isLoading"
        label="Site name"
      />
      <q-input
        v-model="deviceId"
        outlined
        :disable="isLoading"
        label="Device ID"
      />
      <div class="row">
        <div class="q-mr-md">
          <q-input
            v-model="date"
            outlined
            type="date"
            label="Date"
            stack-label
          />
        </div>
        <div>
          <q-input
            v-model="time"
            outlined
            type="time"
            label="Time"
            stack-label
          />
        </div>
      </div>
      <h6 class="q-mb-md q-mt-lg">Filename preview</h6>
      <p>{{ filenamePreview }}</p>
      <q-btn label="Save" type="submit" color="primary" />
    </q-form>
  </div>
</template>
