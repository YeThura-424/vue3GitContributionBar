import { DAYS_PER_WEEK } from '../constants'
import type { ContributionDay } from '../types'
import { getWeeksForYear, startOfDay, startOfWeek, toLocalDateKey } from './normalize'

/** Small deterministic PRNG so sample data is stable between renders. */
export function mulberry32(seed: number): () => number {
  let value = seed
  return function random() {
    value += 0x6d2b79f5
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
}

function generateContributionCount(
  random: () => number,
  week: number,
  weekday: number,
  totalWeeks: number,
): number {
  const weekdayBoost = weekday > 0 && weekday < 6 ? 1.1 : 0.55
  const recentBoost = 0.55 + (week / Math.max(1, totalWeeks - 1)) * 0.9
  const activityChance = 0.48 * weekdayBoost * recentBoost

  if (random() > Math.min(activityChance, 0.88)) return 0

  const burst = random() > 0.84 ? 2.4 : 1
  return Math.max(1, Math.round((1 + random() * 12) * recentBoost * burst))
}

/**
 * Build a deterministic sample year.
 *
 * Useful for demos, docs and offline development: the same seed always
 * produces the same grid, and future days stay empty.
 */
export function buildSampleContributions(
  year: number = new Date().getFullYear(),
  seed = 20_260_921,
): ContributionDay[] {
  const today = startOfDay(new Date())
  const firstDay = startOfWeek(new Date(year, 0, 1))
  const random = mulberry32(seed + year)
  const totalWeeks = getWeeksForYear(year)
  const days: ContributionDay[] = []

  for (let week = 0; week < totalWeeks; week += 1) {
    for (let weekday = 0; weekday < DAYS_PER_WEEK; weekday += 1) {
      const date = new Date(firstDay)
      date.setDate(firstDay.getDate() + week * DAYS_PER_WEEK + weekday)

      const isOutsideYear = date.getFullYear() !== year
      const isFuture = isOutsideYear || date > today
      const count = isFuture ? 0 : generateContributionCount(random, week, weekday, totalWeeks)

      days.push({
        date: toLocalDateKey(date),
        count,
        week,
        weekday,
        isFuture,
        isOutsideYear,
      })
    }
  }

  return days
}
