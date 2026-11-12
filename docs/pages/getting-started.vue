<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

import { computed, ref } from 'vue'
import {
  ContributionGraph3D,
  ContributionLegend,
  ContributionPalettePicker,
  ContributionStats,
  ContributionToolbar,
  ContributionYearTabs,
  useContributionStats,
  useGitHubContributions,
} from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const palette = ref<'forest' | 'daylight' | 'midnight'>('forest')
const animate = ref(true)
const loop = ref(false)

const { username, year, years, days, loading, setYear } = useGitHubContributions({
  username: 'torvalds',
})
const stats = useContributionStats(() => days.value)
const siteTheme = useSiteTheme()
const graph = ref<{ replay(): void; resetView(): void } | null>(null)

const badge = computed(() => `${username.value} · ${year.value}`)

const snippets = [
  {
    lang: 'vue',
    code: '\u003ctemplate>\n  \u003cContributionGraph3D username="torvalds" />\n\u003c/template>',
  },
  {
    lang: 'vue',
    code: '\u003cscript setup lang="ts">\nimport { ref } from \'vue\'\nimport { ContributionGraph3D, ContributionLegend } from \'vue-contribution-graph-3d\'\n\nconst username = ref(\'torvalds\')\n\u003c/script>\n\n\u003ctemplate>\n  \u003cContributionGraph3D :username="username" palette="daylight" />\n  \u003cContributionLegend palette="daylight" />\n\u003c/template>',
  },
  {
    lang: 'vue',
    code: "\u003cscript setup lang=\"ts\">\nimport { ref } from 'vue'\nimport type { ContributionGraph3D } from 'vue-contribution-graph-3d'\n\nconst graph = ref\u003cInstanceType\u003ctypeof ContributionGraph3D> | null>(null)\n\nasync function switchTo(user: string) {\n  await graph.value?.load(user)\n}\n\u003c/script>",
  },
  {
    lang: 'vue',
    code: '\u003cContributionGraph3D :username="username">\n  \u003c!-- Custom loading state -->\n  \u003ctemplate #loading>\n    \u003cdiv>Fetching contributions…\u003c/div>\n  \u003c/template>\n\n  \u003c!-- Shown when there is no data at all -->\n  \u003ctemplate #empty>\n    \u003cdiv>Nothing to show for {{ username }}.\u003c/div>\n  \u003c/template>\n\u003c/ContributionGraph3D>',
  },
  {
    lang: 'vue',
    code: '\u003cContributionGraph3D\n  :data="days"\n  @ready="console.log(\'scene mounted\')"\n  @loaded="(days) => console.log(days.length, \'days rendered\')"\n  @hover="(hit) => console.log(hit?.day.date ?? \'left the graph\')"\n  @error="(message) => console.warn(message)"\n/>',
  },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">Getting started</h2>
    <h2 id="getting-started-the-smallest-possible-graph" tabindex="-1">
      The smallest possible graph
    </h2>
    <CodeBlock :code="snippets[0].code" :title="snippets[0].lang" />
    <p>
      That is the whole component: it fetches the profile, shows a spinner while it loads, picks the
      newest year with activity, and disposes the WebGL scene when it unmounts.
    </p>
    <p>
      Already own the data? Pass an array of days through <code>data</code> instead — read
      <a href="#data">Working with data</a> for the exact format.
    </p>
    <h2 id="getting-started-load-a-real-profile" tabindex="-1">Load a real profile</h2>
    <p>Bind the handle to a <code>ref</code> when it comes from your own form:</p>
    <CodeBlock :code="snippets[1].code" :title="snippets[1].lang" />
    <p>
      The component owns the request, the loading spinner, the error state and the active year, and
      exposes them through a template ref:
    </p>
    <CodeBlock :code="snippets[2].code" :title="snippets[2].lang" />
    <div
      class="table-scroll"
      role="region"
      aria-labelledby="getting-started-load-a-real-profile"
      tabindex="0"
    >
      <table>
        <thead>
          <tr>
            <th scope="col">Exposed</th>
            <th scope="col">Type</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>years</code></td>
            <td><code>Ref&lt;string[]&gt;</code></td>
            <td>Available years, newest first.</td>
          </tr>
          <tr>
            <td><code>year</code></td>
            <td><code>Ref&lt;string&gt;</code></td>
            <td>The year currently rendered.</td>
          </tr>
          <tr>
            <td><code>setYear(year)</code></td>
            <td><code>(year: string | number) =&gt; void</code></td>
            <td>Switch the grid to another year.</td>
          </tr>
          <tr>
            <td><code>load(username)</code></td>
            <td><code>Promise&lt;void&gt;</code></td>
            <td>Fetch another profile.</td>
          </tr>
          <tr>
            <td><code>reload()</code></td>
            <td><code>() =&gt; void</code></td>
            <td>Re-fetch the current profile.</td>
          </tr>
          <tr>
            <td><code>status</code></td>
            <td><code>Ref&lt;ContributionStatus&gt;</code></td>
            <td>
              <code>idle</code>, <code>loading</code>, <code>success</code> or <code>error</code>.
            </td>
          </tr>
          <tr>
            <td><code>error</code></td>
            <td><code>Ref&lt;string | null&gt;</code></td>
            <td>Human readable failure message.</td>
          </tr>
          <tr>
            <td><code>replay()</code></td>
            <td><code>() =&gt; void</code></td>
            <td>Restart the grow animation.</td>
          </tr>
          <tr>
            <td><code>resetView()</code></td>
            <td><code>() =&gt; void</code></td>
            <td>Move the camera back to the default framing.</td>
          </tr>
          <tr>
            <td><code>ready</code></td>
            <td><code>Ref&lt;boolean&gt;</code></td>
            <td>The WebGL scene exists.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2 id="getting-started-a-complete-dashboard" tabindex="-1">A complete dashboard</h2>
    <p>Everything below is real, running code:</p>
    <div class="cg-doc-card">
      <ContributionToolbar
        :badge="badge"
        :palette="palette"
        :theme="siteTheme"
        :disabled="loading"
        @replay="graph?.replay()"
        @reset="graph?.resetView()"
      />
      <div class="mt-4">
        <ContributionGraph3D
          ref="graph"
          :data="days"
          :loading="loading"
          :palette="palette"
          :theme="siteTheme"
          :animate="animate"
          :loop="loop"
          :duration="2400"
        />
      </div>
      <div v-if="years.length" class="mt-4">
        <ContributionYearTabs
          :years="years"
          :model-value="year"
          :palette="palette"
          :theme="siteTheme"
          @update:model-value="setYear"
        />
      </div>
      <ContributionStats class="mt-6" :stats="stats" :palette="palette" :theme="siteTheme" />
      <div class="mt-6 flex flex-wrap items-end justify-between gap-6">
        <ContributionLegend :palette="palette" :theme="siteTheme" />
        <ContributionPalettePicker v-model="palette" :palette="palette" :theme="siteTheme" />
      </div>
    </div>
    <h3 id="getting-started-what-the-pieces-do" tabindex="-1">What the pieces do</h3>
    <ul>
      <li>
        <strong><code>ContributionToolbar</code></strong> forwards <code>replay</code> and
        <code>reset</code> to the scene through the template ref.
      </li>
      <li>
        <strong><code>ContributionYearTabs</code></strong> is a <code>v-model</code> component —
        bind it to the year your data source uses.
      </li>
      <li>
        <strong><code>ContributionPalettePicker</code></strong> is also a
        <code>v-model</code> component; the selected value feeds every other widget through the
        shared <code>palette</code> prop.
      </li>
      <li>
        <strong><code>ContributionStats</code></strong> accepts either
        <code>:data</code> (aggregates on the fly) or <code>:stats</code> (pre-aggregated by
        <code>useContributionStats</code>).
      </li>
    </ul>
    <h2 id="getting-started-slots" tabindex="-1">Slots</h2>
    <p>Every component accepts slots for the parts you may want to replace.</p>
    <CodeBlock :code="snippets[3].code" :title="snippets[3].lang" />
    <p>
      <code>&lt;ContributionGraph3D /&gt;</code> also renders whatever you put in its default slot
      on top of the canvas, and <code>&lt;ContributionTooltip /&gt;</code> exposes
      <code>count</code>, <code>date</code> and <code>rawCount</code> to its default slot.
    </p>
    <h2 id="getting-started-events" tabindex="-1">Events</h2>
    <CodeBlock :code="snippets[4].code" :title="snippets[4].lang" />
    <h2 id="getting-started-controls" tabindex="-1">Controls</h2>
    <div class="table-scroll" role="region" aria-labelledby="getting-started-controls" tabindex="0">
      <table>
        <thead>
          <tr>
            <th scope="col">Input</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Drag</td>
            <td>Orbit around the grid.</td>
          </tr>
          <tr>
            <td>Scroll / pinch</td>
            <td>Zoom in and out.</td>
          </tr>
          <tr>
            <td>Hover a bar</td>
            <td>Highlight it and show the tooltip.</td>
          </tr>
          <tr>
            <td>Right-drag</td>
            <td>Pan the camera target.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      Keyboard users can tab past the graph to the surrounding controls; the canvas itself is marked
      <code>aria-hidden</code> because the month and weekday labels are exposed as screen-reader
      text instead.
    </p>
  </div>
</template>
