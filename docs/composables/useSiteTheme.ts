import { ref, watch } from 'vue'
import type { ThemeName } from '../../src/types'
const theme = ref<ThemeName>(
  localStorage.getItem('contribution-docs-theme') === 'dark' ? 'dark' : 'light',
)
watch(
  theme,
  (value) => {
    document.documentElement.dataset.theme = value
    localStorage.setItem('contribution-docs-theme', value)
  },
  { immediate: true },
)
export function useSiteTheme() {
  return theme
}
