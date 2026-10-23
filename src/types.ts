/**
 * A single day of the contribution grid.
 *
 * Days are always aligned to a week grid: `week` is the column index and
 * `weekday` is the row index (0 = Sunday).
 */
export interface ContributionDay {
  /** Local date key in `YYYY-MM-DD` format. */
  date: string
  /** Number of contributions recorded for the day. */
  count: number
  /** Zero based column index inside the rendered year. */
  week: number
  /** Zero based row index, `0` is Sunday. */
  weekday: number
  /** The day is in the future (or outside of the selected year). */
  isFuture: boolean
  /** The day belongs to an adjacent year shown to pad the grid. */
  isOutsideYear: boolean
}

/** Raw `{ date, count }` pair, as returned by contribution APIs. */
export interface ContributionEntry {
  date: string
  count: number
}

/** Built-in color palettes. */
export type PaletteName = 'forest' | 'daylight' | 'midnight'

/** Light or dark chrome for the surrounding UI. */
export type ThemeName = 'dark' | 'light'

/** Aggregated numbers rendered by `<ContributionStats />`. */
export interface ContributionStats {
  total: number
  activeDays: number
  longestStreak: number
  bestDay: ContributionDay | null
}

/** Payload of the community GitHub contributions API. */
export interface GitHubContributionsPayload {
  contributions: ContributionEntry[]
  total: Record<string, number>
}

/** Information about the bar currently under the pointer. */
export interface ContributionHover {
  day: ContributionDay
  level: number
  /** Horizontal position inside the graph container, in pixels. */
  x: number
  /** Vertical position inside the graph container, in pixels. */
  y: number
}
