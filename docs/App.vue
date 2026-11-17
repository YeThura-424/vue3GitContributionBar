<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useSiteTheme } from './composables/useSiteTheme'
import DocIcon from './DocIcon.vue'
import DocSection from './DocSection.vue'
import pages from './pages.json'
import { version } from '../package.json'

const theme = useSiteTheme()
const mobileMenu = ref(false)
const route = useRoute()
const current = computed(() => route.name)
const currentTitle = computed(() => route.meta.title || 'Overview')
const currentGroup = computed(() => groups.find((group) => group.id === route.meta.group)?.label)
const search = ref('')
const repo = 'https://github.com/YeThura-424/vue3GitContributionBar'
const order = [
  'introduction',
  'installation',
  'getting-started',
  'previews',
  'data',
  'theming',
  'contribution-graph-3d',
  'contribution-toolbar',
  'contribution-legend',
  'contribution-stats',
  'contribution-year-tabs',
  'contribution-palette-picker',
  'contribution-user-form',
  'contribution-tooltip',
  'composables',
  'utilities',
  'contributing',
]
const sidebarIcons: Record<string, string> = {
  introduction: 'book',
  installation: 'download',
  'getting-started': 'rocket',
  previews: 'image',
  data: 'database',
  theming: 'palette',
  'contribution-graph-3d': 'cube',
  'contribution-toolbar': 'settings',
  'contribution-legend': 'list',
  'contribution-stats': 'bars',
  'contribution-year-tabs': 'calendar',
  'contribution-palette-picker': 'palette',
  'contribution-user-form': 'user',
  'contribution-tooltip': 'tooltip',
  composables: 'puzzle',
  utilities: 'wrench',
  contributing: 'contribute',
}
const sections = order.map((id) => ({
  ...pages.find((p) => p.id === id)!,
  icon: sidebarIcons[id],
}))
const groups = [
  { id: 'guide', label: 'GET STARTED' },
  { id: 'components', label: 'COMPONENTS' },
  { id: 'api', label: 'API REFERENCE' },
]
const filtered = computed(() =>
  sections.filter((p) =>
    `${p.title} ${p.search}`.toLowerCase().includes(search.value.toLowerCase()),
  ),
)
function focusContent() {
  document.getElementById('main-content')?.focus()
}

watch(
  () => route.fullPath,
  () => {
    mobileMenu.value = false
  },
)
</script>

<template>
  <a class="skip-link" href="#main-content" @click.prevent="focusContent">Skip to content</a>
  <header class="site-header">
    <RouterLink to="/overview" class="brand"
      ><span class="brand-mark"><DocIcon name="bars" /></span
      ><span
        >vue<span class="brand-light">contribution</span><span class="brand-dot">.</span></span
      ></RouterLink
    >
    <span class="header-divider" /><span class="header-label">Documentation</span
    ><span class="version-tag">v{{ version }}</span>
    <div class="header-actions">
      <a class="github-link" :href="repo" target="_blank" rel="noreferrer"
        >View on GitHub <DocIcon name="external"
      /></a>
      <button
        class="icon-button"
        :aria-label="theme === 'light' ? 'Use dark theme' : 'Use light theme'"
        @click="theme = theme === 'light' ? 'dark' : 'light'"
      >
        <DocIcon :name="theme === 'light' ? 'moon' : 'sun'" />
      </button>
      <button
        class="icon-button mobile-menu-button"
        aria-controls="sidebar"
        :aria-expanded="mobileMenu"
        aria-label="Toggle documentation menu"
        @click="mobileMenu = !mobileMenu"
      >
        <DocIcon name="menu" />
      </button>
    </div>
  </header>
  <button
    v-if="mobileMenu"
    class="sidebar-backdrop"
    aria-label="Close documentation menu"
    @click="mobileMenu = false"
  />
  <aside
    id="sidebar"
    class="sidebar"
    :class="{ open: mobileMenu }"
    @keydown.esc="mobileMenu = false"
  >
    <label class="search-label"
      ><span class="sr-only">Search documentation</span
      ><input v-model="search" type="search" placeholder="Search documentation…"
    /></label>
    <nav aria-label="Documentation sections">
      <RouterLink to="/overview" :class="{ active: current === 'overview' }"
        ><DocIcon name="home" />Overview</RouterLink
      >
      <template v-for="group in groups" :key="group.id">
        <div class="sidebar-group-label">{{ group.label }}</div>
        <RouterLink
          v-for="page in filtered.filter((p) => p.group === group.id && p.id !== 'contributing')"
          :key="page.id"
          :to="`/${page.id}`"
          :class="{ active: current === page.id }"
          ><DocIcon :name="page.icon" />{{ page.title.replace('Contribution', '') }}</RouterLink
        >
        <RouterLink
          v-if="group.id === 'guide'"
          to="/playground"
          :class="{ active: current === 'playground' }"
          ><DocIcon name="settings" />Playground<span class="new-tag">LIVE</span></RouterLink
        >
      </template>
      <p v-if="!filtered.length" class="search-empty" role="status">No matching documentation.</p>
      <RouterLink to="/contributing" :class="{ active: current === 'contributing' }"
        ><DocIcon :name="sidebarIcons.contributing" />Contributing</RouterLink
      >
    </nav>
    <div class="sidebar-note">
      <span class="note-icon"><DocIcon name="code" /></span
      ><strong>Built for your next idea.</strong>
      <p>Open source. Vue native.<br />Yours to make your own.</p>
      <a :href="repo" target="_blank" rel="noreferrer">Explore the source →</a>
    </div>
    <div class="sidebar-footer"><span class="status-dot" />Made with Vue 3 & TypeScript</div>
  </aside>
  <main id="main-content" class="main-content" tabindex="-1">
    <div class="breadcrumb">
      Documentation <span>/</span>
      <template v-if="currentGroup">{{ currentGroup }} <span>/</span></template>
      <strong>{{ currentTitle }}</strong>
    </div>
    <RouterView v-slot="{ Component }">
      <DocSection
        v-if="route.meta.document && Component"
        :id="String(route.name)"
        :title="String(currentTitle)"
        :content="Component"
      />
      <component :is="Component" v-else />
    </RouterView>
    <footer class="site-footer">
      <RouterLink class="brand footer-brand" to="/overview"
        >vuecontribution<span class="brand-dot">.</span></RouterLink
      ><span>Crafted by Ye Thura · Open source under MIT</span
      ><a :href="`${repo}/issues`" target="_blank" rel="noreferrer">Found an issue? ↗</a>
    </footer>
  </main>
</template>
