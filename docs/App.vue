<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Component } from 'vue'
import { ContributionGraph3D, ContributionLegend, useSampleContributions } from '../src'
import { useSiteTheme } from './composables/useSiteTheme'
import DocSection from './DocSection.vue'
import DocIcon from './DocIcon.vue'
import Playground from './Playground.vue'
import pages from './pages.json'
import { version } from '../package.json'

const theme = useSiteTheme()
const mobileMenu = ref(false)
const current = ref(location.hash.slice(1) || 'overview')
const search = ref('')
const days = useSampleContributions(2025, 42)
const repo = 'https://github.com/YeThura-424/vue3GitContributionBar'
const modules = import.meta.glob('./pages/*.vue', { eager: true, import: 'default' }) as Record<
  string,
  Component
>
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
  component: modules[`./pages/${id}.vue`],
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
function navigate(id: string) {
  current.value = id
  mobileMenu.value = false
}
function syncHash() {
  const id = location.hash.slice(1)
  if (id) {
    navigate(id)
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
  }
}
let observer: IntersectionObserver | undefined
onMounted(() => {
  window.addEventListener('hashchange', syncHash)
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) current.value = entry.target.id
    },
    { rootMargin: '-15% 0px -70% 0px' },
  )
  document.querySelectorAll('main > section[id]').forEach((el) => observer?.observe(el))
  syncHash()
})
onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncHash)
  observer?.disconnect()
})
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header">
    <a href="#overview" class="brand" @click="navigate('overview')"
      ><span class="brand-mark"><DocIcon name="bars" /></span
      ><span
        >vue<span class="brand-light">contribution</span><span class="brand-dot">.</span></span
      ></a
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
      <a href="#overview" :class="{ active: current === 'overview' }" @click="navigate('overview')"
        ><DocIcon name="home" />Overview</a
      >
      <template v-for="group in groups" :key="group.id">
        <div class="sidebar-group-label">{{ group.label }}</div>
        <a
          v-for="page in filtered.filter((p) => p.group === group.id && p.id !== 'contributing')"
          :key="page.id"
          :href="`#${page.id}`"
          :class="{ active: current === page.id }"
          :aria-current="current === page.id ? 'location' : undefined"
          @click="navigate(page.id)"
          ><DocIcon :name="page.icon" />{{ page.title.replace('Contribution', '') }}</a
        >
        <a
          v-if="group.id === 'guide'"
          href="#playground"
          :class="{ active: current === 'playground' }"
          @click="navigate('playground')"
          ><DocIcon name="settings" />Playground<span class="new-tag">LIVE</span></a
        >
      </template>
      <p v-if="!filtered.length" class="search-empty" role="status">No matching documentation.</p>
      <a
        href="#contributing"
        :class="{ active: current === 'contributing' }"
        @click="navigate('contributing')"
        ><DocIcon :name="sidebarIcons.contributing" />Contributing</a
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
  <main id="main-content" class="main-content">
    <div class="breadcrumb">
      Documentation <span>/</span> Components <span>/</span><strong>Contribution graph</strong>
    </div>
    <section id="overview" class="hero">
      <div class="hero-copy">
        <div class="hero-badge"><span />VUE 3 COMPONENT LIBRARY</div>
        <h1>Small commits.<br /><span>A bigger picture.</span></h1>
        <p>
          Give your GitHub activity a new dimension. <br class="desktop-only" />Pick a palette, make
          it yours, and keep building.
        </p>
        <div class="hero-actions">
          <a href="#installation" class="primary-button" @click="navigate('installation')"
            >Get started <DocIcon name="arrow" /></a
          ><a href="#playground" class="secondary-button" @click="navigate('playground')"
            ><DocIcon name="settings" />Open playground</a
          >
        </div>
        <div class="hero-qualities">
          <span><DocIcon name="check" />Vue 3 + TypeScript</span
          ><span><DocIcon name="check" />Three.js</span
          ><span><DocIcon name="check" />MIT licensed</span>
        </div>
      </div>
      <div class="hero-showcase">
        <div class="showcase-caption"><span>A YEAR IN PERSPECTIVE</span><span>REAL 3D</span></div>
        <ContributionGraph3D
          :data="days"
          :theme="theme"
          palette="daylight"
          :animate="false"
          height="250px"
        /><ContributionLegend palette="daylight" :theme="theme" />
        <div class="showcase-foot">Drag to orbit. Scroll to explore.</div>
      </div>
    </section>
    <div class="feature-strip">
      <div>
        <DocIcon name="layers" /><span
          ><strong>Three distinctive palettes</strong><small>One consistent API</small></span
        >
      </div>
      <div>
        <DocIcon name="settings" /><span
          ><strong>Completely configurable</strong><small>Your data, colors & motion</small></span
        >
      </div>
      <div>
        <DocIcon name="check" /><span
          ><strong>Built for real apps</strong><small>Typed, accessible & composable</small></span
        >
      </div>
    </div>
    <DocSection
      v-for="page in sections.slice(0, 4)"
      :key="page.id"
      :id="page.id"
      :title="page.title"
      :content="page.component"
    />
    <section id="playground" class="docs-section">
      <div class="section-heading">
        <div>
          <div class="eyebrow">MAKE IT YOURS</div>
          <h2>The playground</h2>
          <p>Load a profile, tune the details, and take the code with you.</p>
        </div>
        <span class="count-tag">LIVE PREVIEW</span>
      </div>
      <Playground />
    </section>
    <DocSection
      v-for="page in sections.slice(4)"
      :key="page.id"
      :id="page.id"
      :title="page.title"
      :content="page.component"
    />
    <footer class="site-footer">
      <a class="brand footer-brand" href="#overview"
        >vuecontribution<span class="brand-dot">.</span></a
      ><span>Crafted by Ye Thura · Open source under MIT</span
      ><a :href="`${repo}/issues`" target="_blank" rel="noreferrer">Found an issue? ↗</a>
    </footer>
  </main>
</template>
