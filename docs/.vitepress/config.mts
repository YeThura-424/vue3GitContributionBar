import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  title: 'Vue3DContributionGraph',
  description: 'Interactive 3D GitHub contribution graph for Vue 3, rendered with Three.js.',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#10160e' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vue3DContributionGraph' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'A Vue 3 component suite for an interactive 3D GitHub contribution graph.',
      },
    ],
  ],

  themeConfig: {
    siteTitle: false,
    nav: [
      { text: 'Guide', link: '/guide/introduction', activeMatch: '/guide/' },
      {
        text: 'Components',
        link: '/components/contribution-graph-3d',
        activeMatch: '/components/',
      },
      { text: 'Playground', link: '/playground/', activeMatch: '/playground/' },
      { text: 'API', link: '/api/composables', activeMatch: '/api/' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Installation', link: '/guide/installation' },
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Working with data', link: '/guide/data' },
          { text: 'Theming & palettes', link: '/guide/theming' },
          { text: 'Playground', link: '/playground/' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'ContributionGraph3D', link: '/components/contribution-graph-3d' },
          { text: 'ContributionToolbar', link: '/components/contribution-toolbar' },
          { text: 'ContributionLegend', link: '/components/contribution-legend' },
          { text: 'ContributionStats', link: '/components/contribution-stats' },
          { text: 'ContributionYearTabs', link: '/components/contribution-year-tabs' },
          {
            text: 'ContributionPalettePicker',
            link: '/components/contribution-palette-picker',
          },
          { text: 'ContributionUserForm', link: '/components/contribution-user-form' },
          { text: 'ContributionTooltip', link: '/components/contribution-tooltip' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'Composables', link: '/api/composables' },
          { text: 'Utilities & constants', link: '/api/utilities' },
        ],
      },
      {
        text: 'Community',
        items: [{ text: 'Contributing', link: '/guide/contributing' }],
      },
    ],

    search: {
      provider: 'local',
      options: { detailedView: true },
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Built with Vue 3, Three.js and VitePress',
    },
    docFooter: {
      prev: 'Previous page',
      next: 'Next page',
    },
    lastUpdatedText: 'Updated',
    returnToTopLabel: 'Back to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Theme',
    lightModeSwitchTitle: 'Switch to light theme',
    darkModeSwitchTitle: 'Switch to dark theme',
  },

  vite: {
    plugins: [tailwindcss()] as never,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./theme', import.meta.url)),
        'vue-contribution-graph-3d': fileURLToPath(
          new URL('../../src/index.ts', import.meta.url),
        ),
      },
    },
  },
})
