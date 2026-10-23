# Theming & palettes

Two independent knobs control how everything looks:

- **`palette`** — the color ramp of the bars, the Three.js scene background, and the matching
  default chrome.
- **`theme`** — the light or dark chrome of the surrounding widgets.

```vue
<ContributionGraph3D :data="days" palette="daylight" theme="light" />
```

## Palettes

| Name       | Look                                        | Default chrome |
| ---------- | ------------------------------------------- | -------------- |
| `forest`   | Deep greens with a bright mint highlight.   | dark           |
| `daylight` | Soft sage greens on a warm off-white scene. | light          |
| `midnight` | Violet ramp on a near-black blue scene.     | dark           |

<script setup lang="ts">
import { ref } from 'vue'
import {
  ContributionGraph3D,
  ContributionLegend,
  PALETTE_LABELS,
  PALETTE_NAMES,
  useGitHubContributions,
} from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const palette = ref<'forest' | 'daylight' | 'midnight'>('forest')
const { days, loading } = useGitHubContributions({ username: 'torvalds' })
const siteTheme = useSiteTheme()
</script>

<div class="cg-doc-card">
  <div class="mb-4 flex flex-wrap gap-2">
    <button
      v-for="option in PALETTE_NAMES"
      :key="option"
      type="button"
      class="rounded border border-(--vp-c-divider) px-3 py-1 text-sm"
      :class="palette === option ? 'bg-(--vp-c-brand-soft)' : ''"
      @click="palette = option"
    >
      {{ PALETTE_LABELS[option] }}
    </button>
  </div>

<ContributionGraph3D
    :data="days"
    :loading="loading"
    :palette="palette"
    :theme="siteTheme"
    :duration="2400"
    height="320px"
  />

  <ContributionLegend class="mt-4" :palette="palette" :theme="siteTheme" />
</div>

Each swatch of `<ContributionLegend />` follows the palette automatically through CSS variables, so
you never have to pass colors around by hand.

## Light and dark chrome

`theme` accepts `dark`, `light` or `auto` (the default). `auto` follows the palette, which means
`daylight` renders light chrome and the other two render dark chrome. Pass an explicit value when
you want, for example, a dark toolbar on top of the daylight scene:

```vue
<ContributionStats :data="days" palette="daylight" theme="dark" />
```

Every component exposes the resolved values on its root element:

```html
<!-- rendered by <ContributionLegend palette="midnight" /> -->
<div data-cg-theme="dark" data-cg-palette="midnight" …></div>
```

Because both attributes are set by the component itself, nesting widgets never causes a theme to
leak from a parent.

## The token layer

The library ships `dist/style.css`, built from `src/tokens.css`. It contains a `@theme` block of
namespaced custom properties plus a small `@layer components` block of overrides — and **nothing
else**. No preflight, no base reset, no global element selectors.

| Token                              | Used for                                               |
| ---------------------------------- | ------------------------------------------------------ |
| `--color-cg-page`                  | Full page background (yours to use).                   |
| `--color-cg-panel`                 | Panel background (yours to use).                       |
| `--color-cg-field`                 | Input and tooltip background.                          |
| `--color-cg-selected`              | Selected year / palette background.                    |
| `--color-cg-border`                | Borders, dividers, the grid frame.                     |
| `--color-cg-text`                  | Primary text.                                          |
| `--color-cg-muted`                 | Secondary text and legends.                            |
| `--color-cg-accent`                | Accent: buttons, stats, focus rings.                   |
| `--color-cg-accent-ink`            | Text on top of the accent color.                       |
| `--color-cg-error`                 | Error text.                                            |
| `--color-cg-scene`                 | WebGL scene background (and its placeholder).          |
| `--color-cg-level-0 … 4`           | The five intensity levels.                             |
| `--font-cg-sans`, `--font-cg-mono` | Component typography (`font-cg-sans`, `font-cg-mono`). |

## Overriding a color

Add your own override after the library stylesheet. Attribute selectors win over `:root`, so nothing
needs `!important`:

```css
/* app.css — imported after 'vue-contribution-graph-3d/style.css' */
[data-cg-theme='dark'] {
  --color-cg-accent: #7dd3fc;
  --color-cg-accent-ink: #082f49;
}
```

```ts
import 'vue-contribution-graph-3d/style.css'
import './app.css'
```

## Defining your own palette

A palette is three things: the ramp used by the WebGL bars, the scene background, and the CSS
variables for the legend and the container.

```ts
// main.ts — before the first graph mounts
import { THEME_PALETTES, THEME_SCENE_COLORS } from 'vue-contribution-graph-3d'
import 'vue-contribution-graph-3d/style.css'
import './sunset.css'

Object.assign(THEME_PALETTES, {
  sunset: ['#3b2233', '#7a3350', '#b84f63', '#ef8f6b', '#ffd9a0'],
})

Object.assign(THEME_SCENE_COLORS, {
  sunset: '#1a1119',
})
```

```css
/* sunset.css */
@layer components {
  [data-cg-palette='sunset'] {
    --color-cg-scene: #1a1119;
    --color-cg-level-0: #3b2233;
    --color-cg-level-1: #7a3350;
    --color-cg-level-2: #b84f63;
    --color-cg-level-3: #ef8f6b;
    --color-cg-level-4: #ffd9a0;
  }
}
```

```vue
<template>
  <ContributionGraph3D :data="days" palette="sunset" />
  <ContributionLegend palette="sunset" />
</template>
```

An unknown palette name falls back to `forest` everywhere instead of throwing, so a missing entry
degrades rather than crashing the scene.

## Reduced motion

The grow animation is disabled automatically when the visitor prefers reduced motion — the bars
appear at their final height on the first frame. You can still call `replay()` explicitly.

```ts
import { useReducedMotion } from 'vue-contribution-graph-3d'

const reduced = useReducedMotion() // Ref<boolean>, live-updating
```

The component wires this up for you; the composable exists for the rare case where you want to fade
something else out too.

## Typography

Components use `--font-cg-sans` (Arial) and `--font-cg-mono` (Courier New) so they look like the
original demo regardless of what your application sets. Override the two variables to match your
brand:

```css
[data-cg-theme] {
  --font-cg-sans: 'Inter', system-ui, sans-serif;
  --font-cg-mono: 'JetBrains Mono', monospace;
}
```
