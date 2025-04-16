import { formatDate, isValid, parse } from 'date-fns'

/**
 * Parses a date string of the format "dd/MM/yyyy" into a Date object.
 */
export const parseDate = (date: string) => {
  return parse(date, 'dd/MM/yyyy', new Date())
}

/**
 * Compares two dates of the formate "dd/MM/yyyy" and returns the difference in milliseconds.
 */
export const compareDate = (date1: string, date2: string) => {
  return parseDate(date1).getTime() - parseDate(date2).getTime()
}

/**
 * Formats a date string of the format "dd/MM/yyyy" into "yyyy-MM-dd"
 * @throws {Error} If the input date string is invalid and cannot be parsed
 */
export const formatDateInISO = (date: string) => {
  // Check if the date is already in ISO format
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}/
  if (isoDateRegex.test(date)) {
    return date.split('T')[0] // Return just the date part if it's already ISO
  }
  return formatDate(parse(date, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd')
}

/**
 * Validates a date string of the format "dd/MM/yyyy"
 */
export const validateDate = (date: string) => {
  return isValid(parse(date, 'dd/MM/yyyy', new Date()))
}
