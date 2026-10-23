# ContributionGraph3D

The WebGL scene. Bars, camera, hover picking and the grow animation all live here; everything else
in the suite is optional chrome.

<script setup lang="ts">
import { ref } from 'vue'
import {
  ContributionGraph3D,
  ContributionLegend,
  useGitHubContributions,
} from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const { username, year, days, loading } = useGitHubContributions({ username: 'torvalds' })
const graph = ref<{ replay(): void; resetView(): void } | null>(null)
const lastHover = ref<string>('—')
const siteTheme = useSiteTheme()

function onHover(hit: { day: { date: string; count: number } } | null) {
  lastHover.value = hit ? `${hit.day.date} · ${hit.day.count}` : '—'
}
</script>

<div class="cg-doc-card">
  <ContributionGraph3D
    ref="graph"
    :data="days"
    :loading="loading"
    palette="forest"
    :theme="siteTheme"
    :duration="2400"
    @hover="onHover"
  />
  <div class="mt-4 flex items-center justify-between gap-4">
    <ContributionLegend :theme="siteTheme" />
    <p class="font-mono text-xs text-(--vp-c-text-2)">
      @{{ username }} · {{ year }} · hovered: {{ lastHover }}
    </p>
  </div>
</div>

## Props

| Prop             | Type                                   | Default                               | Description                                                      |
| ---------------- | -------------------------------------- | ------------------------------------- | ---------------------------------------------------------------- |
| `data`           | `readonly ContributionDay[] \| null`   | `null`                                | Day grid to render. Wins over `username` when both are set.      |
| `username`       | `string \| null`                       | `null`                                | GitHub handle; fetched through the community API.                |
| `year`           | `number \| string \| null`             | current year                          | Year to display when `username` is used.                         |
| `palette`        | `'forest' \| 'daylight' \| 'midnight'` | `'forest'`                            | Bar ramp, scene background and default chrome.                   |
| `theme`          | `'dark' \| 'light' \| 'auto'`          | `'auto'`                              | Chrome of the loading and empty states.                          |
| `animate`        | `boolean`                              | `true`                                | Grow the bars instead of showing final heights.                  |
| `loop`           | `boolean`                              | `false`                               | Restart the animation when it finishes.                          |
| `duration`       | `number`                               | `2400`                                | Grow duration in milliseconds.                                   |
| `showAxisLabels` | `boolean`                              | `true`                                | Render the month and weekday sprites.                            |
| `showGridFrame`  | `boolean`                              | `true`                                | Draw the theme-colored flat outline between grid and labels.     |
| `showTooltip`    | `boolean`                              | `true`                                | Render the built-in hover tooltip.                               |
| `loading`        | `boolean`                              | `false`                               | Force the loading overlay (OR-ed with the internal fetch state). |
| `label`          | `string`                               | `'Interactive 3D contribution graph'` | Accessible name of the graph.                                    |
| `height`         | `string`                               | `'clamp(360px, 48.3vh, 500px)'`       | Any CSS length, applied to the container.                        |

The root element also accepts a `class` and any other attribute (`v-bind="$attrs"` is spread on the
container), so `class="rounded-none"` or `id="graph"` work as expected.

## Events

| Event    | Payload                     | Fired when                                     |
| -------- | --------------------------- | ---------------------------------------------- |
| `ready`  | —                           | The Three.js scene is mounted.                 |
| `loaded` | `days: ContributionDay[]`   | New data was handed to the scene.              |
| `hover`  | `ContributionHover \| null` | The pointer enters a bar, moves, or leaves.    |
| `error`  | `message: string`           | Fetching failed or WebGL could not be created. |

```ts
interface ContributionHover {
  day: ContributionDay
  level: number // 0-4 intensity
  x: number // CSS pixels inside the container
  y: number
}
```

## Slots

| Slot      | Props | Fallback                                      |
| --------- | ----- | --------------------------------------------- |
| `loading` | —     | Spinner plus _Loading contributions…_         |
| `empty`   | —     | Hint telling you to pass `username` or `data` |
| default   | —     | Rendered above the canvas, below the tooltip  |

## Exposed

Access through a template ref:

```vue
<ContributionGraph3D ref="graph" :username="username" />
```

| Member      | Type                                   | Description                               |
| ----------- | -------------------------------------- | ----------------------------------------- |
| `ready`     | `Ref<boolean>`                         | Whether the scene exists.                 |
| `years`     | `Ref<string[]>`                        | Years returned by the API, newest first.  |
| `year`      | `Ref<string>`                          | Active year.                              |
| `setYear`   | `(year: string \| number) => void`     | Switch year.                              |
| `load`      | `(username?: string) => Promise<void>` | Fetch a profile.                          |
| `reload`    | `() => void`                           | Re-fetch the current profile.             |
| `status`    | `Ref<ContributionStatus>`              | `idle`, `loading`, `success`, `error`.    |
| `error`     | `Ref<string \| null>`                  | Failure message.                          |
| `replay`    | `() => void`                           | Restart the grow animation.               |
| `resetView` | `() => void`                           | Return the camera to its default framing. |

## Loading a profile

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ContributionGraph3D, ContributionYearTabs } from 'vue-contribution-graph-3d'

const username = ref('torvalds')
const graph = ref<InstanceType<typeof ContributionGraph3D> | null>(null)
</script>

<template>
  <ContributionGraph3D
    ref="graph"
    :username="username"
    @error="(message) => console.error(message)"
  />

  <ContributionYearTabs
    v-if="graph?.years?.value?.length"
    :years="graph.years.value"
    :model-value="graph.year.value"
    @update:model-value="graph.setYear($event)"
  />
</template>
```

## Rendering without WebGL

The `ContributionScene` is constructed in `onMounted`, so the server renders an empty, correctly
sized container and the client builds the scene after hydration — no `<ClientOnly>` required.
Construction is wrapped in a `try`/`catch`: on machines without WebGL the `error` event fires with a
readable message instead of throwing.

## Dispose

`<ContributionGraph3D />` releases everything it creates on unmount: geometries, materials, canvas
textures, `OrbitControls`, the `ResizeObserver`, pointer listeners and the animation frame. If you
build the scene yourself with `new ContributionScene(el)`, call `.dispose()` yourself.
