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

    <div class="flex items-center gap-5">
      <slot />

      <button
        type="button"
        class="inline-flex items-center gap-1 border-0 bg-transparent p-0 font-cg-sans text-xs text-cg-muted transition-colors hover:text-cg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cg-accent disabled:cursor-wait disabled:opacity-50"
        :disabled="disabled"
        @click="emit('replay')"
      >
        <svg class="h-3 w-3" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
          <path
            d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
          />
        </svg>
        {{ replayLabel }}
      </button>

      <button
        type="button"
        class="inline-flex items-center gap-1 border-0 bg-transparent p-0 font-cg-sans text-xs text-cg-muted transition-colors hover:text-cg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cg-accent disabled:cursor-wait disabled:opacity-50"
        :disabled="disabled"
        @click="emit('reset')"
      >
        {{ resetLabel }}
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
          <path d="M4.5 8.5a8 8 0 1 1-.3 7" />
          <path d="M4 3.5v5h5" />
          <path d="m9 11 3-1.5 3 1.5v4l-3 1.5L9 15z" />
          <path d="m9 11 3 1.5 3-1.5M12 12.5v4" />
        </svg>
      </button>
    </div>
  </div>
</template>
