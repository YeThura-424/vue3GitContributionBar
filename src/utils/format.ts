/**
 * Format a `YYYY-MM-DD` date key for display, e.g. `Mon, Sep 21, 2026`.
 */
export function formatDate(dateKey: string, locale = 'en'): string {
  const [year, month, day] = dateKey.split('-').map(Number)
  if (!year || !month || !day) return dateKey

  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

/**
 * Short `Jan`, `Feb`, ... label for a date key.
 */
export function formatMonth(dateKey: string, locale = 'en'): string {
  const [year, month, day] = dateKey.split('-').map(Number)
  if (!year || !month || !day) return dateKey

  return new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(year, month - 1, day))
}
