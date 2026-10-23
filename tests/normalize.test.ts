import { describe, expect, test } from 'vitest'

import {
  getWeeksForYear,
  normalizeContributionData,
  startOfWeek,
  toLocalDateKey,
} from '../src/utils/normalize'

describe('normalizeContributionData', () => {
  test.each([2024, 2026, 2028])('a %i grid contains January 1 and December 31', (year) => {
    const data = normalizeContributionData(
      [
        { date: `${year}-01-01`, count: 3 },
        { date: `${year}-12-31`, count: 7 },
      ],
      year,
    )

    expect(data.find((day) => day.date === `${year}-01-01`)?.count).toBe(3)
    expect(data.find((day) => day.date === `${year}-12-31`)?.count).toBe(7)
  })

  test('the grid is a rectangle of seven rows', () => {
    const data = normalizeContributionData([], 2026)
    expect(data).toHaveLength(getWeeksForYear(2026) * 7)
    expect(new Set(data.map((day) => day.weekday))).toEqual(new Set([0, 1, 2, 3, 4, 5, 6]))
  })

  test('starts on the Sunday of the first week', () => {
    const data = normalizeContributionData([], 2026)
    expect(toLocalDateKey(startOfWeek(new Date(2026, 0, 1)))).toBe(data[0].date)
  })

  test('pads with days from the neighbouring years', () => {
    const data = normalizeContributionData([], 2026)
    const outside = data.filter((day) => day.isOutsideYear)

    expect(outside.length).toBeGreaterThan(0)
    expect(outside.every((day) => day.date.startsWith('2025') || day.date.startsWith('2027'))).toBe(
      true,
    )
    // Days outside the selected year never carry counts.
    expect(outside.every((day) => day.count === 0)).toBe(true)
  })

  test('flags days that have not happened yet', () => {
    const data = normalizeContributionData([], 2099)
    expect(data.every((day) => day.isFuture)).toBe(true)

    const past = normalizeContributionData([], 2020)
    expect(past.some((day) => day.isFuture)).toBe(true) // the 2021 padding
    expect(past.filter((day) => !day.isFuture).some((day) => day.date.startsWith('2020'))).toBe(
      true,
    )
  })

  test('missing days default to zero while known days keep their count', () => {
    const data = normalizeContributionData([{ date: '2026-03-04', count: 12 }], 2026)
    expect(data.find((day) => day.date === '2026-03-04')?.count).toBe(12)
    expect(data.filter((day) => day.count === 0).length).toBe(data.length - 1)
  })

  test('tolerates an empty or malformed payload', () => {
    expect(normalizeContributionData(null, 2026).length).toBeGreaterThan(0)
    expect(
      normalizeContributionData([{ date: 'not-a-date', count: 5 } as never], 2026).every(
        (day) => day.count === 0,
      ),
    ).toBe(true)
  })
})

describe('getWeeksForYear', () => {
  test('the column count always covers the whole year', () => {
    for (const year of [2000, 2020, 2021, 2024, 2026, 2031]) {
      const weeks = getWeeksForYear(year)

      expect(weeks).toBeGreaterThanOrEqual(53)
      expect(weeks).toBeLessThanOrEqual(54)

      const data = normalizeContributionData([], year)
      expect(data).toHaveLength(weeks * 7)
      expect(data.some((day) => day.date === `${year}-12-31`)).toBe(true)
    }
  })
})
