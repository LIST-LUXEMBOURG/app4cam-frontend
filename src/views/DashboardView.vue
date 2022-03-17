<script
  setup
  lang="ts"
>
import DiskUsage from '../components/DiskUsage.vue'
import Snapshot from '../components/Snapshot.vue'
import SiteNameDeviceIdHeading from '../components/SiteNameDeviceIdHeading.vue'
import { onErrorCaptured, Ref, ref } from 'vue'
import { useQuasar } from 'quasar'

const quasar = useQuasar()

const error: Ref<Error | null> = ref(null)

onErrorCaptured((e) => {
  error.value = e
  quasar.notify({
    message: 'Loading one or more components failed.',
    caption: e.message ? e.message : '',
    color: 'negative',
  })
})
</script>

<template>
  <div class="q-mx-auto wrapper text-left">
    <Suspense v-if="!error">
      <template #default>
        <div>
          <site-name-device-id-heading />
          <disk-usage />
          <snapshot />
        </div>
      </template>
      <template #fallback>
        <div>
          <span class="material-icons"> sync </span>
          Loading...
        </div>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
}

.material-icons {
  font-size: 36px;
  animation: rotation infinite 1s ease-in-out;
}

.wrapper {
  max-width: 400px;
}
</style>
