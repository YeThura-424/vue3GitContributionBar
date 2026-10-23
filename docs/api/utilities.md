# Utilities & constants

Everything below is a pure function or a frozen value. No Three.js, no Vue, no globals — safe to use
in tests, in a worker, or to drive a 2D fallback that matches the 3D scene exactly.

## Data helpers

### `normalizeContributionData(entries, year)`

Expands sparse `{ date, count }` pairs into a complete rectangular week grid.

```ts
import { normalizeContributionData } from 'vue-contribution-graph-3d'

const days = normalizeContributionData([{ date: '2025-09-21', count: 4 }], 2025)
```

- Columns run Sunday-first from the Sunday on or before January 1.
- Padding days from the neighbouring years are included with `count: 0` and `isOutsideYear: true`.
- Days that have not happened yet are flagged `isFuture: true` and never carry a count.
- Missing and malformed entries are ignored rather than throwing.

### `getWeeksForYear(year)`

Number of week columns a year needs (53 or 54).

### `startOfDay(date)` · `startOfWeek(date)` · `toLocalDateKey(date)`

Local-time helpers used by the normalizer. `toLocalDateKey` produces `YYYY-MM-DD` **in local time**,
which is what GitHub's payload uses.

## Level and height helpers

### `getContributionLevel(count)`

Returns `0`–`4` using the GitHub buckets: `0`, `1–3`, `4–7`, `8–13`, `14+`.

### `getBarHeight(count, maxCount)`

```ts
count === 0 ? 0.1 : 0.24 + (Math.log1p(count) / Math.log1p(maxCount)) * (10.5 - 0.24)
```

The busiest day always lands exactly on `MAX_VISIBLE_HEIGHT` and an empty day on `ZERO_HEIGHT`.
`maxCount <= 0` is treated as `1` so the division is always safe.

### `getMaxContributionCount(days)`

Largest count in a list, never below `1`.

## Statistics

### `computeStats(days)`

`{ total, activeDays, longestStreak, bestDay }`. Ignores `isFuture` days, so a partial year reports
honest numbers. See [`useContributionStats`](./composables).

## Sample data

### `buildSampleContributions(year, seed?)`

The pure version of [`useSampleContributions`](./composables). Default seed is `20260921`.

### `mulberry32(seed)`

Small, fast, deterministic PRNG. Useful in your own fixtures.

## Formatting

### `formatDate(dateKey, locale = 'en')`

`Mon, Sep 21, 2026` via `Intl.DateTimeFormat`.

### `formatMonth(dateKey, locale = 'en')`

`Sep` — the same label the axis sprites draw.

## Themes

```ts
import {
  THEME_PALETTES, // Record<PaletteName, readonly string[]> — 5 levels each
  THEME_SCENE_COLORS, // Record<PaletteName, string>
  PALETTE_THEME, // Record<PaletteName, ThemeName>
  PALETTE_LABELS, // Record<PaletteName, string>
  PALETTE_NAMES, // ['forest', 'daylight', 'midnight']
  resolveTheme, // (palette, theme?) => 'dark' | 'light'
  getPaletteColors, // safe lookup, falls back to forest
  getSceneColor, // safe lookup, falls back to forest
} from 'vue-contribution-graph-3d'
```

## Constants

| Constant                | Value        | Meaning                           |
| ----------------------- | ------------ | --------------------------------- |
| `WEEKS_PER_YEAR`        | `53`         | Maximum week columns.             |
| `DAYS_PER_WEEK`         | `7`          | Rows per column.                  |
| `CELL_SIZE`              | `0.9`        | Bar edge length in world units.  |
| `CELL_GAP`               | `0.3`        | Space between bars.              |
| `CELL_STEP`              | `1.2`        | `CELL_SIZE + CELL_GAP`.          |
| `ZERO_HEIGHT`           | `0.1`        | Height of an empty day.           |
| `MIN_BAR_HEIGHT`        | `0.24`       | Height of the first contribution. |
| `MAX_VISIBLE_HEIGHT`    | `10.5`       | Height of the busiest day.        |
| `DEFAULT_GROW_DURATION` | `2400`       | Animation length in ms.           |
| `LOOP_DELAY`            | `700`        | Pause between loops in ms.        |
| `LEVEL_COUNT`           | `5`          | Number of intensity levels.       |
| `LEVEL_THRESHOLDS`      | `[3, 7, 13]` | Upper bounds of levels 1–3.       |

## Three.js classes

Advanced use only — these are exported for people who want to host the scene themselves.

```ts
import { ContributionScene, GrowthAnimator, easeOutCubic } from 'vue-contribution-graph-3d'
```

### `new ContributionScene(container, options?)`

| Method                                      | Purpose                                       |
| ------------------------------------------- | --------------------------------------------- |
| `setData(days)`                             | Replace the rendered year.                    |
| `setPalette(name)` / `setTheme(theme)`      | Retint bars, scene, lights and labels.        |
| `setAnimation({ animate, loop, duration })` | Update the grow animation.                    |
| `setAxisLabels(visible)`                    | Toggle the month/weekday sprites.             |
| `setGridFrame(visible)`                     | Toggle the outline.                           |
| `setPaused(paused)`                         | Freeze interaction and looping while loading. |
| `setHoverListener(fn)`                      | Receive `{ day, level, x, y }` or `null`.     |
| `replay()` · `resetView()`                  | Animation and camera.                         |
| `dispose()`                                 | Release every GPU resource and listener.      |

### `GrowthAnimator`

The time-based grow animation, deliberately free of Three.js so it can be unit tested:

```ts
const animator = new GrowthAnimator({ duration: 2400, loop: true })
animator.replay(blocks) // blocks: { targetHeight, scale, position }[]
animator.tick(performance.now(), blocks)
```

`easeOutCubic(progress)` is the easing it uses, exported so a matching 2D chart can share it.
