# Working with data

## The day grid

Every component consumes the same flat array of days:

```ts
interface ContributionDay {
  date: string // "2025-09-21"
  count: number // contributions that day
  week: number // column index, 0 = first week of the year
  weekday: number // row index, 0 = Sunday
  isFuture: boolean // has not happened yet
  isOutsideYear: boolean // padding from a neighbouring year
}
```

Days are laid out Sunday-first in a rectangular grid. Padding days from December of the previous year
and January of the next one are kept so the grid stays `weeks × 7` — they always carry `count: 0`.

You rarely build this by hand:

```ts
import { normalizeContributionData } from 'vue-contribution-graph-3d'

const days = normalizeContributionData(
  [
    { date: '2025-09-21', count: 4 },
    { date: '2025-09-22', count: 9 },
  ],
  2025,
)
```

## From the GitHub API

`useGitHubContributions` wraps the community
[github-contributions-api](https://github-contributions-api.jogruber.de/) endpoint, which needs no
token and returns the whole history in one request.

```ts
import { useGitHubContributions } from 'vue-contribution-graph-3d'

const {
  username, // Ref<string>
  year, // Ref<string>
  years, // Ref<string[]>  newest first
  days, // Ref<ContributionDay[]>
  status, // Ref<'idle' | 'loading' | 'success' | 'error'>
  error, // Ref<string | null>
  loading, // Ref<boolean>
  load, // (handle?: string) => Promise<void>
  setYear, // (year: string | number) => void
  reload, // () => void
} = useGitHubContributions({ username: () => 'torvalds' })
```

### Options

| Option     | Type               | Default | Description                                        |
| ---------- | ------------------ | ------- | -------------------------------------------------- |
| `username` | `MaybeRefOrGetter` | `''`    | Reactive handle; `@` is stripped automatically.    |
| `year`     | `MaybeRefOrGetter` | current | Reactive year to display.                          |
| `autoLoad` | `boolean`          | `true`  | Fetch on creation and whenever the handle changes. |
| `fetchFn`  | `typeof fetch`     | global  | Inject your own `fetch` (tests, proxies, mocks).   |

If the requested year does not exist for that user, the newest available year is selected
automatically. Stale responses are discarded, so typing quickly through a search box can never
overwrite a newer result with an older one.

### Using it inside `<ContributionGraph3D />`

```vue
<ContributionGraph3D :username="username" @error="(message) => (error = message)" />
```

The component creates the composable for you. Use the template-ref API when you also need the years
in a `<ContributionYearTabs />`.

## Aggregating statistics

```ts
import { useContributionStats, computeStats } from 'vue-contribution-graph-3d'

const stats = useContributionStats(() => days.value)
// { total, activeDays, longestStreak, bestDay }
```

`computeStats` is the pure version if you do not want a `ComputedRef`. Future days and padding days
are excluded, so a year in progress is never skewed by months that have not happened yet.

## Sample data

`useSampleContributions` produces a deterministic year — the same seed always yields the same grid,
so demos and screenshots stay stable.

```ts
import { useSampleContributions } from 'vue-contribution-graph-3d'

const days = useSampleContributions(2025) // every day is in the past → full grid
const custom = useSampleContributions(2026, 42) // different seed
```

Because it is deterministic you can unit test against it, and it makes offline development possible.

## Your own source

Anything that produces `{ date, count }` pairs works:

```ts
import { normalizeContributionData, computeStats } from 'vue-contribution-graph-3d'

const payload = await fetch('/api/activity').then((r) => r.json())
const days = normalizeContributionData(payload.entries, 2025)
const stats = computeStats(days)
```

Then hand `days` to `<ContributionGraph3D :data="days" />` and `stats` to `<ContributionStats
:stats="stats" />`.

## Height scale

Bars are scaled logarithmically so that quiet days stay visible:

```ts
height = 0.24 + (log1p(count) / log1p(maxCount)) * (10.5 - 0.24)
```

- `count === 0` renders a `0.1` tall placeholder instead of disappearing.
- The busiest day always reaches the full `10.5` units.
- The color level is bucketed independently: `0`, `1–3`, `4–7`, `8–13`, `14+`.

Both functions are exported (`getBarHeight`, `getContributionLevel`) if you need to render the same
values elsewhere — for example in a 2D fallback.
