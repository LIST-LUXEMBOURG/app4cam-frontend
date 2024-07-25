/**
 * Copyright (C) 2022-2024  Luxembourg Institute of Science and Technology
 *
 * App4Cam is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * App4Cam is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with App4Cam.  If not, see <https://www.gnu.org/licenses/>.
 */
import { AxiosError } from 'axios'
import { QVueGlobals } from 'quasar'

export default class NotificationCreator {
  static extractErrorMessage(error: AxiosError | Error): string {
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.data &&
      error.response.data.message
    ) {
      return error.response.data.message
    }
    return error.message
  }

  static showErrorNotification(
    quasar: QVueGlobals,
    error: unknown,
    message: string,
  ) {
    let caption = undefined
    if (error instanceof AxiosError || error instanceof Error) {
      caption = this.extractErrorMessage(error)
    }
    quasar.notify({
      message,
      caption,
      color: 'negative',
    })
  }
}
