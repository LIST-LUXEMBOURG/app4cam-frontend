<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import TimeOutOfSyncDialogDetails from './TimeOutOfSyncDialogDetails.vue'

const { dialogRef, onDialogHide } = useDialogPluginComponent()

defineEmits([...useDialogPluginComponent.emits])
</script>

<template>
  <q-dialog
    ref="dialogRef"
    persistent
    @hide="onDialogHide"
  >
    <TimeOutOfSyncDialogDetails />
  </q-dialog>
</template>
