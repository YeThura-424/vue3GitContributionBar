<script setup lang="ts">
withDefaults(defineProps<{ name?: string }>(), { name: 'book' })
const paths: Record<string, string> = {
  book: 'M4 3h13a3 3 0 0 1 3 3v15H6a2 2 0 0 1-2-2V3Zm0 14h16M8 7h8M8 11h6',
  code: 'm8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 22',
  layers: 'm12 3 10 6-10 6L2 9l10-6Zm-10 12 10 6 10-6M2 12l10 6 10-6',
  settings: 'M4 7h16M4 17h16M8 4v6m8 4v6',
  home: 'm3 10 9-7 9 7v10H3V10Zm6 10v-7h6v7',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  external: 'M14 3h7v7m0-7L10 14M10 3H3v18h18v-7',
  moon: 'M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z',
  sun: 'M12 3V1m0 22v-2M3 12H1m22 0h-2M5 5 3 3m18 18-2-2M5 19l-2 2M21 3l-2 2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  check: 'm5 12 4 4L19 6',
  bars: 'M4 20V12h4v8m2 0V4h4v16m2 0V8h4v12M2 20h20',
  download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  rocket:
    'M14 5c2-2 5-2 7-2 0 2 0 5-2 7l-7 7-5-5 7-7ZM7 12H3l4-6h6m-1 11v4l6-4v-6M5 16l-2 5 5-2M16 7h.01',
  image: 'M3 3h18v18H3V3Zm0 14 6-6 4 4 3-3 5 5M16 7h.01',
  database:
    'M20 6c0 2-3.6 3-8 3S4 8 4 6s3.6-3 8-3 8 1 8 3Zm-16 0v12c0 2 3.6 3 8 3s8-1 8-3V6M4 12c0 2 3.6 3 8 3s8-1 8-3',
  palette:
    'M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 2-2c0-1-1-1.5-1-2.5S15 15 16 15h2a3 3 0 0 0 3-3 9 9 0 0 0-9-9ZM7 10h.01M10 6h.01M15 6h.01M18 10h.01',
  cube: 'm12 3 9 5v8l-9 5-9-5V8l9-5Zm-9 5 9 5 9-5m-9 5v8M8 5l9 5',
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  calendar: 'M3 5h18v16H3V5Zm4-3v6m10-6v6M3 11h18M7 15h3m4 0h3m-10 3h3',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2M8 17h8',
  tooltip: 'M4 3h16v13h-7l-5 5v-5H4V3Zm4 5h8m-8 4h5',
  puzzle:
    'M3 5h6V4a2 2 0 0 1 4 0v1h6v5h1a2 2 0 0 1 0 4h-1v7h-6v-1a2 2 0 0 0-4 0v1H3v-7h1a2 2 0 0 0 0-4H3V5Z',
  wrench: 'M21 7a6 6 0 0 1-8 6L5 21l-3-3 8-8a6 6 0 0 1 7-8l-4 4 4 4 4-4v1Z',
  contribute: 'M6 3v12a6 6 0 0 0 12 0v-3M6 9h8a4 4 0 0 0 4-4V3M4 3h4m8 0h4m-4 9h4',
}
</script>
<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] ?? paths.book" />
  </svg>
</template>
