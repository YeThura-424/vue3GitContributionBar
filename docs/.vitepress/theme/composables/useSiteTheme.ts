import { computed } from 'vue'
import { useData } from 'vitepress'

/**
 * The documentation site's appearance.
 *
 * Live demos in the markdown pages pass this to the components' `theme` prop.
 * VitePress's own `dark` class on `<html>` is the single source of truth.
 */
export function useSiteTheme() {
  const { isDark } = useData()
  return computed(() => (isDark.value ? 'dark' : 'light'))
}
