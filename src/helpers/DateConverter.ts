import { differenceInMinutes } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

export default class DateConverter {
  static formatDateAsDashedYearMonthDayInTimeZone(
    date: Date,
    timeZone: string,
  ): string {
    return formatInTimeZone(date, timeZone, 'yyyy-MM-dd')
  }

  static formatDateAsHoursColonMinutesInTimeZone(
    date: Date,
    timeZone: string,
  ): string {
    return formatInTimeZone(date, timeZone, 'HH:mm')
  }

  static formatDateIsoLikeInTimeZone(date: Date, timeZone: string): string {
    return formatInTimeZone(date, timeZone, "yyyyMMdd'T'HHmmss")
  }

  static getAbsoluteDifferenceInMinutes(firstDate: Date, secondDate: Date) {
    return Math.abs(differenceInMinutes(firstDate, secondDate))
  }
}
