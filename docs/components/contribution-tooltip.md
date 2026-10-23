# ContributionTooltip

The hover card. `<ContributionGraph3D />` renders one for you by default, but you can disable it
with `:show-tooltip="false"` and place your own, or use the component standalone over a 2D chart.

<script setup lang="ts">
import { ref } from 'vue'
import { ContributionTooltip } from 'vue-contribution-graph-3d'

const position = ref({ x: 40, y: 40 })

function onMove(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  position.value = { x: event.clientX - rect.left, y: event.clientY - rect.top }
}
</script>

<div class="cg-doc-card relative h-48 overflow-hidden" @mousemove="onMove">
  <div class="absolute inset-0 grid place-items-center text-sm text-(--vp-c-text-2)">
    move the pointer over this box
  </div>
  <ContributionTooltip
    :count="7"
    date-key="2025-09-21"
    :x="position.x"
    :y="position.y"
  />
</div>

## Props

| Prop      | Type     | Default    | Description                                         |
| --------- | -------- | ---------- | --------------------------------------------------- |
| `count`   | `number` | required   | Number of contributions.                            |
| `dateKey` | `string` | `''`       | `YYYY-MM-DD`, formatted with `Intl.DateTimeFormat`. |
| `x`       | `number` | `0`        | Horizontal position in CSS pixels.                  |
| `y`       | `number` | `0`        | Vertical position in CSS pixels.                    |
| `locale`  | `string` | `'en'`     | BCP 47 locale used for the date.                    |
| `palette` | `string` | `'forest'` | Sets `data-cg-palette`.                             |
| `theme`   | `string` | `'auto'`   | Light or dark chrome.                               |

The card is positioned with `translate(14px, 14px)` so it never sits under the pointer, and it is
`pointer-events-none`, so it can never steal the hover from the bar underneath it.

## Slots

The default slot receives the formatted values:

```vue
<ContributionTooltip :count="hit.day.count" :date-key="hit.day.date" :x="hit.x" :y="hit.y">
  <template #default="{ count, date }">
    <div class="flex items-center gap-2">
      <span class="h-2 w-2 rounded-full bg-cg-accent" />
      <strong>{{ count }}</strong>
      <span class="text-cg-muted">{{ date }}</span>
    </div>
  </template>
</ContributionTooltip>
```

| Slot prop  | Value                                        |
| ---------- | -------------------------------------------- |
| `count`    | Ready-to-read label, e.g. `7 contributions`. |
| `date`     | Formatted date, or `''` without `dateKey`.   |
| `rawCount` | The raw `count` number.                      |

## Events

None. The tooltip is presentational; the graph emits `hover` with the same `x`/`y` coordinates.

## Accessibility

Rendered with `role="status"`, so the count is announced politely when it changes — without the
chatter of an `aria-live="assertive"` region that would fire on every pixel of pointer movement.
