import { describe, expect, test } from 'vitest'

import { MAX_VISIBLE_HEIGHT, MIN_BAR_HEIGHT, ZERO_HEIGHT } from '../src/constants'
import { getBarHeight, getContributionLevel, getMaxContributionCount } from '../src/utils/levels'

describe('getContributionLevel', () => {
  test('scales intensity levels to the year\'s maximum', () => {
    expect(getContributionLevel(0, 6)).toBe(0)
    expect(getContributionLevel(-4, 6)).toBe(0)
    expect(getContributionLevel(NaN, 6)).toBe(0)
    expect(getContributionLevel(1, 6)).toBe(1)
    expect(getContributionLevel(3, 6)).toBe(2)
    expect(getContributionLevel(5, 6)).toBe(4)
    expect(getContributionLevel(6, 6)).toBe(4)
    expect(getContributionLevel(16, 63)).toBe(2)
    expect(getContributionLevel(32, 63)).toBe(3)
    expect(getContributionLevel(48, 63)).toBe(4)
    expect(getContributionLevel(63, 63)).toBe(4)
  })

  test('uses the fifth level for the maximum regardless of its value', () => {
    expect(getContributionLevel(6, 6)).toBe(4)
    expect(getContributionLevel(63, 63)).toBe(4)
  })
})

describe('getBarHeight', () => {
  test('an empty day is the flat placeholder height', () => {
    expect(getBarHeight(0, 42)).toBe(ZERO_HEIGHT)
    expect(getBarHeight(-1, 42)).toBe(ZERO_HEIGHT)
  })

  test('the busiest day reaches the maximum height', () => {
    expect(getBarHeight(42, 42)).toBeCloseTo(MAX_VISIBLE_HEIGHT, 10)
  })

  test('heights grow logarithmically and stay ordered', () => {
    const counts = [1, 2, 5, 10, 25, 100]
    const heights = counts.map((count) => getBarHeight(count, 100))

    for (let index = 1; index < heights.length; index += 1) {
      expect(heights[index]).toBeGreaterThan(heights[index - 1])
    }

    // A single contribution must still be visible above the flat state.
    expect(heights[0]).toBeGreaterThan(MIN_BAR_HEIGHT)
    expect(Math.min(...heights)).toBeLessThan(MAX_VISIBLE_HEIGHT)
  })

  test('never divides by zero when the data is empty', () => {
    expect(Number.isFinite(getBarHeight(3, 0))).toBe(true)
    expect(getBarHeight(3, 0)).toBe(getBarHeight(3, 1))
  })
})

describe('getMaxContributionCount', () => {
  test('finds the largest count and never drops below one', () => {
    expect(getMaxContributionCount([{ count: 2 }, { count: 17 }, { count: 5 }])).toBe(17)
    expect(getMaxContributionCount([])).toBe(1)
    expect(getMaxContributionCount([{ count: -8 }])).toBe(1)
  })
})
