import {
  LEVEL_COUNT,
  MAX_VISIBLE_HEIGHT,
  MIN_BAR_HEIGHT,
  ZERO_HEIGHT,
} from '../constants'

/**
 * Map a contribution count to its intensity level (0-4) relative to the year's maximum.
 *
 * Level 0 is an empty day, level 4 is a very active day.
 */
export function getContributionLevel(count: number, maxCount: number): number {
  if (!Number.isFinite(count) || count <= 0) return 0
  const safeMax = Math.max(1, Number.isFinite(maxCount) ? maxCount : 1)
  return Math.min(LEVEL_COUNT - 1, Math.ceil((count / safeMax) * (LEVEL_COUNT - 1)))
}

/**
 * Height of a bar for the given count, using a logarithmic scale so that a
 * handful of contributions is still visible next to a very busy day.
 */
export function getBarHeight(count: number, maxCount: number): number {
  if (!Number.isFinite(count) || count <= 0) return ZERO_HEIGHT
  const safeMax = Math.max(1, Number.isFinite(maxCount) ? maxCount : 1)
  const normalized = Math.log1p(count) / Math.log1p(safeMax)
  return MIN_BAR_HEIGHT + normalized * (MAX_VISIBLE_HEIGHT - MIN_BAR_HEIGHT)
}

/**
 * Largest count inside a day list, at least 1 so divisions stay safe.
 */
export function getMaxContributionCount(days: readonly { count: number }[]): number {
  let max = 1
  for (const day of days) {
    if (Number.isFinite(day.count) && day.count > max) max = day.count
  }
  return max
}
