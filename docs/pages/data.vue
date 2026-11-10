<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

const snippets = [
  {
    lang: 'ts',
    code: 'interface ContributionDay {\n  date: string // "2025-09-21"\n  count: number // contributions that day\n  week: number // column index, 0 = first week of the year\n  weekday: number // row index, 0 = Sunday\n  isFuture: boolean // has not happened yet\n  isOutsideYear: boolean // padding from a neighbouring year\n}',
  },
  {
    lang: 'ts',
    code: "import { normalizeContributionData } from 'vue-contribution-graph-3d'\n\nconst days = normalizeContributionData(\n  [\n    { date: '2025-09-21', count: 4 },\n    { date: '2025-09-22', count: 9 },\n  ],\n  2025,\n)",
  },
  {
    lang: 'ts',
    code: "import { useGitHubContributions } from 'vue-contribution-graph-3d'\n\nconst {\n  username, // Ref\u003cstring>\n  year, // Ref\u003cstring>\n  years, // Ref\u003cstring[]>  newest first\n  days, // Ref\u003cContributionDay[]>\n  status, // Ref\u003c'idle' | 'loading' | 'success' | 'error'>\n  error, // Ref\u003cstring | null>\n  loading, // Ref\u003cboolean>\n  load, // (handle?: string) => Promise\u003cvoid>\n  setYear, // (year: string | number) => void\n  reload, // () => void\n} = useGitHubContributions({ username: () => 'torvalds' })",
  },
  {
    lang: 'vue',
    code: '\u003cContributionGraph3D :username="username" @error="(message) => (error = message)" />',
  },
  {
    lang: 'ts',
    code: "import { useContributionStats, computeStats } from 'vue-contribution-graph-3d'\n\nconst stats = useContributionStats(() => days.value)\n// { total, activeDays, longestStreak, bestDay }",
  },
  {
    lang: 'ts',
    code: "import { useSampleContributions } from 'vue-contribution-graph-3d'\n\nconst days = useSampleContributions(2025) // every day is in the past → full grid\nconst custom = useSampleContributions(2026, 42) // different seed",
  },
  {
    lang: 'ts',
    code: "import { normalizeContributionData, computeStats } from 'vue-contribution-graph-3d'\n\nconst payload = await fetch('/api/activity').then((r) => r.json())\nconst days = normalizeContributionData(payload.entries, 2025)\nconst stats = computeStats(days)",
  },
  { lang: 'ts', code: 'height = 0.24 + (log1p(count) / log1p(maxCount)) * (10.5 - 0.24)' },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">Working with data</h2>
    <h2 id="data-the-day-grid" tabindex="-1">The day grid</h2>
    <p>Every component consumes the same flat array of days:</p>
    <CodeBlock :code="snippets[0].code" :title="snippets[0].lang" />
    <p>
      Days are laid out Sunday-first in a rectangular grid. Padding days from December of the
      previous year and January of the next one are kept so the grid stays <code>weeks × 7</code> —
      they always carry <code>count: 0</code>.
    </p>
    <p>You rarely build this by hand:</p>
    <CodeBlock :code="snippets[1].code" :title="snippets[1].lang" />
    <h2 id="data-from-the-github-api" tabindex="-1">From the GitHub API</h2>
    <p>
      <code>useGitHubContributions</code> wraps the community
      <a href="https://github-contributions-api.jogruber.de/" target="_blank" rel="noreferrer"
        >github-contributions-api</a
      >
      endpoint, which needs no token and returns the whole history in one request.
    </p>
    <CodeBlock :code="snippets[2].code" :title="snippets[2].lang" />
    <h3 id="data-options" tabindex="-1">Options</h3>
    <table tabindex="0">
      <thead>
        <tr>
          <th>Option</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>username</code></td>
          <td><code>MaybeRefOrGetter</code></td>
          <td><code>''</code></td>
          <td>Reactive handle; <code>@</code> is stripped automatically.</td>
        </tr>
        <tr>
          <td><code>year</code></td>
          <td><code>MaybeRefOrGetter</code></td>
          <td>current</td>
          <td>Reactive year to display.</td>
        </tr>
        <tr>
          <td><code>autoLoad</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Fetch on creation and whenever the handle changes.</td>
        </tr>
        <tr>
          <td><code>fetchFn</code></td>
          <td><code>typeof fetch</code></td>
          <td>global</td>
          <td>Inject your own <code>fetch</code> (tests, proxies, mocks).</td>
        </tr>
      </tbody>
    </table>
    <p>
      If the requested year does not exist for that user, the newest available year is selected
      automatically. Stale responses are discarded, so typing quickly through a search box can never
      overwrite a newer result with an older one.
    </p>
    <h3 id="data-using-it-inside-contributiongraph3d" tabindex="-1">
      Using it inside <code>&lt;ContributionGraph3D /&gt;</code>
    </h3>
    <CodeBlock :code="snippets[3].code" :title="snippets[3].lang" />
    <p>
      The component creates the composable for you. Use the template-ref API when you also need the
      years in a <code>&lt;ContributionYearTabs /&gt;</code>.
    </p>
    <h2 id="data-aggregating-statistics" tabindex="-1">Aggregating statistics</h2>
    <CodeBlock :code="snippets[4].code" :title="snippets[4].lang" />
    <p>
      <code>computeStats</code> is the pure version if you do not want a <code>ComputedRef</code>.
      Future days and padding days are excluded, so a year in progress is never skewed by months
      that have not happened yet.
    </p>
    <h2 id="data-sample-data" tabindex="-1">Sample data</h2>
    <p>
      <code>useSampleContributions</code> produces a deterministic year — the same seed always
      yields the same grid, so demos and screenshots stay stable.
    </p>
    <CodeBlock :code="snippets[5].code" :title="snippets[5].lang" />
    <p>
      Because it is deterministic you can unit test against it, and it makes offline development
      possible.
    </p>
    <h2 id="data-your-own-source" tabindex="-1">Your own source</h2>
    <p>Anything that produces <code>{ date, count }</code> pairs works:</p>
    <CodeBlock :code="snippets[6].code" :title="snippets[6].lang" />
    <p>
      Then hand <code>days</code> to
      <code>&lt;ContributionGraph3D :data=&quot;days&quot; /&gt;</code> and <code>stats</code> to
      <code>&lt;ContributionStats :stats=&quot;stats&quot; /&gt;</code>.
    </p>
    <h2 id="data-height-scale" tabindex="-1">Height scale</h2>
    <p>Bars are scaled logarithmically so that quiet days stay visible:</p>
    <CodeBlock :code="snippets[7].code" :title="snippets[7].lang" />
    <ul>
      <li>
        <code>count === 0</code> renders a <code>0.1</code> tall placeholder instead of
        disappearing.
      </li>
      <li>The busiest day always reaches the full <code>10.5</code> units.</li>
      <li>
        The color level is bucketed independently: <code>0</code>, <code>1–3</code>,
        <code>4–7</code>, <code>8–13</code>, <code>14+</code>.
      </li>
    </ul>
    <p>
      Both functions are exported (<code>getBarHeight</code>, <code>getContributionLevel</code>) if
      you need to render the same values elsewhere — for example in a 2D fallback.
    </p>
  </div>
</template>
