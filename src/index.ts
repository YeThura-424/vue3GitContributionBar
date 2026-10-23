import type { App, Plugin } from 'vue'

import './style.css'

import ContributionAnimationControls from './components/ContributionAnimationControls.vue'
import ContributionButton from './components/ContributionButton.vue'
import ContributionGraph3D from './components/ContributionGraph3D.vue'
import ContributionLegend from './components/ContributionLegend.vue'
import ContributionPalettePicker from './components/ContributionPalettePicker.vue'
import ContributionStats from './components/ContributionStats.vue'
import ContributionToolbar from './components/ContributionToolbar.vue'
import ContributionTooltip from './components/ContributionTooltip.vue'
import ContributionUserForm from './components/ContributionUserForm.vue'
import ContributionYearTabs from './components/ContributionYearTabs.vue'

export { default as ContributionAnimationControls } from './components/ContributionAnimationControls.vue'
export { default as ContributionButton } from './components/ContributionButton.vue'
export { default as ContributionGraph3D } from './components/ContributionGraph3D.vue'
export { default as ContributionLegend } from './components/ContributionLegend.vue'
export { default as ContributionPalettePicker } from './components/ContributionPalettePicker.vue'
export { default as ContributionStats } from './components/ContributionStats.vue'
export { default as ContributionToolbar } from './components/ContributionToolbar.vue'
export { default as ContributionTooltip } from './components/ContributionTooltip.vue'
export { default as ContributionUserForm } from './components/ContributionUserForm.vue'
export { default as ContributionYearTabs } from './components/ContributionYearTabs.vue'

export { ContributionScene } from './three/ContributionScene'
export type {
  ContributionSceneOptions,
  SceneHover,
  SceneHoverListener,
} from './three/ContributionScene'
export { GrowthAnimator, easeOutCubic } from './three/growth'
export type { GrowthAnimatorOptions, GrowthBlock } from './three/growth'

export {
  GITHUB_CONTRIBUTIONS_API,
  fetchContributions,
  useGitHubContributions,
} from './composables/useGitHubContributions'
export type {
  ContributionStatus,
  UseGitHubContributionsOptions,
} from './composables/useGitHubContributions'
export { useContributionStats } from './composables/useContributionStats'
export { useCgTheme } from './composables/useCgTheme'
export type { CgThemeProps } from './composables/useCgTheme'
export { useReducedMotion } from './composables/useReducedMotion'
export { useSampleContributions } from './composables/useSampleContributions'

export * from './constants'
export * from './themes'
export * from './types'
export { formatMonth, formatDate } from './utils/format'
export { getBarHeight, getContributionLevel, getMaxContributionCount } from './utils/levels'
export {
  getWeeksForYear,
  normalizeContributionData,
  startOfDay,
  startOfWeek,
  toLocalDateKey,
} from './utils/normalize'
export { buildSampleContributions, mulberry32 } from './utils/sample'
export { computeStats } from './utils/stats'

const components = {
  ContributionButton,
  ContributionAnimationControls,
  ContributionGraph3D,
  ContributionLegend,
  ContributionPalettePicker,
  ContributionStats,
  ContributionToolbar,
  ContributionTooltip,
  ContributionUserForm,
  ContributionYearTabs,
} as const

/**
 * Registers every component globally.
 *
 * ```ts
 * app.use(VueContributionGraph3D)
 * ```
 */
export const VueContributionGraph3D: Plugin = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  },
}

export default VueContributionGraph3D
