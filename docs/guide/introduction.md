# Introduction

**vue-contribution-graph-3d** turns a year of GitHub activity into a small 3D city. Every day is a
bar: quiet days stay flat, busy days tower over their neighbours, and the whole grid grows out of
the ground when data arrives.

It is a Vue 3 component suite, written in TypeScript, rendered with
[Three.js](https://threejs.org/) and styled with [Tailwind CSS](https://tailwindcss.com/).

```md
<ContributionGraph3D :data="days" palette="forest" />
```

That is the whole idea. Everything else in the package is optional chrome you can compose around it.

## What you get

| Component                       | Purpose                                                       |
| ------------------------------- | ------------------------------------------------------------- |
| `<ContributionGraph3D />`       | The WebGL scene: bars, camera, hover, grow animation.         |
| `<ContributionToolbar />`       | Status pill plus _Replay animation_ and _Reset view_ buttons. |
| `<ContributionLegend />`        | Less → More intensity swatches.                               |
| `<ContributionStats />`         | Total, active days, longest streak and best day.              |
| `<ContributionYearTabs />`      | Switch between the years returned by the API.                 |
| `<ContributionPalettePicker />` | Pick between forest, daylight and midnight.                   |
| `<ContributionUserForm />`      | A labelled `@username` input with a submit button.            |
| `<ContributionTooltip />`       | The hover card, or anything else you put in its slot.         |

Alongside the components you get four composables — `useGitHubContributions`,
`useContributionStats`, `useSampleContributions` and `useReducedMotion` — plus the underlying
utilities (`normalizeContributionData`, `computeStats`, …) if you want to drive everything yourself.

## A live example

The graph below is rendered by the real component with deterministic sample data, so it works
without a network connection.

<script setup lang="ts">
import { ref } from 'vue'
import {
  ContributionGraph3D,
  ContributionLegend,
  useContributionStats,
  useGitHubContributions,
} from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const palette = ref<'forest' | 'daylight' | 'midnight'>('midnight')
const { days, loading } = useGitHubContributions({ username: 'torvalds' })
const stats = useContributionStats(() => days.value)
const siteTheme = useSiteTheme()
</script>

<div class="cg-doc-card">
  <ContributionGraph3D
    :data="days"
    :loading="loading"
    :palette="palette"
    :theme="siteTheme"
    :duration="2400"
  />

  <div class="mt-6 flex flex-wrap items-center justify-between gap-4">
    <ContributionLegend :palette="palette" :theme="siteTheme" />
    <div class="flex gap-2">
      <button
        v-for="option in ['forest', 'daylight', 'midnight']"
        :key="option"
        type="button"
        class="rounded border border-(--vp-c-divider) px-3 py-1 text-sm"
        :class="palette === option ? 'bg-(--vp-c-brand-soft)' : ''"
        @click="palette = option"
      >
        {{ option }}
      </button>
    </div>
  </div>

  <ContributionStats class="mt-6" :stats="stats" :palette="palette" :theme="siteTheme" />
</div>

## Design goals

- **Honest 3D.** The height scale is logarithmic so a single contribution is still visible next to
  your busiest day. Nothing is faked with CSS transforms.
- **No surprises in your CSS.** The shipped stylesheet contains only `@theme` tokens and utilities,
  all namespaced with `cg-`. It never injects a reset and never touches a selector you did not ask
  for.
- **Clean up after itself.** The original demo never released GPU memory. This port disposes
  geometries, materials, textures, controls, observers and the animation frame on unmount.
- **Respect the visitor.** With `prefers-reduced-motion: reduce` the bars appear at their final
  height immediately instead of growing.

## Browser support

Anything with WebGL1 and `ResizeObserver`. Server-side rendering is supported: the component renders
an empty container on the server and creates the Three.js scene only after it mounts.
