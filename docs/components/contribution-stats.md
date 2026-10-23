# ContributionStats

Four numbers under the graph: total contributions, active days, longest streak and best day.

<script setup lang="ts">
import { useContributionStats, useGitHubContributions } from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const { days } = useGitHubContributions({ username: 'torvalds' })
const stats = useContributionStats(() => days.value)
const siteTheme = useSiteTheme()
</script>

<div class="cg-doc-card">
  <ContributionStats :stats="stats" :theme="siteTheme" />
</div>

## Props

| Prop      | Type                                 | Default    | Description                                             |
| --------- | ------------------------------------ | ---------- | ------------------------------------------------------- |
| `data`    | `readonly ContributionDay[] \| null` | `null`     | Aggregated on the fly. Ignored when `stats` is set.     |
| `stats`   | `ContributionStats \| null`          | `null`     | Pre-computed numbers, e.g. from `useContributionStats`. |
| `palette` | `string`                             | `'forest'` | Accent color source.                                    |
| `theme`   | `string`                             | `'auto'`   | Light or dark chrome.                                   |

## The stats object

```ts
interface ContributionStats {
  total: number
  activeDays: number
  longestStreak: number
  bestDay: ContributionDay | null
}
```

Future days and neighbouring-year padding are excluded, so a year in progress reports honest
numbers.

## Slots

None — the four cells are the component. If you need different labels, build them from
`useContributionStats` with your own markup; the accent and border tokens are the same.

## Example

```vue
<script setup lang="ts">
import { ContributionStats, useContributionStats } from 'vue-contribution-graph-3d'

const stats = useContributionStats(() => days.value)
</script>

<template>
  <!-- Pass the computed ref, the component reads the value -->
  <ContributionStats :stats="stats" palette="midnight" />

  <!-- Or let it aggregate -->
  <ContributionStats :data="days" />
</template>
```

## Accessibility

Each cell is a labelled group with the label rendered as small uppercase text and an
`sr-only` line that carries the detail (for example _on 2025-09-21_ under the best day).
