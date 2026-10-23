# ContributionYearTabs

A `v-model` tab list for the years a profile has activity in. Pair it with the `years` and `year`
refs exposed by `<ContributionGraph3D />`.

<script setup lang="ts">
import { ContributionYearTabs, useGitHubContributions } from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const { years, year, days, loading, setYear } = useGitHubContributions({
  username: 'torvalds',
})
const siteTheme = useSiteTheme()
</script>

<div class="cg-doc-card">
  <ContributionYearTabs
    v-if="years.length"
    :years="years"
    :model-value="year"
    :theme="siteTheme"
    @update:model-value="setYear"
  />
  <p v-else class="font-mono text-xs text-(--vp-c-text-2)">loading years…</p>
  <p class="mt-3 font-mono text-xs text-(--vp-c-text-2)">
    selected: {{ year }} · {{ days.length }} cells<template v-if="loading"> · loading…</template>
  </p>
</div>

## Props

| Prop         | Type                      | Default                | Description                                  |
| ------------ | ------------------------- | ---------------------- | -------------------------------------------- |
| `modelValue` | `number \| string`        | required               | The selected year.                           |
| `years`      | `Array<number \| string>` | required               | Years to render, in the order you pass them. |
| `label`      | `string`                  | `'Contribution years'` | Accessible name of the tab list.             |
| `palette`    | `string`                  | `'forest'`             | Sets `data-cg-palette`.                      |
| `theme`      | `string`                  | `'auto'`               | Sets `data-cg-theme`.                        |

## Events

| Event               | Payload                  |
| ------------------- | ------------------------ |
| `update:modelValue` | `year: number \| string` |

Clicking the already selected year emits nothing.

## Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ContributionGraph3D, ContributionYearTabs } from 'vue-contribution-graph-3d'

const graph = ref<InstanceType<typeof ContributionGraph3D> | null>(null)
</script>

<template>
  <ContributionYearTabs
    :years="graph?.years.value ?? []"
    :model-value="graph?.year.value ?? ''"
    @update:model-value="graph?.setYear($event)"
  />
  <ContributionGraph3D ref="graph" :username="username" />
</template>
```

Or keep the year in your own state and feed it to both, which is what the playground does.

## Accessibility

Rendered as `role="tablist"` with one `role="tab"` button per year. The selected tab carries
`aria-selected="true"` and every tab is in the natural tab order, so arrow-key semantics can be
added on top later without changing the markup.
