# Composables

All four composables are plain functions. They work inside `setup()`, but none of them require a
component scope, so you can also use them in tests or in a Pinia store.

## `useGitHubContributions`

Reactive state around the community GitHub contributions API
(`https://github-contributions-api.jogruber.de/v4/{user}?y=all`). No token required.

```ts
import { useGitHubContributions } from 'vue-contribution-graph-3d'

const {
  username, // Ref<string>   — normalized handle, `@` stripped
  year, // Ref<string>   — active year
  years, // Ref<string[]>  — available years, newest first
  totals, // Ref<Record<string, number>> — per-year totals
  days, // Ref<ContributionDay[]> — grid for the active year
  payload, // Ref<GitHubContributionsPayload | null>
  status, // Ref<ContributionStatus>
  error, // Ref<string | null>
  loading, // Ref<boolean>
  load, // (handle?: string) => Promise<void>
  setYear, // (year: number | string) => void
  reload, // () => void
} = useGitHubContributions({
  username: () => username.value,
  year: () => year.value,
})
```

### Options

| Option     | Type                                 | Default      | Description                                    |
| ---------- | ------------------------------------ | ------------ | ---------------------------------------------- |
| `username` | `MaybeRefOrGetter<string>`           | `''`         | Reactive handle; loads as soon as it is set.   |
| `year`     | `MaybeRefOrGetter<number \| string>` | current year | Reactive year to display.                      |
| `autoLoad` | `boolean`                            | `true`       | Fetch immediately and when the handle changes. |
| `fetchFn`  | `typeof fetch`                       | global       | Inject `fetch` for tests, proxies or caching.  |

### Behaviour

- The requested year is validated against the response; if it does not exist, the newest available
  year is selected automatically.
- Concurrent requests are guarded by a request id and an `AbortController`, so a slow response can
  never overwrite a newer one.
- Failures set `status = 'error'` and a human-readable `error` — `User not found.` for a 404,
  `Request failed.` otherwise.

## `useContributionStats`

```ts
const stats = useContributionStats(() => days.value)
// ComputedRef<{ total, activeDays, longestStreak, bestDay }>
```

Wraps [`computeStats`](./utilities). Returns zeros for an empty or missing array instead of
throwing.

## `useSampleContributions`

```ts
const days = useSampleContributions(2025) // ComputedRef<ContributionDay[]>
const other = useSampleContributions(() => year.value, 42) // custom seed
```

Deterministic sample year — the same arguments always produce the same grid. Every day that has not
happened yet stays empty, so the graph is never filled with future activity.

## `useReducedMotion`

```ts
const reduced = useReducedMotion() // Ref<boolean>
```

Tracks `prefers-reduced-motion: reduce` and updates live. Returns `false` immediately when
`window.matchMedia` is unavailable (SSR), and unsubscribes when the current scope is disposed.

::: tip You rarely need this one
`<ContributionGraph3D />` calls it internally and hands the value to the scene, which then renders
final bar heights instead of growing them.
:::

## `useCgTheme`

The internal helper every component uses to resolve and apply its chrome attributes:

```ts
const { resolvedTheme, cgAttrs } = useCgTheme(props)
```

```vue
<div v-bind="cgAttrs">…</div>
```

`cgAttrs` is a computed object containing `data-cg-theme` and `data-cg-palette`. Exported so that
custom components can opt into the same token layer.
