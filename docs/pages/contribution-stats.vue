<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

import { useContributionStats, useGitHubContributions } from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const { days } = useGitHubContributions({ username: 'torvalds' })
const stats = useContributionStats(() => days.value)
const siteTheme = useSiteTheme()

const snippets = [
  {
    lang: 'ts',
    code: 'interface ContributionStats {\n  total: number\n  activeDays: number\n  longestStreak: number\n  bestDay: ContributionDay | null\n}',
  },
  {
    lang: 'vue',
    code: '\u003cscript setup lang="ts">\nimport { ContributionStats, useContributionStats } from \'vue-contribution-graph-3d\'\n\nconst stats = useContributionStats(() => days.value)\n\u003c/script>\n\n\u003ctemplate>\n  \u003c!-- Pass the computed ref, the component reads the value -->\n  \u003cContributionStats :stats="stats" palette="midnight" />\n\n  \u003c!-- Or let it aggregate -->\n  \u003cContributionStats :data="days" />\n\u003c/template>',
  },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">ContributionStats</h2>
    <p>
      Four numbers under the graph: total contributions, active days, longest streak and best day.
    </p>
    <div class="cg-doc-card">
      <ContributionStats :stats="stats" :theme="siteTheme" />
    </div>
    <h2 id="contribution-stats-props" tabindex="-1">Props</h2>
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
          <td><code>data</code></td>
          <td><code>readonly ContributionDay[] | null</code></td>
          <td><code>null</code></td>
          <td>Aggregated on the fly. Ignored when <code>stats</code> is set.</td>
        </tr>
        <tr>
          <td><code>stats</code></td>
          <td><code>ContributionStats | null</code></td>
          <td><code>null</code></td>
          <td>Pre-computed numbers, e.g. from <code>useContributionStats</code>.</td>
        </tr>
        <tr>
          <td><code>palette</code></td>
          <td><code>string</code></td>
          <td><code>'forest'</code></td>
          <td>Accent color source.</td>
        </tr>
        <tr>
          <td><code>theme</code></td>
          <td><code>string</code></td>
          <td><code>'auto'</code></td>
          <td>Light or dark chrome.</td>
        </tr>
      </tbody>
    </table>
    <h2 id="contribution-stats-the-stats-object" tabindex="-1">The stats object</h2>
    <CodeBlock :code="snippets[0].code" :title="snippets[0].lang" />
    <p>
      Future days and neighbouring-year padding are excluded, so a year in progress reports honest
      numbers.
    </p>
    <h2 id="contribution-stats-slots" tabindex="-1">Slots</h2>
    <p>
      None — the four cells are the component. If you need different labels, build them from
      <code>useContributionStats</code> with your own markup; the accent and border tokens are the
      same.
    </p>
    <h2 id="contribution-stats-example" tabindex="-1">Example</h2>
    <CodeBlock :code="snippets[1].code" :title="snippets[1].lang" />
    <h2 id="contribution-stats-accessibility" tabindex="-1">Accessibility</h2>
    <p>
      Each cell is a labelled group with the label rendered as small uppercase text and an
      <code>sr-only</code> line that carries the detail (for example <em>on 2025-09-21</em> under
      the best day).
    </p>
  </div>
</template>
