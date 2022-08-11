import DateConverter from './DateConverter'

describe(DateConverter.formatDateAsDashedYearMonthDayInTimeZone.name, () => {
  it('returns a valid date', () => {
    const date = new Date('2022-12-11T14:48:37.000Z')
    expect(
      DateConverter.formatDateAsDashedYearMonthDayInTimeZone(date, 'UTC'),
    ).toBe('2022-12-11')
  })

  it('appends zeros to month and day', () => {
    const date = new Date('2022-02-01T14:48:37.000Z')
    expect(
      DateConverter.formatDateAsDashedYearMonthDayInTimeZone(date, 'UTC'),
    ).toBe('2022-02-01')
  })
})

describe(DateConverter.formatDateAsHoursColonMinutesInTimeZone.name, () => {
  it('returns a valid time', () => {
    const date = new Date('2022-12-11T14:48:37.000Z')
    expect(
      DateConverter.formatDateAsHoursColonMinutesInTimeZone(date, 'UTC'),
    ).toBe('14:48')
  })

  it('appends zeros to hours and minutes', () => {
    const date = new Date('2022-02-01T04:08:37.000Z')
    expect(
      DateConverter.formatDateAsHoursColonMinutesInTimeZone(date, 'UTC'),
    ).toBe('04:08')
  })
})

describe(DateConverter.formatDateIsoLikeInTimeZone.name, () => {
  it('returns a valid string', () => {
    const date = new Date('2022-12-11T14:48:37+01:00')
    expect(DateConverter.formatDateIsoLikeInTimeZone(date, 'UTC')).toBe(
      '20221211T134837',
    )
  })
})
