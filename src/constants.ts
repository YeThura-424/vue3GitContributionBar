/** Number of week columns rendered for a full year. */
export const WEEKS_PER_YEAR = 53

/** Rows per week column (Sunday first, like GitHub). */
export const DAYS_PER_WEEK = 7

/** Edge length of a single bar, in world units. */
export const CELL_SIZE = 1

/** Empty space between two bars, in world units. */
export const CELL_GAP = 0.5

/** Distance between the origins of two neighbouring bars. */
export const CELL_STEP = CELL_SIZE + CELL_GAP

/** Height of a bar with zero contributions. */
export const ZERO_HEIGHT = 0.2

/** Smallest height of a bar with at least one contribution. */
export const MIN_BAR_HEIGHT = 0.24

/** Tallest bar rendered for the most active day. */
export const MAX_VISIBLE_HEIGHT = 10.5

/** Default grow animation length, in milliseconds. */
export const DEFAULT_GROW_DURATION = 2400

/** Delay before the next iteration when looping, in milliseconds. */
export const LOOP_DELAY = 700

/** Number of intensity levels (GitHub shows 5 shades). */
export const LEVEL_COUNT = 5
