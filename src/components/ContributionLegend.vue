<script setup lang="ts">
import { useCgTheme, type CgThemeProps } from '../composables/useCgTheme'
import { LEVEL_COUNT } from '../constants'

defineOptions({ name: 'ContributionLegend' })

const props = withDefaults(
  defineProps<
    CgThemeProps & {
      /** Render the `Less` / `More` captions. */
      showLabels?: boolean
      /** Caption on the left hand side. */
      lessLabel?: string
      /** Caption on the right hand side. */
      moreLabel?: string
    }
  >(),
  {
    palette: 'forest',
    theme: 'auto',
    showLabels: true,
    lessLabel: 'Less',
    moreLabel: 'More',
  },
)

const { cgAttrs } = useCgTheme(props)

const levelClasses = [
  'bg-cg-level-0',
  'bg-cg-level-1',
  'bg-cg-level-2',
  'bg-cg-level-3',
  'bg-cg-level-4',
]
const levels = Array.from({ length: LEVEL_COUNT }, (_, index) => index)
</script>

<template>
  <div
    v-bind="cgAttrs"
    class="flex items-center gap-[5px] font-cg-sans text-xs text-cg-muted"
    aria-label="Contribution intensity legend"
  >
    <span v-if="showLabels" class="mr-[3px]">{{ lessLabel }}</span>
    <i
      v-for="level in levels"
      :key="level"
      class="block h-3 w-3 rounded-sm"
      :class="levelClasses[level]"
      aria-hidden="true"
    />
    <span v-if="showLabels" class="ml-[3px]">{{ moreLabel }}</span>
  </div>
</template>
