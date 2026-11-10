<script setup lang="ts">
import { computed } from 'vue'

import { useCgTheme, type CgThemeProps } from '../composables/useCgTheme'
import { formatDate } from '../utils/format'

defineOptions({ name: 'ContributionTooltip' })

const props = withDefaults(
  defineProps<
    CgThemeProps & {
      /** Number of contributions for the hovered day. */
      count: number
      /** `YYYY-MM-DD` date key, formatted with `Intl`. */
      dateKey?: string
      /** Horizontal position inside the graph, in pixels. */
      x?: number
      /** Vertical position inside the graph, in pixels. */
      y?: number
      /** BCP 47 locale used to format the date. */
      locale?: string
    }
  >(),
  {
    palette: 'forest',
    theme: 'auto',
    dateKey: '',
    x: 0,
    y: 0,
    locale: 'en',
  },
)

const { cgAttrs } = useCgTheme(props)

const label = computed(() => `${props.count} contribution${props.count === 1 ? '' : 's'}`)
const date = computed(() => (props.dateKey ? formatDate(props.dateKey, props.locale) : ''))

const position = computed(() => ({
  left: `${props.x}px`,
  top: `${props.y}px`,
  transform: 'translate(14px, 14px)',
}))
</script>

<template>
  <div
    v-bind="cgAttrs"
    class="cg-tooltip pointer-events-none absolute z-50 min-w-[190px] max-w-[260px] rounded-lg border border-cg-border bg-cg-field px-4 py-3 font-cg-sans text-sm leading-relaxed text-cg-text shadow-md"
    :style="position"
    role="status"
  >
    <slot :count="label" :date="date" :rawCount="count">
      <p class="m-0 font-semibold">{{ label }}</p>
      <p v-if="date" class="m-0 mt-1 text-cg-muted">{{ date }}</p>
    </slot>
  </div>
</template>
