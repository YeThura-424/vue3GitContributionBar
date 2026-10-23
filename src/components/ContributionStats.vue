<script setup lang="ts">
import { computed } from 'vue'

import { useCgTheme, type CgThemeProps } from '../composables/useCgTheme'
import type { ContributionDay, ContributionStats as Stats } from '../types'
import { computeStats } from '../utils/stats'

defineOptions({ name: 'ContributionStats' })

const props = withDefaults(
  defineProps<
    CgThemeProps & {
      /** Day grid to aggregate. Ignored when `stats` is provided. */
      data?: readonly ContributionDay[] | null
      /** Pre-computed numbers, e.g. from `useContributionStats`. */
      stats?: Stats | null
    }
  >(),
  {
    palette: 'forest',
    theme: 'auto',
    data: null,
    stats: null,
  },
)

const { cgAttrs } = useCgTheme(props)

const EMPTY: Stats = { total: 0, activeDays: 0, longestStreak: 0, bestDay: null }

const resolved = computed<Stats>(() => {
  if (props.stats) return props.stats
  if (props.data && props.data.length > 0) return computeStats(props.data)
  return EMPTY
})

const cells = computed(() => [
  { label: 'Total contributions', value: resolved.value.total.toLocaleString(), suffix: '', detail: '' },
  { label: 'Active days', value: resolved.value.activeDays.toLocaleString(), suffix: '', detail: '' },
  {
    label: 'Longest streak',
    value: resolved.value.longestStreak.toLocaleString(),
    suffix: `day${resolved.value.longestStreak === 1 ? '' : 's'}`,
    detail: '',
  },
  {
    label: 'Best day',
    value: (resolved.value.bestDay?.count ?? 0).toLocaleString(),
    suffix: '',
    detail: resolved.value.bestDay ? `on ${resolved.value.bestDay.date}` : 'No activity yet',
  },
])

const cellClasses = [
  'pl-0 pr-4 sm:pl-0 sm:pr-6',
  'border-l border-cg-border pl-4 pr-4 sm:pl-6 sm:pr-6',
  'pl-0 pr-4 sm:border-l sm:border-cg-border sm:pl-6 sm:pr-6',
  'border-l border-cg-border pl-4 pr-4 sm:pl-6 sm:pr-6',
]
</script>

<template>
  <div
    v-bind="cgAttrs"
    class="grid grid-cols-2 gap-y-6 border-y border-cg-border py-6 sm:grid-cols-4 sm:gap-y-0"
    aria-label="Contribution summary"
  >
    <div
      v-for="(cell, index) in cells"
      :key="cell.label"
      class="min-w-0"
      :class="cellClasses[index]"
    >
      <span
        class="mb-3 mt-1 block font-cg-mono text-[9px] uppercase leading-none tracking-[0.6px] text-cg-muted"
      >
        {{ cell.label }}
      </span>
      <strong class="font-cg-mono text-[27px] leading-none text-cg-accent sm:text-[34px]">
        {{ cell.value }}<span v-if="cell.suffix" class="ml-1 text-[0.45em]">{{ ` ${cell.suffix}` }}</span>
      </strong>
      <span class="sr-only">{{ cell.detail }}</span>
    </div>
  </div>
</template>
