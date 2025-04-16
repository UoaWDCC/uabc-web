// utils.test.ts
import { describe, it, expect } from 'vitest'
import { formatDateInISO } from './utils'

describe('formatDateInISO', () => {
  // Test standard dd/MM/yyyy format conversion
  it('should convert dd/MM/yyyy format to yyyy-MM-dd', () => {
    expect(formatDateInISO('25/12/2023')).toBe('2023-12-25')
    expect(formatDateInISO('01/01/2024')).toBe('2024-01-01')
    expect(formatDateInISO('31/03/2024')).toBe('2024-03-31')
  })

  // Test handling of dates that are already in ISO format
  it('should handle dates already in ISO format', () => {
    expect(formatDateInISO('2023-12-25')).toBe('2023-12-25')
    expect(formatDateInISO('2024-01-01')).toBe('2024-01-01')
    expect(formatDateInISO('2024-03-31T12:00:00')).toBe('2024-03-31')
  })

  // Test edge cases
  it('should handle edge cases correctly', () => {
    // First day of the year
    expect(formatDateInISO('01/01/2023')).toBe('2023-01-01')
    // Last day of the year
    expect(formatDateInISO('31/12/2023')).toBe('2023-12-31')
    // Leap year date
    expect(formatDateInISO('29/02/2024')).toBe('2024-02-29')
  })

  // Test leading zeros
  it('should handle dates with leading zeros', () => {
    expect(formatDateInISO('01/01/2023')).toBe('2023-01-01')
    expect(formatDateInISO('01/02/2023')).toBe('2023-02-01')
    expect(formatDateInISO('10/02/2023')).toBe('2023-02-10')
  })

  // Test error handling
  it('should throw error for invalid date formats', () => {
    expect(() => formatDateInISO('2023/12/25')).toThrow()
    expect(() => formatDateInISO('25-12-2023')).toThrow()
    expect(() => formatDateInISO('invalid')).toThrow()
    expect(() => formatDateInISO('')).toThrow()
  })

  // Test with ISO dates including time
  it('should handle ISO dates with time component', () => {
    expect(formatDateInISO('2023-12-25T12:00:00')).toBe('2023-12-25')
    expect(formatDateInISO('2023-12-25T00:00:00Z')).toBe('2023-12-25')
    expect(formatDateInISO('2023-12-25T23:59:59.999Z')).toBe('2023-12-25')
  })
})
