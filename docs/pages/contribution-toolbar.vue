<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

import { ref } from 'vue'
import { ContributionToolbar, useGitHubContributions } from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const { username, days, loading } = useGitHubContributions({ username: 'torvalds' })
const siteTheme = useSiteTheme()
const lastAction = ref('nothing yet')

function onReplay() {
  lastAction.value = 'emitted replay'
}

function onReset() {
  lastAction.value = 'emitted reset'
}

const snippets = [
  {
    lang: 'vue',
    code: '\u003cContributionToolbar badge="torvalds" @replay="replay">\n  \u003cContributionYearTabs v-model="year" :years="years" />\n\u003c/ContributionToolbar>',
  },
  {
    lang: 'vue',
    code: '\u003cscript setup lang="ts">\nimport { ref } from \'vue\'\nimport { ContributionGraph3D, ContributionToolbar } from \'vue-contribution-graph-3d\'\n\nconst graph = ref\u003cInstanceType\u003ctypeof ContributionGraph3D> | null>(null)\n\u003c/script>\n\n\u003ctemplate>\n  \u003cContributionToolbar :disabled="loading" @replay="graph?.replay()" @reset="graph?.resetView()" />\n  \u003cContributionGraph3D ref="graph" :data="days" />\n\u003c/template>',
  },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">ContributionToolbar</h2>
    <p>
      A status pill on the left, two text buttons on the right. It has no idea what a graph is — it
      just emits <code>replay</code> and <code>reset</code>.
    </p>
    <div class="cg-doc-card">
      <ContributionToolbar
        :badge="`@${username} · ${days.length} cells`"
        :theme="siteTheme"
        :disabled="loading"
        @replay="onReplay"
        @reset="onReset"
      />
      <p class="mt-3 font-mono text-xs text-(--vp-c-text-2)">last event: {{ lastAction }}</p>
    </div>
    <h2 id="contribution-toolbar-props" tabindex="-1">Props</h2>
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
          <td><code>badge</code></td>
          <td><code>string</code></td>
          <td><code>'Sample activity'</code></td>
          <td>Text inside the status pill.</td>
        </tr>
        <tr>
          <td><code>replayLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Replay animation'</code></td>
          <td>Label of the first button.</td>
        </tr>
        <tr>
          <td><code>resetLabel</code></td>
          <td><code>string</code></td>
          <td><code>'Reset view'</code></td>
          <td>Label of the second button.</td>
        </tr>
        <tr>
          <td><code>disabled</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Disables both buttons (use while loading).</td>
        </tr>
        <tr>
          <td><code>palette</code></td>
          <td><code>string</code></td>
          <td><code>'forest'</code></td>
          <td>Sets <code>data-cg-palette</code> for token overrides.</td>
        </tr>
        <tr>
          <td><code>theme</code></td>
          <td><code>string</code></td>
          <td><code>'auto'</code></td>
          <td>Sets <code>data-cg-theme</code>.</td>
        </tr>
      </tbody>
    </table>
    <h2 id="contribution-toolbar-events" tabindex="-1">Events</h2>
    <table tabindex="0">
      <thead>
        <tr>
          <th>Event</th>
          <th>Payload</th>
          <th>Emitted when</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>replay</code></td>
          <td>—</td>
          <td>The first button is pressed.</td>
        </tr>
        <tr>
          <td><code>reset</code></td>
          <td>—</td>
          <td>The second button is pressed.</td>
        </tr>
      </tbody>
    </table>
    <h2 id="contribution-toolbar-slots" tabindex="-1">Slots</h2>
    <table tabindex="0">
      <thead>
        <tr>
          <th>Slot</th>
          <th>Fallback</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>badge</code></td>
          <td>The <code>badge</code> prop text.</td>
        </tr>
        <tr>
          <td>default</td>
          <td>Rendered between the pill and the buttons.</td>
        </tr>
      </tbody>
    </table>
    <p>
      The default slot is where extra controls belong — a year tab list, a palette picker, a switch:
    </p>
    <CodeBlock :code="snippets[0].code" :title="snippets[0].lang" />
    <h2 id="contribution-toolbar-wiring-it-to-the-graph" tabindex="-1">Wiring it to the graph</h2>
    <CodeBlock :code="snippets[1].code" :title="snippets[1].lang" />
    <h2 id="contribution-toolbar-accessibility" tabindex="-1">Accessibility</h2>
    <p>
      Both buttons are real <code>&lt;button&gt;</code> elements with visible focus rings and a
      disabled state, so they are reachable by keyboard and announced correctly. The pill is
      decorative text rather than a live region, because a status that changes on every animation
      would be noisy.
    </p>
  </div>
</template>
