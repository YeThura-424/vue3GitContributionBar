<script setup lang="ts">
import { useCgTheme, type CgThemeProps } from '../composables/useCgTheme'

const props = withDefaults(
  defineProps<CgThemeProps & { type?: 'button' | 'submit' | 'reset'; disabled?: boolean }>(),
  { palette: 'forest', theme: 'auto', type: 'button', disabled: false },
)
const { cgAttrs } = useCgTheme(props)
</script>

<template>
  <button
    v-bind="cgAttrs"
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-1.5 rounded-[5px] border border-cg-border bg-cg-field px-2.5 py-1.5 font-cg-sans text-xs text-cg-text transition-colors hover:border-cg-accent hover:text-cg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cg-accent disabled:cursor-not-allowed disabled:opacity-50"
  >
    <slot />
  </button>
</template>
