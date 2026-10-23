<script setup lang="ts">
import { useCgTheme, type CgThemeProps } from '../composables/useCgTheme'

defineOptions({ name: 'ContributionYearTabs' })

const props = withDefaults(
  defineProps<
    CgThemeProps & {
      /** Years to render, newest first. */
      years: Array<number | string>
      /** Currently selected year. */
      modelValue: number | string
      /** Accessible label of the tab list. */
      label?: string
    }
  >(),
  {
    palette: 'forest',
    theme: 'auto',
    label: 'Contribution years',
  },
)

const emit = defineEmits<{
  'update:modelValue': [year: number | string]
}>()

const { cgAttrs } = useCgTheme(props)

function select(year: number | string): void {
  if (year === props.modelValue) return
  emit('update:modelValue', year)
}
</script>

<template>
  <div
    v-bind="cgAttrs"
    role="tablist"
    :aria-label="label"
    class="grid max-h-[180px] auto-rows-[35px] grid-cols-4 gap-2 overflow-y-auto overscroll-contain p-1"
  >
    <button
      v-for="year in years"
      :key="year"
      type="button"
      role="tab"
      class="h-[35px] min-w-0 rounded-[5px] border px-[5px] text-center font-cg-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cg-accent"
      :class="
        String(year) === String(modelValue)
          ? 'border-cg-accent bg-cg-accent font-semibold text-cg-accent-ink'
          : 'border-cg-border bg-cg-field text-cg-muted hover:border-cg-accent hover:bg-cg-selected'
      "
      :aria-selected="String(year) === String(modelValue)"
      @click="select(year)"
    >
      {{ year }}
    </button>
  </div>
</template>
