import { convertTo12HourFormat } from '@/lib/utils/dates'

describe('convertTo12HourFormat', () => {
  // Test cases for HH:mm:ss format
  it('should convert 24-hour time with seconds to 12-hour format', () => {
    expect(convertTo12HourFormat('13:30:00')).toBe('1:30PM')
    expect(convertTo12HourFormat('00:30:00')).toBe('12:30AM')
    expect(convertTo12HourFormat('12:00:00')).toBe('12:00PM')
    expect(convertTo12HourFormat('23:59:59')).toBe('11:59PM')
  })

  // Test cases for HH:mm format
  it('should convert 24-hour time without seconds to 12-hour format', () => {
    expect(convertTo12HourFormat('13:30')).toBe('1:30PM')
    expect(convertTo12HourFormat('00:30')).toBe('12:30AM')
    expect(convertTo12HourFormat('12:00')).toBe('12:00PM')
    expect(convertTo12HourFormat('23:59')).toBe('11:59PM')
  })

  // Test cases for HHMM format
  it('should convert military time format to 12-hour format', () => {
    expect(convertTo12HourFormat('1330')).toBe('1:30PM')
    expect(convertTo12HourFormat('0030')).toBe('12:30AM')
    expect(convertTo12HourFormat('1200')).toBe('12:00PM')
    expect(convertTo12HourFormat('2359')).toBe('11:59PM')
  })

  // Test error handling
  it('should return original string for invalid time formats', () => {
    expect(convertTo12HourFormat('25:00:00')).toBe('25:00:00')
    expect(convertTo12HourFormat('13:60:00')).toBe('13:60:00')
    expect(convertTo12HourFormat('invalid')).toBe('invalid')
    expect(convertTo12HourFormat('')).toBe('')
  })

  // Edge cases
  it('should handle edge cases correctly', () => {
    expect(convertTo12HourFormat('00:00:00')).toBe('12:00AM')
    expect(convertTo12HourFormat('12:00:00')).toBe('12:00PM')
    expect(convertTo12HourFormat('00:00')).toBe('12:00AM')
    expect(convertTo12HourFormat('12:00')).toBe('12:00PM')
    expect(convertTo12HourFormat('0000')).toBe('12:00AM')
    expect(convertTo12HourFormat('1200')).toBe('12:00PM')
  })
})
