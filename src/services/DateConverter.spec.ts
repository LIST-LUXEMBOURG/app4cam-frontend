import DateConverter from './DateConverter'

describe('convertDateToIso8601Date', () => {
  it('returns a valid date', async () => {
    const date = new Date('2022-12-11T14:48:37+01:00')
    expect(DateConverter.convertDateToIso8601Date(date)).toBe('2022-12-11')
  })

  it('appends zeros to month and day', async () => {
    const date = new Date('2022-02-01T14:48:37+01:00')
    expect(DateConverter.convertDateToIso8601Date(date)).toBe('2022-02-01')
  })
})
