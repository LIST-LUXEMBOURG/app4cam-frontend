<script setup lang="ts">
// © 2022 Luxembourg Institute of Science and Technology
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
