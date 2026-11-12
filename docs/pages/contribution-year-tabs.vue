<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

import { ContributionYearTabs, useGitHubContributions } from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const { years, year, days, loading, setYear } = useGitHubContributions({
  username: 'torvalds',
})
const siteTheme = useSiteTheme()

const snippets = [
  {
    lang: 'vue',
    code: '\u003cscript setup lang="ts">\nimport { ref } from \'vue\'\nimport { ContributionGraph3D, ContributionYearTabs } from \'vue-contribution-graph-3d\'\n\nconst graph = ref\u003cInstanceType\u003ctypeof ContributionGraph3D> | null>(null)\n\u003c/script>\n\n\u003ctemplate>\n  \u003cContributionYearTabs\n    :years="graph?.years.value ?? []"\n    :model-value="graph?.year.value ?? \'\'"\n    @update:model-value="graph?.setYear($event)"\n  />\n  \u003cContributionGraph3D ref="graph" :username="username" />\n\u003c/template>',
  },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">ContributionYearTabs</h2>
    <p>
      A <code>v-model</code> tab list for the years a profile has activity in. Pair it with the
      <code>years</code> and <code>year</code> refs exposed by
      <code>&lt;ContributionGraph3D /&gt;</code>.
    </p>
    <div class="cg-doc-card">
      <ContributionYearTabs
        v-if="years.length"
        :years="years"
        :model-value="year"
        :theme="siteTheme"
        @update:model-value="setYear"
      />
      <p v-else class="font-mono text-xs text-(--vp-c-text-2)">loading years…</p>
      <p class="mt-3 font-mono text-xs text-(--vp-c-text-2)">
        selected: {{ year }} · {{ days.length }} cells<template v-if="loading">
          · loading…</template
        >
      </p>
    </div>
    <h2 id="contribution-year-tabs-props" tabindex="-1">Props</h2>
    <div
      class="table-scroll"
      role="region"
      aria-labelledby="contribution-year-tabs-props"
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
            <td><code>number | string</code></td>
            <td>required</td>
            <td>The selected year.</td>
          </tr>
          <tr>
            <td><code>years</code></td>
            <td><code>Array&lt;number | string&gt;</code></td>
            <td>required</td>
            <td>Years to render, in the order you pass them.</td>
          </tr>
          <tr>
            <td><code>label</code></td>
            <td><code>string</code></td>
            <td><code>'Contribution years'</code></td>
            <td>Accessible name of the tab list.</td>
          </tr>
          <tr>
            <td><code>palette</code></td>
            <td><code>string</code></td>
            <td><code>'forest'</code></td>
            <td>Sets <code>data-cg-palette</code>.</td>
          </tr>
          <tr>
            <td><code>theme</code></td>
            <td><code>string</code></td>
            <td><code>'auto'</code></td>
            <td>Sets <code>data-cg-theme</code>.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2 id="contribution-year-tabs-events" tabindex="-1">Events</h2>
    <div
      class="table-scroll"
      role="region"
      aria-labelledby="contribution-year-tabs-events"
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
            <td><code>year: number | string</code></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>Clicking the already selected year emits nothing.</p>
    <h2 id="contribution-year-tabs-example" tabindex="-1">Example</h2>
    <CodeBlock :code="snippets[0].code" :title="snippets[0].lang" />
    <p>
      Or keep the year in your own state and feed it to both, which is what the playground does.
    </p>
    <h2 id="contribution-year-tabs-accessibility" tabindex="-1">Accessibility</h2>
    <p>
      Rendered as <code>role=&quot;tablist&quot;</code> with one
      <code>role=&quot;tab&quot;</code> button per year. The selected tab carries
      <code>aria-selected=&quot;true&quot;</code> and every tab is in the natural tab order, so
      arrow-key semantics can be added on top later without changing the markup.
    </p>
  </div>
</template>
