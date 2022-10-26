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
