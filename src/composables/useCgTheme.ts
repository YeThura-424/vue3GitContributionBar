import { computed, type ComputedRef } from 'vue'

import { resolveTheme } from '../themes'
import type { PaletteName, ThemeName } from '../types'

export interface CgThemeProps {
  palette?: PaletteName
  theme?: ThemeName | 'auto'
}

/**
 * Resolved chrome attributes shared by every component of the library.
 *
 * The returned object is meant to be spread on the component root:
 * `v-bind="cgAttrs"`, and drives the CSS variables declared in `style.css`.
 */
export function useCgTheme(props: CgThemeProps): {
  resolvedTheme: ComputedRef<ThemeName>
  cgAttrs: ComputedRef<{ 'data-cg-theme': ThemeName; 'data-cg-palette': PaletteName }>
} {
  const resolvedTheme = computed(() => resolveTheme(props.palette ?? 'forest', props.theme))

  const cgAttrs = computed(() => ({
    'data-cg-theme': resolvedTheme.value,
    'data-cg-palette': props.palette ?? 'forest',
  }))

  return { resolvedTheme, cgAttrs }
}
