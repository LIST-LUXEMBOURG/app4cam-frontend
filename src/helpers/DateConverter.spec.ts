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

describe(DateConverter.getAbsoluteDifferenceInMinutes.name, () => {
  it('returns 1 for a difference of 1 min', () => {
    expect(
      DateConverter.getAbsoluteDifferenceInMinutes(
        new Date('2022-12-11T14:48:00+01:00'),
        new Date('2022-12-11T14:49:00+01:00'),
      ),
    ).toBe(1)
  })

  it('returns 0 for a difference of 40 s', () => {
    expect(
      DateConverter.getAbsoluteDifferenceInMinutes(
        new Date('2022-12-11T14:48:20+01:00'),
        new Date('2022-12-11T14:49:00+01:00'),
      ),
    ).toBe(0)
  })

  it('returns 1 for a difference of 1 min and 59 s', () => {
    expect(
      DateConverter.getAbsoluteDifferenceInMinutes(
        new Date('2022-12-11T14:48:00+01:00'),
        new Date('2022-12-11T14:49:59+01:00'),
      ),
    ).toBe(1)
  })

  it('returns 2 for a difference of 2 mins and 1 s', () => {
    expect(
      DateConverter.getAbsoluteDifferenceInMinutes(
        new Date('2022-12-11T14:48:00+01:00'),
        new Date('2022-12-11T14:50:01+01:00'),
      ),
    ).toBe(2)
  })
})
