<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

import { ref } from 'vue'
import { ContributionLegend, PALETTE_LABELS, PALETTE_NAMES } from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const palette = ref<'forest' | 'daylight' | 'midnight'>('forest')
const siteTheme = useSiteTheme()

const snippets = [
  {
    lang: 'vue',
    code: '\u003cContributionLegend palette="midnight" less-label="Weniger" more-label="Mehr" />\n\n\u003c!-- Compact, for a tight toolbar -->\n\u003cContributionLegend :show-labels="false" />',
  },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">ContributionLegend</h2>
    <p>
      The five intensity swatches with <em>Less</em> and <em>More</em> captions. Swatch colors come
      from the palette's CSS variables, so the legend follows the graph without any prop drilling.
    </p>
    <div class="cg-doc-card">
      <div class="mb-4 flex flex-wrap gap-2">
        <button
          v-for="option in PALETTE_NAMES"
          :key="option"
          type="button"
          class="rounded border border-(--vp-c-divider) px-3 py-1 text-sm"
          :class="palette === option ? 'bg-(--vp-c-brand-soft)' : ''"
          @click="palette = option"
        >
          {{ PALETTE_LABELS[option] }}
        </button>
      </div>
      <ContributionLegend :palette="palette" :theme="siteTheme" />
    </div>
    <h2 id="contribution-legend-props" tabindex="-1">Props</h2>
    <table tabindex="0">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>palette</code></td>
          <td><code>string</code></td>
          <td><code>'forest'</code></td>
          <td>Which ramp the swatches show.</td>
        </tr>
        <tr>
          <td><code>theme</code></td>
          <td><code>string</code></td>
          <td><code>'auto'</code></td>
          <td><code>dark</code>, <code>light</code> or palette-derived.</td>
        </tr>
        <tr>
          <td><code>showLabels</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Render the <code>Less</code> / <code>More</code> captions.</td>
        </tr>
        <tr>
          <td><code>lessLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Less'</code></td>
          <td>Left caption — translate it here.</td>
        </tr>
        <tr>
          <td><code>moreLabel</code></td>
          <td><code>string</code></td>
          <td><code>'More'</code></td>
          <td>Right caption.</td>
        </tr>
      </tbody>
    </table>
    <h2 id="contribution-legend-slots" tabindex="-1">Slots</h2>
    <p>None. The captions are props so that localization needs no scoped slots.</p>
    <h2 id="contribution-legend-example" tabindex="-1">Example</h2>
    <CodeBlock :code="snippets[0].code" :title="snippets[0].lang" />
    <p>
      The root carries <code>aria-label=&quot;Contribution intensity legend&quot;</code> and each
      swatch is <code>aria-hidden</code>, so screen readers get one short description instead of
      five empty boxes.
    </p>
  </div>
</template>
