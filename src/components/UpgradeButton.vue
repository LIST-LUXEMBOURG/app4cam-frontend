<!--
Copyright (C) 2024  Luxembourg Institute of Science and Technology

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
import { DialogChainObject, QSpinnerBall, useQuasar } from 'quasar'
import UpgradeEndDialog from './UpgradeEndDialog.vue'
import ApiClientService from 'src/helpers/ApiClientService'

const quasar = useQuasar()

const DURATION_UPGRADE_START_NO_TIMEOUT_MS = 1000
const POLLING_FAILURE_THRESHOLD = 2160 // 3 hours
const POLLING_INTERVAL_MS = 5000

let pollingFailureCounter: number
let pollingInterval: NodeJS.Timeout
let upgradeInProgressDialog: DialogChainObject

async function checkUpgradeStatus() {
  try {
    const status = await ApiClientService.getUpgradeStatus()
    if (status.inProgress) {
      pollingFailureCounter++
    } else {
      upgradeInProgressDialog.hide()
      displayUpgradeCompletedDialog()
      stopUpgradeStatusPolling()
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Do nothing as backend could get restarted.
    pollingFailureCounter++
  }
  if (pollingFailureCounter > POLLING_FAILURE_THRESHOLD) {
    displayUpgradeFailedDialog()
    stopUpgradeStatusPolling()
  }
}

function displayUpgradeFileProblemDialog(message: string) {
  quasar.dialog({
    component: UpgradeEndDialog,
    componentProps: {
      title: 'Upgrade file problem',
      iconName: 'cancel',
      message,
    },
  })
}

function displayUpgradeCompletedDialog() {
  quasar.dialog({
    component: UpgradeEndDialog,
    componentProps: {
      title: 'Upgrade completed',
      iconName: 'check_circle',
      message: undefined,
    },
  })
}

function displayUpgradeFailedDialog() {
  quasar.dialog({
    component: UpgradeEndDialog,
    componentProps: {
      title: 'Upgrade failed',
      iconName: 'cancel',
      message:
        'Please restart your device in 3 hours and verify its functionality. If this does not help, please contact the customer service.',
    },
  })
}

function displayUpgradeInProgressDialog() {
  upgradeInProgressDialog = quasar.dialog({
    title: 'Upgrading...',
    progress: {
      spinner: QSpinnerBall,
      color: 'primary',
    },
    persistent: true,
    ok: false,
  })
}

function displayUpgradeNotStartedDialog() {
  quasar.dialog({
    component: UpgradeEndDialog,
    componentProps: {
      title: 'Upgrade not started',
      iconName: 'cancel',
      message:
        'The upgrade could not be started. Please try again. If this does not help, please contact the customer service with the app log files.',
    },
  })
}

async function onUpgradeButtonClick() {
  const fileCheckDialog = quasar.dialog({
    title: 'Checking upgrade file...',
    progress: {
      spinner: QSpinnerBall,
      color: 'primary',
    },
    persistent: true,
    ok: false,
  })
  let upgradeFileCheckResult
  try {
    upgradeFileCheckResult = await ApiClientService.getUpgradeFileCheckResult()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    displayUpgradeNotStartedDialog()
    return
  } finally {
    fileCheckDialog.hide()
  }
  if (upgradeFileCheckResult.isOkay) {
    quasar
      .dialog({
        title: 'Do you really want to upgrade?',
        persistent: true,
        ok: 'Yes',
        cancel: 'No',
      })
      .onOk(async () => {
        displayUpgradeInProgressDialog()
        setupUpgradeStatusPolling()
        let startingTimestampMs
        try {
          startingTimestampMs = Date.now()
          await ApiClientService.postPerformUpgrade()
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // Consider errors only the first second, discard otherwise as the polling kicks in.
          if (
            startingTimestampMs &&
            Date.now() - startingTimestampMs <
              DURATION_UPGRADE_START_NO_TIMEOUT_MS
          ) {
            stopUpgradeStatusPolling()
            upgradeInProgressDialog.hide()
            displayUpgradeNotStartedDialog()
          }
        }
      })
  } else {
    displayUpgradeFileProblemDialog(upgradeFileCheckResult.message)
  }
}

function setupUpgradeStatusPolling() {
  pollingInterval = setInterval(checkUpgradeStatus, POLLING_INTERVAL_MS)
}

function stopUpgradeStatusPolling() {
  clearInterval(pollingInterval)
}
</script>

<template>
  <q-btn
    color="primary"
    label="Upgrade"
    @click="onUpgradeButtonClick"
  />
</template>
