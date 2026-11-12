<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

const snippets = [
  {
    lang: 'ts',
    code: "import { useGitHubContributions } from 'vue-contribution-graph-3d'\n\nconst {\n  username, // Ref\u003cstring>   — normalized handle, `@` stripped\n  year, // Ref\u003cstring>   — active year\n  years, // Ref\u003cstring[]>  — available years, newest first\n  totals, // Ref\u003cRecord\u003cstring, number>> — per-year totals\n  days, // Ref\u003cContributionDay[]> — grid for the active year\n  payload, // Ref\u003cGitHubContributionsPayload | null>\n  status, // Ref\u003cContributionStatus>\n  error, // Ref\u003cstring | null>\n  loading, // Ref\u003cboolean>\n  load, // (handle?: string) => Promise\u003cvoid>\n  setYear, // (year: number | string) => void\n  reload, // () => void\n} = useGitHubContributions({\n  username: () => username.value,\n  year: () => year.value,\n})",
  },
  {
    lang: 'ts',
    code: 'const stats = useContributionStats(() => days.value)\n// ComputedRef\u003c{ total, activeDays, longestStreak, bestDay }>',
  },
  {
    lang: 'ts',
    code: 'const days = useSampleContributions(2025) // ComputedRef\u003cContributionDay[]>\nconst other = useSampleContributions(() => year.value, 42) // custom seed',
  },
  { lang: 'ts', code: 'const reduced = useReducedMotion() // Ref\u003cboolean>' },
  { lang: 'ts', code: 'const { resolvedTheme, cgAttrs } = useCgTheme(props)' },
  { lang: 'vue', code: '\u003cdiv v-bind="cgAttrs">…\u003c/div>' },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">Composables</h2>
    <p>
      All four composables are plain functions. They work inside <code>setup()</code>, but none of
      them require a component scope, so you can also use them in tests or in a Pinia store.
    </p>
    <h2 id="composables-usegithubcontributions" tabindex="-1">
      <code>useGitHubContributions</code>
    </h2>
    <p>
      Reactive state around the community GitHub contributions API
      (<code>https://github-contributions-api.jogruber.de/v4/{user}?y=all</code>). No token
      required.
    </p>
    <CodeBlock :code="snippets[0].code" :title="snippets[0].lang" />
    <h3 id="composables-options" tabindex="-1">Options</h3>
    <div class="table-scroll" role="region" aria-labelledby="composables-options" tabindex="0">
      <table>
        <thead>
          <tr>
            <th scope="col">Option</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>username</code></td>
            <td><code>MaybeRefOrGetter&lt;string&gt;</code></td>
            <td><code>''</code></td>
            <td>Reactive handle; loads as soon as it is set.</td>
          </tr>
          <tr>
            <td><code>year</code></td>
            <td><code>MaybeRefOrGetter&lt;number | string&gt;</code></td>
            <td>current year</td>
            <td>Reactive year to display.</td>
          </tr>
          <tr>
            <td><code>autoLoad</code></td>
            <td><code>boolean</code></td>
            <td><code>true</code></td>
            <td>Fetch immediately and when the handle changes.</td>
          </tr>
          <tr>
            <td><code>fetchFn</code></td>
            <td><code>typeof fetch</code></td>
            <td>global</td>
            <td>Inject <code>fetch</code> for tests, proxies or caching.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h3 id="composables-behaviour" tabindex="-1">Behaviour</h3>
    <ul>
      <li>
        The requested year is validated against the response; if it does not exist, the newest
        available year is selected automatically.
      </li>
      <li>
        Concurrent requests are guarded by a request id and an <code>AbortController</code>, so a
        slow response can never overwrite a newer one.
      </li>
      <li>
        Failures set <code>status = 'error'</code> and a human-readable <code>error</code> —
        <code>User not found.</code> for a 404, <code>Request failed.</code> otherwise.
      </li>
    </ul>
    <h2 id="composables-usecontributionstats" tabindex="-1"><code>useContributionStats</code></h2>
    <CodeBlock :code="snippets[1].code" :title="snippets[1].lang" />
    <p>
      Wraps <a href="#utilities"><code>computeStats</code></a
      >. Returns zeros for an empty or missing array instead of throwing.
    </p>
    <h2 id="composables-usesamplecontributions" tabindex="-1">
      <code>useSampleContributions</code>
    </h2>
    <CodeBlock :code="snippets[2].code" :title="snippets[2].lang" />
    <p>
      Deterministic sample year — the same arguments always produce the same grid. Every day that
      has not happened yet stays empty, so the graph is never filled with future activity.
    </p>
    <h2 id="composables-usereducedmotion" tabindex="-1"><code>useReducedMotion</code></h2>
    <CodeBlock :code="snippets[3].code" :title="snippets[3].lang" />
    <p>
      Tracks <code>prefers-reduced-motion: reduce</code> and updates live. Returns
      <code>false</code> immediately when <code>window.matchMedia</code> is unavailable (SSR), and
      unsubscribes when the current scope is disposed.
    </p>
    <div class="tip custom-block">
      <p class="custom-block-title">You rarely need this one</p>
      <p>
        <code>&lt;ContributionGraph3D /&gt;</code> calls it internally and hands the value to the
        scene, which then renders final bar heights instead of growing them.
      </p>
    </div>
    <h2 id="composables-usecgtheme" tabindex="-1"><code>useCgTheme</code></h2>
    <p>The internal helper every component uses to resolve and apply its chrome attributes:</p>
    <CodeBlock :code="snippets[4].code" :title="snippets[4].lang" /><CodeBlock
      :code="snippets[5].code"
      :title="snippets[5].lang"
    />
    <p>
      <code>cgAttrs</code> is a computed object containing <code>data-cg-theme</code> and
      <code>data-cg-palette</code>. Exported so that custom components can opt into the same token
      layer.
    </p>
  </div>
</template>
