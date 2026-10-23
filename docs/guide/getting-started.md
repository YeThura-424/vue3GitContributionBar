# Getting started

## The smallest possible graph

```vue
<template>
  <ContributionGraph3D username="torvalds" />
</template>
```

That is the whole component: it fetches the profile, shows a spinner while it loads, picks the newest
year with activity, and disposes the WebGL scene when it unmounts.

Already own the data? Pass an array of days through `data` instead — read
[Working with data](./data) for the exact format.

## Load a real profile

Bind the handle to a `ref` when it comes from your own form:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ContributionGraph3D, ContributionLegend } from 'vue-contribution-graph-3d'

const username = ref('torvalds')
</script>

<template>
  <ContributionGraph3D :username="username" palette="daylight" />
  <ContributionLegend palette="daylight" />
</template>
```

The component owns the request, the loading spinner, the error state and the active year, and exposes
them through a template ref:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { ContributionGraph3D } from 'vue-contribution-graph-3d'

const graph = ref<InstanceType<typeof ContributionGraph3D> | null>(null)

async function switchTo(user: string) {
  await graph.value?.load(user)
}
</script>
```

| Exposed          | Type                               | Description                                  |
| ---------------- | ---------------------------------- | -------------------------------------------- |
| `years`          | `Ref<string[]>`                    | Available years, newest first.               |
| `year`           | `Ref<string>`                      | The year currently rendered.                 |
| `setYear(year)`  | `(year: string \| number) => void` | Switch the grid to another year.             |
| `load(username)` | `Promise<void>`                    | Fetch another profile.                       |
| `reload()`       | `() => void`                       | Re-fetch the current profile.                |
| `status`         | `Ref<ContributionStatus>`          | `idle`, `loading`, `success` or `error`.     |
| `error`          | `Ref<string \| null>`              | Human readable failure message.              |
| `replay()`       | `() => void`                       | Restart the grow animation.                  |
| `resetView()`    | `() => void`                       | Move the camera back to the default framing. |
| `ready`          | `Ref<boolean>`                     | The WebGL scene exists.                      |

## A complete dashboard

Everything below is real, running code:

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ContributionGraph3D,
  ContributionLegend,
  ContributionPalettePicker,
  ContributionStats,
  ContributionToolbar,
  ContributionYearTabs,
  useContributionStats,
  useGitHubContributions,
} from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const palette = ref<'forest' | 'daylight' | 'midnight'>('forest')
const animate = ref(true)
const loop = ref(false)

const { username, year, years, days, loading, setYear } = useGitHubContributions({
  username: 'torvalds',
})
const stats = useContributionStats(() => days.value)
const siteTheme = useSiteTheme()
const graph = ref<{ replay(): void; resetView(): void } | null>(null)

const badge = computed(() => `${username.value} · ${year.value}`)
</script>

<div class="cg-doc-card">
  <ContributionToolbar
    :badge="badge"
    :palette="palette"
    :theme="siteTheme"
    :disabled="loading"
    @replay="graph?.replay()"
    @reset="graph?.resetView()"
  />

  <div class="mt-4">
    <ContributionGraph3D
      ref="graph"
      :data="days"
      :loading="loading"
      :palette="palette"
      :theme="siteTheme"
      :animate="animate"
      :loop="loop"
      :duration="2400"
    />
  </div>

  <div v-if="years.length" class="mt-4">
    <ContributionYearTabs
      :years="years"
      :model-value="year"
      :palette="palette"
      :theme="siteTheme"
      @update:model-value="setYear"
    />
  </div>

  <ContributionStats class="mt-6" :stats="stats" :palette="palette" :theme="siteTheme" />

  <div class="mt-6 flex flex-wrap items-end justify-between gap-6">
    <ContributionLegend :palette="palette" :theme="siteTheme" />
    <ContributionPalettePicker v-model="palette" :palette="palette" :theme="siteTheme" />
  </div>
</div>

### What the pieces do

- **`ContributionToolbar`** forwards `replay` and `reset` to the scene through the template ref.
- **`ContributionYearTabs`** is a `v-model` component — bind it to the year your data source uses.
- **`ContributionPalettePicker`** is also a `v-model` component; the selected value feeds every other
  widget through the shared `palette` prop.
- **`ContributionStats`** accepts either `:data` (aggregates on the fly) or `:stats` (pre-aggregated
  by `useContributionStats`).

## Slots

Every component accepts slots for the parts you may want to replace.

```vue
<ContributionGraph3D :username="username">
  <!-- Custom loading state -->
  <template #loading>
    <div>Fetching contributions…</div>
  </template>

  <!-- Shown when there is no data at all -->
  <template #empty>
    <div>Nothing to show for {{ username }}.</div>
  </template>
</ContributionGraph3D>
```

`<ContributionGraph3D />` also renders whatever you put in its default slot on top of the canvas, and
`<ContributionTooltip />` exposes `count`, `date` and `rawCount` to its default slot.

## Events

```vue
<ContributionGraph3D
  :data="days"
  @ready="console.log('scene mounted')"
  @loaded="(days) => console.log(days.length, 'days rendered')"
  @hover="(hit) => console.log(hit?.day.date ?? 'left the graph')"
  @error="(message) => console.warn(message)"
/>
```

## Controls

| Input          | Action                             |
| -------------- | ---------------------------------- |
| Drag           | Orbit around the grid.             |
| Scroll / pinch | Zoom in and out.                   |
| Hover a bar    | Highlight it and show the tooltip. |
| Right-drag     | Pan the camera target.             |

Keyboard users can tab past the graph to the surrounding controls; the canvas itself is marked
`aria-hidden` because the month and weekday labels are exposed as screen-reader text instead.
