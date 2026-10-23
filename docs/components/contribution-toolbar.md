# ContributionToolbar

A status pill on the left, two text buttons on the right. It has no idea what a graph is — it just
emits `replay` and `reset`.

<script setup lang="ts">
import { ref } from 'vue'
import { ContributionToolbar, useGitHubContributions } from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const { username, days, loading } = useGitHubContributions({ username: 'torvalds' })
const siteTheme = useSiteTheme()
const lastAction = ref('nothing yet')

function onReplay() {
  lastAction.value = 'emitted replay'
}

function onReset() {
  lastAction.value = 'emitted reset'
}
</script>

<div class="cg-doc-card">
  <ContributionToolbar
    :badge="`@${username} · ${days.length} cells`"
    :theme="siteTheme"
    :disabled="loading"
    @replay="onReplay"
    @reset="onReset"
  />
  <p class="mt-3 font-mono text-xs text-(--vp-c-text-2)">last event: {{ lastAction }}</p>
</div>

## Props

| Prop          | Type      | Default              | Description                                 |
| ------------- | --------- | -------------------- | ------------------------------------------- |
| `badge`       | `string`  | `'Sample activity'`  | Text inside the status pill.                |
| `replayLabel` | `string`  | `'Replay animation'` | Label of the first button.                  |
| `resetLabel`  | `string`  | `'Reset view'`       | Label of the second button.                 |
| `disabled`    | `boolean` | `false`              | Disables both buttons (use while loading).  |
| `palette`     | `string`  | `'forest'`           | Sets `data-cg-palette` for token overrides. |
| `theme`       | `string`  | `'auto'`             | Sets `data-cg-theme`.                       |

## Events

| Event    | Payload | Emitted when                  |
| -------- | ------- | ----------------------------- |
| `replay` | —       | The first button is pressed.  |
| `reset`  | —       | The second button is pressed. |

## Slots

| Slot    | Fallback                                   |
| ------- | ------------------------------------------ |
| `badge` | The `badge` prop text.                     |
| default | Rendered between the pill and the buttons. |

The default slot is where extra controls belong — a year tab list, a palette picker, a switch:

```vue
<ContributionToolbar badge="torvalds" @replay="replay">
  <ContributionYearTabs v-model="year" :years="years" />
</ContributionToolbar>
```

## Wiring it to the graph

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ContributionGraph3D, ContributionToolbar } from 'vue-contribution-graph-3d'

const graph = ref<InstanceType<typeof ContributionGraph3D> | null>(null)
</script>

<template>
  <ContributionToolbar :disabled="loading" @replay="graph?.replay()" @reset="graph?.resetView()" />
  <ContributionGraph3D ref="graph" :data="days" />
</template>
```

## Accessibility

Both buttons are real `<button>` elements with visible focus rings and a disabled state, so they are
reachable by keyboard and announced correctly. The pill is decorative text rather than a live
region, because a status that changes on every animation would be noisy.
