import type { PaletteName, ThemeName } from './types'

/**
 * Bar colors per intensity level, ordered from quietest to most active.
 */
export const THEME_PALETTES: Record<PaletteName, readonly string[]> = {
  forest: ['#233d2d', '#086338', '#0d9651', '#34cd72', '#aff69d'],
  daylight: ['#d7dfc8', '#abc886', '#83ad5b', '#588838', '#346426'],
  midnight: ['#28263d', '#514074', '#7855b1', '#a47ce0', '#d6bafa'],
}

/**
 * Three.js scene background for each palette.
 */
export const THEME_SCENE_COLORS: Record<PaletteName, string> = {
  forest: '#0b1714',
  daylight: '#e8eddf',
  midnight: '#0c1020',
}

/**
 * Chrome theme that matches each palette out of the box.
 */
export const PALETTE_THEME: Record<PaletteName, ThemeName> = {
  forest: 'dark',
  daylight: 'light',
  midnight: 'dark',
}

/**
 * Human readable palette names.
 */
export const PALETTE_LABELS: Record<PaletteName, string> = {
  forest: 'Forest',
  daylight: 'Daylight',
  midnight: 'Midnight',
}

/**
 * All built-in palette names, in the order they are offered to users.
 */
export const PALETTE_NAMES = [
  'forest',
  'daylight',
  'midnight',
] as const satisfies readonly PaletteName[]

/**
 * Resolve the chrome theme for a palette unless one is forced explicitly.
 *
 * Unknown palette names (added at runtime) fall back to the dark chrome.
 */
export function resolveTheme(palette: PaletteName | string, theme?: ThemeName | 'auto'): ThemeName {
  if (theme === 'dark' || theme === 'light') return theme
  return PALETTE_THEME[palette as PaletteName] ?? 'dark'
}

/**
 * Colors of a palette, falling back to `forest` for unknown names.
 *
 * Passing `palette="sunset"` before adding the entry would otherwise throw
 * inside the WebGL scene, so every lookup goes through here.
 */
export function getPaletteColors(palette: PaletteName | string): readonly string[] {
  return THEME_PALETTES[palette as PaletteName] ?? THEME_PALETTES.forest
}

/**
 * Scene background of a palette, falling back to `forest`.
 */
export function getSceneColor(palette: PaletteName | string): string {
  return THEME_SCENE_COLORS[palette as PaletteName] ?? THEME_SCENE_COLORS.forest
}
