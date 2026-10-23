import { DAYS_PER_WEEK } from '../constants'
import type { ContributionDay, ContributionEntry } from '../types'

/** Midnight of the given date. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/** Sunday that starts the week containing the given date. */
export function startOfWeek(date: Date): Date {
  const result = startOfDay(date)
  result.setDate(result.getDate() - result.getDay())
  return result
}

/** Local `YYYY-MM-DD` key for a date. */
export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Number of week columns a year needs, including leading padding. */
export function getWeeksForYear(year: number): number {
  const daysInYear = (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / 86_400_000
  return Math.ceil((new Date(year, 0, 1).getDay() + daysInYear) / DAYS_PER_WEEK)
}

/**
 * Expand sparse `{ date, count }` entries into a complete week grid for a year.
 *
 * Days that belong to the previous or next year are kept so the grid stays
 * rectangular, and days in the future are flagged instead of dropped.
 */
export function normalizeContributionData(
  entries: readonly ContributionEntry[] | null | undefined,
  year: number,
): ContributionDay[] {
  const byDate = new Map<string, number>()
  for (const entry of entries ?? []) {
    if (!entry || typeof entry.date !== 'string') continue
    byDate.set(entry.date, Number(entry.count) || 0)
  }

  const today = startOfDay(new Date())
  const firstDay = startOfWeek(new Date(year, 0, 1))
  const days: ContributionDay[] = []

  for (let week = 0; week < getWeeksForYear(year); week += 1) {
    for (let weekday = 0; weekday < DAYS_PER_WEEK; weekday += 1) {
      const date = new Date(firstDay)
      date.setDate(firstDay.getDate() + week * DAYS_PER_WEEK + weekday)
      const dateKey = toLocalDateKey(date)
      const isOutsideYear = date.getFullYear() !== year

      days.push({
        date: dateKey,
        count: byDate.get(dateKey) ?? 0,
        week,
        weekday,
        isFuture: isOutsideYear || date > today,
        isOutsideYear,
      })
    }
  }

  return days
}
