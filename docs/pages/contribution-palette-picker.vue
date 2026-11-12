<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

import { ref } from 'vue'
import {
  ContributionGraph3D,
  ContributionPalettePicker,
  useGitHubContributions,
} from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const palette = ref<'forest' | 'daylight' | 'midnight'>('forest')
const { days, loading } = useGitHubContributions({ username: 'torvalds' })
const siteTheme = useSiteTheme()

const snippets = [
  {
    lang: 'vue',
    code: "\u003cscript setup lang=\"ts\">\nimport { ref } from 'vue'\nimport { ContributionGraph3D, ContributionPalettePicker } from 'vue-contribution-graph-3d'\n\nconst palette = ref\u003c'forest' | 'daylight' | 'midnight'>('daylight')\n\u003c/script>\n\n\u003ctemplate>\n  \u003cContributionPalettePicker v-model=\"palette\" label=\"Palette de couleurs\" />\n  \u003cContributionGraph3D :data=\"days\" :palette=\"palette\" />\n\u003c/template>",
  },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">ContributionPalettePicker</h2>
    <p>
      A <code>v-model</code> fieldset with one button per built-in palette. The selected button gets
      the accent treatment, and each row shows a swatch in that palette's highlight color.
    </p>
    <div class="cg-doc-card">
      <ContributionPalettePicker v-model="palette" :theme="siteTheme" />
      <ContributionGraph3D
        class="palette-picker-preview"
        :data="days"
        :loading="loading"
        :palette="palette"
        :theme="siteTheme"
        height="300px"
      />
    </div>
    <h2 id="contribution-palette-picker-props" tabindex="-1">Props</h2>
    <div
      class="table-scroll"
      role="region"
      aria-labelledby="contribution-palette-picker-props"
      tabindex="0"
    >
      <table>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>modelValue</code></td>
            <td><code>PaletteName</code></td>
            <td>required</td>
            <td>The selected palette.</td>
          </tr>
          <tr>
            <td><code>label</code></td>
            <td><code>string</code></td>
            <td><code>'Color palette'</code></td>
            <td>Legend of the fieldset.</td>
          </tr>
          <tr>
            <td><code>palette</code></td>
            <td><code>string</code></td>
            <td><code>'forest'</code></td>
            <td>Chrome palette (independent of <code>modelValue</code>).</td>
          </tr>
          <tr>
            <td><code>theme</code></td>
            <td><code>string</code></td>
            <td><code>'auto'</code></td>
            <td>Light or dark chrome.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="tip custom-block">
      <p class="custom-block-title"><code>modelValue</code> vs <code>palette</code></p>
      <p>
        <code>modelValue</code> is <em>which palette is selected</em>. <code>palette</code> only
        styles the widget itself, exactly like every other component in the suite. You rarely need
        to set it separately.
      </p>
    </div>
    <h2 id="contribution-palette-picker-events" tabindex="-1">Events</h2>
    <div
      class="table-scroll"
      role="region"
      aria-labelledby="contribution-palette-picker-events"
      tabindex="0"
    >
      <table>
        <thead>
          <tr>
            <th scope="col">Event</th>
            <th scope="col">Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>update:modelValue</code></td>
            <td><code>palette: PaletteName</code></td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2 id="contribution-palette-picker-example" tabindex="-1">Example</h2>
    <CodeBlock :code="snippets[0].code" :title="snippets[0].lang" />
    <h2 id="contribution-palette-picker-accessibility" tabindex="-1">Accessibility</h2>
    <p>
      Rendered as a <code>&lt;fieldset&gt;</code> with a <code>&lt;legend&gt;</code>, and each
      option is a real button carrying <code>aria-pressed</code>, so screen readers announce
      &quot;Forest, pressed&quot;.
    </p>
  </div>
</template>
