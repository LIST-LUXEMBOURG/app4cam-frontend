import { createPinia, setActivePinia } from 'pinia'
import ApiClientService from '../helpers/ApiClientService'
import {
  BatteryVoltageResponse,
  DeviceIdResponse,
  VersionResponse,
} from '../helpers/ApiTypings'
import { usePropertiesStore } from './properties'

jest.mock('../config', () => ({ CONFIG: { API_SERVER_URL: '' } }))

describe('properties store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('fetchBatteryVoltage', () => {
    const mockedResponse: BatteryVoltageResponse = {
      batteryVoltage: 1,
    }
    const spy = jest
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
    const spy = jest
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
    const spy = jest
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
