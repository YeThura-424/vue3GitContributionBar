<script setup lang="ts">
import { useCgTheme, type CgThemeProps } from '../composables/useCgTheme'

const props = withDefaults(defineProps<CgThemeProps>(), { palette: 'forest', theme: 'auto' })
const { cgAttrs } = useCgTheme(props)

const duration = defineModel<number>('duration', { default: 2400 })
const animate = defineModel<boolean>('animate', { default: true })
const loop = defineModel<boolean>('loop', { default: false })
const showAxisLabels = defineModel<boolean>('showAxisLabels', { default: true })
const showGridFrame = defineModel<boolean>('showGridFrame', { default: true })
const showTooltip = defineModel<boolean>('showTooltip', { default: true })
</script>

<template>
  <div v-bind="cgAttrs" class="grid gap-3.5 font-cg-sans">
    <label class="block text-xs text-cg-muted">
      Animation duration · {{ (duration / 1000).toFixed(1) }}s
      <input
        v-model.number="duration"
        type="range"
        min="400"
        max="6000"
        step="100"
        class="mt-2 block w-full cursor-pointer accent-cg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cg-accent"
      />
    </label>

    <div class="grid gap-2.5 text-xs">
      <label class="flex cursor-pointer items-center justify-between gap-3">
        <span class="text-cg-muted">Grow animation</span>
        <input
          v-model="animate"
          type="checkbox"
          class="h-4 w-4 accent-cg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cg-accent"
        />
      </label>
      <label class="flex cursor-pointer items-center justify-between gap-3">
        <span class="text-cg-muted">Loop forever</span>
        <input
          v-model="loop"
          type="checkbox"
          class="h-4 w-4 accent-cg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cg-accent"
        />
      </label>
      <label class="flex cursor-pointer items-center justify-between gap-3">
        <span class="text-cg-muted">Axis labels</span>
        <input
          v-model="showAxisLabels"
          type="checkbox"
          class="h-4 w-4 accent-cg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cg-accent"
        />
      </label>

      <label class="flex cursor-pointer items-center justify-between gap-3">
        <span class="text-cg-muted">Grid frame</span>
        <input
          v-model="showGridFrame"
          type="checkbox"
          class="h-4 w-4 accent-cg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cg-accent"
        />
      </label>

      <label class="flex cursor-pointer items-center justify-between gap-3">
        <span class="text-cg-muted">Tooltip</span>
        <input
          v-model="showTooltip"
          type="checkbox"
          class="h-4 w-4 accent-cg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cg-accent"
        />
      </label>
    </div>
  </div>
</template>
