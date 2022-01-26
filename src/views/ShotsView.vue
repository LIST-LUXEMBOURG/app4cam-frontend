<script setup lang="ts">
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import { useStore } from '../store'
import { Actions } from '../store/action-types'

const quasar = useQuasar()
const store = useStore()

store.dispatch(Actions.FETCH_FILES).catch((error) => {
  quasar.notify({
    message: 'The files could not be loaded.',
    caption: error.message ? error.message : '',
    color: 'negative',
  })
})

const files = computed(() => store.state.files)
</script>

<template>
  <h5 class="q-my-md">Shots</h5>
  <div v-for="(file, index) in files" :key="index" class="q-px-md">
    <q-item v-ripple clickable :dark="false" data-testid="file">
      <q-item-section>
        <q-item-label>{{ file.name }}</q-item-label>
        <q-item-label caption>{{ file.creationTime }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>
