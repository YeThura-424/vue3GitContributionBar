# ContributionPalettePicker

A `v-model` fieldset with one button per built-in palette. The selected button gets the accent
treatment, and each row shows a swatch in that palette's highlight color.

<script setup lang="ts">
import { ref } from 'vue'
import {
  ContributionGraph3D,
  ContributionPalettePicker,
  useGitHubContributions,
} from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const palette = ref<'forest' | 'daylight' | 'midnight'>('forest')
const { days, loading } = useGitHubContributions({ username: 'torvalds' })
const siteTheme = useSiteTheme()
</script>

<div class="cg-doc-card">
  <ContributionPalettePicker v-model="palette" :theme="siteTheme" />
  <ContributionGraph3D
    class="mt-4"
    :data="days"
    :loading="loading"
    :palette="palette"
    :theme="siteTheme"
    height="300px"
  />
</div>

## Props

| Prop         | Type          | Default           | Description                                   |
| ------------ | ------------- | ----------------- | --------------------------------------------- |
| `modelValue` | `PaletteName` | required          | The selected palette.                         |
| `label`      | `string`      | `'Color palette'` | Legend of the fieldset.                       |
| `palette`    | `string`      | `'forest'`        | Chrome palette (independent of `modelValue`). |
| `theme`      | `string`      | `'auto'`          | Light or dark chrome.                         |

::: tip `modelValue` vs `palette`
`modelValue` is _which palette is selected_. `palette` only styles the widget itself, exactly like
every other component in the suite. You rarely need to set it separately.
:::

## Events

| Event               | Payload                |
| ------------------- | ---------------------- |
| `update:modelValue` | `palette: PaletteName` |

## Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ContributionGraph3D, ContributionPalettePicker } from 'vue-contribution-graph-3d'

const palette = ref<'forest' | 'daylight' | 'midnight'>('daylight')
</script>

<template>
  <ContributionPalettePicker v-model="palette" label="Palette de couleurs" />
  <ContributionGraph3D :data="days" :palette="palette" />
</template>
```

## Accessibility

Rendered as a `<fieldset>` with a `<legend>`, and each option is a real button carrying
`aria-pressed`, so screen readers announce "Forest, pressed".
