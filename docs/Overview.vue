<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ContributionGraph3D, ContributionLegend, useSampleContributions } from '../src'
import { useSiteTheme } from './composables/useSiteTheme'
import DocIcon from './DocIcon.vue'

const theme = useSiteTheme()
const days = useSampleContributions(2025, 42)
</script>

<template>
  <div>
    <section id="overview" class="hero">
      <div class="hero-copy">
        <div class="hero-badge"><span />VUE 3 COMPONENT LIBRARY</div>
        <h1>Small commits.<br /><span>A bigger picture.</span></h1>
        <p>
          Give your GitHub activity a new dimension. <br class="desktop-only" />Pick a palette, make
          it yours, and keep building.
        </p>
        <div class="hero-actions">
          <RouterLink to="/installation" class="primary-button"
            >Get started <DocIcon name="arrow" /></RouterLink
          ><RouterLink to="/playground" class="secondary-button"
            ><DocIcon name="settings" />Open playground</RouterLink
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
  </div>
</template>
