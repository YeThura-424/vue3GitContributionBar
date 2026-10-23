import { describe, expect, test } from 'vitest'

import type { ContributionDay } from '../src/types'
import { computeStats } from '../src/utils/stats'

function day(date: string, count: number, isFuture = false): ContributionDay {
  return {
    date,
    count,
    week: 0,
    weekday: 0,
    isFuture,
    isOutsideYear: false,
  }
}

describe('computeStats', () => {
  test('sums totals and counts the active days', () => {
    const stats = computeStats([
      day('2026-01-01', 2),
      day('2026-01-02', 0),
      day('2026-01-03', 5),
      day('2026-01-04', 1),
    ])

    expect(stats.total).toBe(8)
    expect(stats.activeDays).toBe(3)
  })

  test('reports the longest run of consecutive active days', () => {
    const stats = computeStats([
      day('2026-01-01', 1),
      day('2026-01-02', 1),
      day('2026-01-03', 1),
      day('2026-01-04', 0),
      day('2026-01-05', 1),
      day('2026-01-06', 1),
      day('2026-01-07', 0),
      day('2026-01-08', 1),
    ])

    expect(stats.longestStreak).toBe(3)
  })

  test('a day without activity resets the streak', () => {
    const stats = computeStats([day('2026-01-01', 0), day('2026-01-02', 4)])
    expect(stats.longestStreak).toBe(1)
    expect(stats.total).toBe(4)
  })

  test('picks the best day', () => {
    const stats = computeStats([day('2026-01-01', 4), day('2026-01-02', 9), day('2026-01-03', 1)])

    expect(stats.bestDay?.count).toBe(9)
    expect(stats.bestDay?.date).toBe('2026-01-02')
  })

  test('ignores future days so the current year is not skewed', () => {
    const stats = computeStats([day('2026-01-01', 5), day('2026-12-31', 100, true)])

    expect(stats.total).toBe(5)
    expect(stats.bestDay?.date).toBe('2026-01-01')
  })

  test('handles an empty grid', () => {
    const stats = computeStats([])
    expect(stats).toEqual({ total: 0, activeDays: 0, longestStreak: 0, bestDay: null })
  })
})
