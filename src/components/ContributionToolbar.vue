<script setup lang="ts">
import { useCgTheme, type CgThemeProps } from '../composables/useCgTheme'

defineOptions({ name: 'ContributionToolbar' })

const props = withDefaults(
  defineProps<
    CgThemeProps & {
      /** Text shown inside the status pill. */
      badge?: string
      /** Label of the animation replay button. */
      replayLabel?: string
      /** Label of the camera reset button. */
      resetLabel?: string
      /** Disable both buttons, e.g. while data is loading. */
      disabled?: boolean
    }
  >(),
  {
    palette: 'forest',
    theme: 'auto',
    badge: 'Sample activity',
    replayLabel: 'Replay animation',
    resetLabel: 'Reset view',
    disabled: false,
  },
)

const { cgAttrs } = useCgTheme(props)

const emit = defineEmits<{
  replay: []
  reset: []
}>()
</script>

<template>
  <div v-bind="cgAttrs" class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
    <span
      class="inline-flex min-h-[29px] items-center gap-2 rounded-full border border-cg-border px-[11px] font-cg-mono text-[10px] uppercase tracking-[1.1px] text-cg-text"
    >
      <span class="h-1 w-1 flex-none rounded-full bg-cg-accent" aria-hidden="true" />
      <slot name="badge">{{ badge }}</slot>
    </span>

    <div class="flex flex-wrap items-center gap-3">
      <slot />

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-md border-0 bg-transparent px-2.5 py-2 font-cg-sans text-xs text-cg-text transition-colors hover:text-cg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cg-accent disabled:cursor-wait disabled:opacity-50"
        :disabled="disabled"
        @click="emit('replay')"
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M3 10a9 9 0 1 1 2.6 8.4" />
          <path d="M3 4v6h6" />
          <path d="m10 8 6 4-6 4V8Z" />
        </svg>
        {{ replayLabel }}
      </button>

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-md border-0 bg-transparent px-2.5 py-2 font-cg-sans text-xs text-cg-text transition-colors hover:text-cg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cg-accent disabled:cursor-wait disabled:opacity-50"
        :disabled="disabled"
        @click="emit('reset')"
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
          <path d="m12 7 5 3v5l-5 3-5-3v-5l5-3Zm-5 3 5 3 5-3m-5 3v5" />
        </svg>
        {{ resetLabel }}
      </button>
    </div>
  </div>
</template>
