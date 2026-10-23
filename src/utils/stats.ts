import type { ContributionDay, ContributionStats } from '../types'

/**
 * Aggregate a day grid into the numbers shown under the graph.
 *
 * Future days are ignored so the current year is not skewed by empty columns.
 */
export function computeStats(days: readonly ContributionDay[]): ContributionStats {
  const pastDays = days.filter((day) => !day.isFuture)

  let total = 0
  let activeDays = 0
  let longestStreak = 0
  let currentStreak = 0
  let bestDay: ContributionDay | null = null

  for (const day of pastDays) {
    total += day.count

    if (day.count > 0) {
      activeDays += 1
      currentStreak += 1
      if (currentStreak > longestStreak) longestStreak = currentStreak
    } else {
      currentStreak = 0
    }

    if (!bestDay || day.count > bestDay.count) bestDay = day
  }

  return { total, activeDays, longestStreak, bestDay }
}
