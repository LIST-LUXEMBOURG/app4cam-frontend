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
import { createPinia, setActivePinia } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import { StorageResponse, StorageStatusResponse } from '../helpers/ApiTypings'
import { useStorageStore } from './storage'

vi.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

describe('storage store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('fetch storage details', () => {
    const settings: StorageResponse = {
      status: {
        isAvailable: true,
        message: 'a',
      },
      usage: {
        capacityKb: 1,
        usedPercentage: 2,
      },
    }
    const getSettingsSpy = vi
      .spyOn(ApiClientService, 'getStorage')
      .mockResolvedValue(settings)

    it('saves storage details after fetching', async () => {
      const store = useStorageStore()
      await store.fetchStorage()
      expect(store.status.isAvailable).toBe(settings.status.isAvailable)
      expect(store.status.message).toBe(settings.status.message)
      expect(store.usage.capacityKb).toBe(settings.usage.capacityKb)
      expect(store.usage.usedPercentage).toBe(settings.usage.usedPercentage)
    })

    afterEach(() => {
      getSettingsSpy.mockClear()
    })
  })

  describe('fetch storage status', () => {
    const status: StorageStatusResponse = {
      isAvailable: true,
      message: 'a',
    }
    const getSettingsSpy = vi
      .spyOn(ApiClientService, 'getStorageStatus')
      .mockResolvedValue(status)

    it('saves storage status after fetching', async () => {
      const store = useStorageStore()
      await store.fetchStorageStatus()
      expect(store.status.isAvailable).toBe(status.isAvailable)
      expect(store.status.message).toBe(status.message)
    })

    afterEach(() => {
      getSettingsSpy.mockClear()
    })
  })
})
