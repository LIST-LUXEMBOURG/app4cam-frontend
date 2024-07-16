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
import {
  BatteryVoltageResponse,
  DeviceIdResponse,
  VersionResponse,
} from '../helpers/ApiTypings'
import { usePropertiesStore } from './properties'

vi.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

describe('properties store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('fetchBatteryVoltage', () => {
    const mockedResponse: BatteryVoltageResponse = {
      batteryVoltage: 1,
    }
    const spy = vi
      .spyOn(ApiClientService, 'getBatteryVoltage')
      .mockResolvedValue(mockedResponse)

    it('saves battery voltage after fetching', async () => {
      const store = usePropertiesStore()
      await store.fetchBatteryVoltage()
      expect(store.batteryVoltage).toBe(mockedResponse.batteryVoltage)
    })

    afterEach(() => {
      spy.mockClear()
    })
  })

  describe('fetchDeviceId', () => {
    const mockedResponse: DeviceIdResponse = {
      deviceId: 'a',
    }
    const spy = vi
      .spyOn(ApiClientService, 'getDeviceId')
      .mockResolvedValue(mockedResponse)

    it('saves device ID after fetching', async () => {
      const store = usePropertiesStore()
      await store.fetchDeviceId()
      expect(store.deviceId).toBe(mockedResponse.deviceId)
    })

    afterEach(() => {
      spy.mockClear()
    })
  })

  describe('fetch version', () => {
    const mockedResponse: VersionResponse = {
      commitHash: 'a',
      version: 'b',
    }
    const spy = vi
      .spyOn(ApiClientService, 'getVersion')
      .mockResolvedValue(mockedResponse)

    it('saves version after fetching', async () => {
      const store = usePropertiesStore()
      await store.fetchVersion()
      expect(store.commitHash).toBe(mockedResponse.commitHash)
      expect(store.version).toBe(mockedResponse.version)
    })

    afterEach(() => {
      spy.mockClear()
    })
  })
})
