# ContributionLegend

The five intensity swatches with _Less_ and _More_ captions. Swatch colors come from the palette's
CSS variables, so the legend follows the graph without any prop drilling.

<script setup lang="ts">
import { ref } from 'vue'
import { ContributionLegend, PALETTE_LABELS, PALETTE_NAMES } from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const palette = ref<'forest' | 'daylight' | 'midnight'>('forest')
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

  <ContributionLegend :palette="palette" :theme="siteTheme" />
</div>

## Props

| Prop         | Type      | Default    | Description                          |
| ------------ | --------- | ---------- | ------------------------------------ |
| `palette`    | `string`  | `'forest'` | Which ramp the swatches show.        |
| `theme`      | `string`  | `'auto'`   | `dark`, `light` or palette-derived.  |
| `showLabels` | `boolean` | `true`     | Render the `Less` / `More` captions. |
| `lessLabel`  | `string`  | `'Less'`   | Left caption — translate it here.    |
| `moreLabel`  | `string`  | `'More'`   | Right caption.                       |

## Slots

None. The captions are props so that localization needs no scoped slots.

## Example

```vue
<ContributionLegend palette="midnight" less-label="Weniger" more-label="Mehr" />

<!-- Compact, for a tight toolbar -->
<ContributionLegend :show-labels="false" />
```

The root carries `aria-label="Contribution intensity legend"` and each swatch is `aria-hidden`, so
screen readers get one short description instead of five empty boxes.
