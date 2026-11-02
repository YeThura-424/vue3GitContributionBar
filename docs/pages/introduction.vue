<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

import { ref } from 'vue'
import {
  ContributionGraph3D,
  ContributionLegend,
  useContributionStats,
  useGitHubContributions,
} from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const palette = ref<'forest' | 'daylight' | 'midnight'>('midnight')
const { days, loading } = useGitHubContributions({ username: 'torvalds' })
const stats = useContributionStats(() => days.value)
const siteTheme = useSiteTheme()

const snippets = [
  { lang: 'md', code: '\u003cContributionGraph3D :data="days" palette="forest" />' },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">Introduction</h2>
    <p>
      <strong>vue-contribution-graph-3d</strong> turns a year of GitHub activity into a small 3D
      city. Every day is a bar: quiet days stay flat, busy days tower over their neighbours, and the
      whole grid grows out of the ground when data arrives.
    </p>
    <p>
      It is a Vue 3 component suite, written in TypeScript, rendered with
      <a href="https://threejs.org/" target="_blank" rel="noreferrer">Three.js</a> and styled with
      <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">Tailwind CSS</a>.
    </p>
    <CodeBlock :code="snippets[0].code" :title="snippets[0].lang" />
    <p>
      That is the whole idea. Everything else in the package is optional chrome you can compose
      around it.
    </p>
    <h2 id="introduction-what-you-get" tabindex="-1">What you get</h2>
    <table tabindex="0">
      <thead>
        <tr>
          <th>Component</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>&lt;ContributionGraph3D /&gt;</code></td>
          <td>The WebGL scene: bars, camera, hover, grow animation.</td>
        </tr>
        <tr>
          <td><code>&lt;ContributionToolbar /&gt;</code></td>
          <td>Status pill plus <em>Replay animation</em> and <em>Reset view</em> buttons.</td>
        </tr>
        <tr>
          <td><code>&lt;ContributionLegend /&gt;</code></td>
          <td>Less → More intensity swatches.</td>
        </tr>
        <tr>
          <td><code>&lt;ContributionStats /&gt;</code></td>
          <td>Total, active days, longest streak and best day.</td>
        </tr>
        <tr>
          <td><code>&lt;ContributionYearTabs /&gt;</code></td>
          <td>Switch between the years returned by the API.</td>
        </tr>
        <tr>
          <td><code>&lt;ContributionPalettePicker /&gt;</code></td>
          <td>Pick between forest, daylight and midnight.</td>
        </tr>
        <tr>
          <td><code>&lt;ContributionUserForm /&gt;</code></td>
          <td>A labelled <code>@username</code> input with a submit button.</td>
        </tr>
        <tr>
          <td><code>&lt;ContributionTooltip /&gt;</code></td>
          <td>The hover card, or anything else you put in its slot.</td>
        </tr>
      </tbody>
    </table>
    <p>
      Alongside the components you get four composables — <code>useGitHubContributions</code>,
      <code>useContributionStats</code>, <code>useSampleContributions</code> and
      <code>useReducedMotion</code> — plus the underlying utilities
      (<code>normalizeContributionData</code>, <code>computeStats</code>, …) if you want to drive
      everything yourself.
    </p>
    <h2 id="introduction-a-live-example" tabindex="-1">A live example</h2>
    <p>
      The graph below is rendered by the real component with deterministic sample data, so it works
      without a network connection.
    </p>
    <div class="cg-doc-card">
      <ContributionGraph3D
        :data="days"
        :loading="loading"
        :palette="palette"
        :theme="siteTheme"
        :duration="2400"
      />
      <div class="mt-6 flex flex-wrap items-center justify-between gap-4">
        <ContributionLegend :palette="palette" :theme="siteTheme" />
        <div class="flex gap-2">
          <button
            v-for="option in ['forest', 'daylight', 'midnight']"
            :key="option"
            type="button"
            class="rounded border border-(--vp-c-divider) px-3 py-1 text-sm"
            :class="palette === option ? 'bg-(--vp-c-brand-soft)' : ''"
            @click="palette = option"
          >
            {{ option }}
          </button>
        </div>
      </div>
      <ContributionStats class="mt-6" :stats="stats" :palette="palette" :theme="siteTheme" />
    </div>
    <h2 id="introduction-design-goals" tabindex="-1">Design goals</h2>
    <ul>
      <li>
        <strong>Honest 3D.</strong> The height scale is logarithmic so a single contribution is
        still visible next to your busiest day. Nothing is faked with CSS transforms.
      </li>
      <li>
        <strong>No surprises in your CSS.</strong> The shipped stylesheet contains only
        <code>@theme</code> tokens and utilities, all namespaced with <code>cg-</code>. It never
        injects a reset and never touches a selector you did not ask for.
      </li>
      <li>
        <strong>Clean up after itself.</strong> The original demo never released GPU memory. This
        port disposes geometries, materials, textures, controls, observers and the animation frame
        on unmount.
      </li>
      <li>
        <strong>Respect the visitor.</strong> With <code>prefers-reduced-motion: reduce</code> the
        bars appear at their final height immediately instead of growing.
      </li>
    </ul>
    <h2 id="introduction-browser-support" tabindex="-1">Browser support</h2>
    <p>
      Anything with WebGL1 and <code>ResizeObserver</code>. Server-side rendering is supported: the
      component renders an empty container on the server and creates the Three.js scene only after
      it mounts.
    </p>
  </div>
</template>
