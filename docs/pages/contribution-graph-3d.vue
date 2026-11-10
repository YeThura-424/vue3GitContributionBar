<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

import { ref } from 'vue'
import {
  ContributionGraph3D,
  ContributionLegend,
  useGitHubContributions,
} from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const { username, year, days, loading } = useGitHubContributions({ username: 'torvalds' })
const graph = ref<{ replay(): void; resetView(): void } | null>(null)
const lastHover = ref<string>('—')
const siteTheme = useSiteTheme()

function onHover(hit: { day: { date: string; count: number } } | null) {
  lastHover.value = hit ? `${hit.day.date} · ${hit.day.count}` : '—'
}

const snippets = [
  {
    lang: 'ts',
    code: 'interface ContributionHover {\n  day: ContributionDay\n  level: number // 0-4 intensity\n  x: number // CSS pixels inside the container\n  y: number\n}',
  },
  { lang: 'vue', code: '\u003cContributionGraph3D ref="graph" :username="username" />' },
  {
    lang: 'vue',
    code: '\u003cscript setup lang="ts">\nimport { ref } from \'vue\'\nimport { ContributionGraph3D, ContributionYearTabs } from \'vue-contribution-graph-3d\'\n\nconst username = ref(\'torvalds\')\nconst graph = ref\u003cInstanceType\u003ctypeof ContributionGraph3D> | null>(null)\n\u003c/script>\n\n\u003ctemplate>\n  \u003cContributionGraph3D\n    ref="graph"\n    :username="username"\n    @error="(message) => console.error(message)"\n  />\n\n  \u003cContributionYearTabs\n    v-if="graph?.years?.value?.length"\n    :years="graph.years.value"\n    :model-value="graph.year.value"\n    @update:model-value="graph.setYear($event)"\n  />\n\u003c/template>',
  },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">ContributionGraph3D</h2>
    <p>
      The WebGL scene. Bars, camera, hover picking and the grow animation all live here; everything
      else in the suite is optional chrome.
    </p>
    <div class="cg-doc-card">
      <ContributionGraph3D
        ref="graph"
        :data="days"
        :loading="loading"
        palette="forest"
        :theme="siteTheme"
        :duration="2400"
        @hover="onHover"
      />
      <div class="mt-4 flex items-center justify-between gap-4">
        <ContributionLegend :theme="siteTheme" />
        <p class="font-mono text-xs text-(--vp-c-text-2)">
          @{{ username }} · {{ year }} · hovered: {{ lastHover }}
        </p>
      </div>
    </div>
    <h2 id="contribution-graph-3d-props" tabindex="-1">Props</h2>
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
          <td>Day grid to render. Wins over <code>username</code> when both are set.</td>
        </tr>
        <tr>
          <td><code>username</code></td>
          <td><code>string | null</code></td>
          <td><code>null</code></td>
          <td>GitHub handle; fetched through the community API.</td>
        </tr>
        <tr>
          <td><code>year</code></td>
          <td><code>number | string | null</code></td>
          <td>current year</td>
          <td>Year to display when <code>username</code> is used.</td>
        </tr>
        <tr>
          <td><code>palette</code></td>
          <td><code>'forest' | 'daylight' | 'midnight'</code></td>
          <td><code>'forest'</code></td>
          <td>Bar ramp, scene background and default chrome.</td>
        </tr>
        <tr>
          <td><code>theme</code></td>
          <td><code>'dark' | 'light' | 'auto'</code></td>
          <td><code>'auto'</code></td>
          <td>Chrome of the loading and empty states.</td>
        </tr>
        <tr>
          <td><code>animate</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Grow the bars instead of showing final heights.</td>
        </tr>
        <tr>
          <td><code>loop</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Restart the animation when it finishes.</td>
        </tr>
        <tr>
          <td><code>duration</code></td>
          <td><code>number</code></td>
          <td><code>2400</code></td>
          <td>Grow duration in milliseconds.</td>
        </tr>
        <tr>
          <td><code>showAxisLabels</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Render the month and weekday sprites.</td>
        </tr>
        <tr>
          <td><code>showGridFrame</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Draw the theme-colored flat outline between grid and labels.</td>
        </tr>
        <tr>
          <td><code>showTooltip</code></td>
          <td><code>boolean</code></td>
          <td><code>true</code></td>
          <td>Render the built-in hover tooltip.</td>
        </tr>
        <tr>
          <td><code>loading</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Force the loading overlay (OR-ed with the internal fetch state).</td>
        </tr>
        <tr>
          <td><code>label</code></td>
          <td><code>string</code></td>
          <td><code>'Interactive 3D contribution graph'</code></td>
          <td>Accessible name of the graph.</td>
        </tr>
        <tr>
          <td><code>height</code></td>
          <td><code>string</code></td>
          <td><code>'clamp(360px, 48.3vh, 500px)'</code></td>
          <td>Any CSS length, applied to the container.</td>
        </tr>
      </tbody>
    </table>
    <p>
      The root element also accepts a <code>class</code> and any other attribute (<code
        >v-bind=&quot;$attrs&quot;</code
      >
      is spread on the container), so <code>class=&quot;rounded-none&quot;</code> or
      <code>id=&quot;graph&quot;</code> work as expected.
    </p>
    <h2 id="contribution-graph-3d-events" tabindex="-1">Events</h2>
    <table tabindex="0">
      <thead>
        <tr>
          <th>Event</th>
          <th>Payload</th>
          <th>Fired when</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>ready</code></td>
          <td>—</td>
          <td>The Three.js scene is mounted.</td>
        </tr>
        <tr>
          <td><code>loaded</code></td>
          <td><code>days: ContributionDay[]</code></td>
          <td>New data was handed to the scene.</td>
        </tr>
        <tr>
          <td><code>hover</code></td>
          <td><code>ContributionHover | null</code></td>
          <td>The pointer enters a bar, moves, or leaves.</td>
        </tr>
        <tr>
          <td><code>error</code></td>
          <td><code>message: string</code></td>
          <td>Fetching failed or WebGL could not be created.</td>
        </tr>
      </tbody>
    </table>
    <CodeBlock :code="snippets[0].code" :title="snippets[0].lang" />
    <h2 id="contribution-graph-3d-slots" tabindex="-1">Slots</h2>
    <table tabindex="0">
      <thead>
        <tr>
          <th>Slot</th>
          <th>Props</th>
          <th>Fallback</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>loading</code></td>
          <td>—</td>
          <td>Spinner plus <em>Loading contributions…</em></td>
        </tr>
        <tr>
          <td><code>empty</code></td>
          <td>—</td>
          <td>Hint telling you to pass <code>username</code> or <code>data</code></td>
        </tr>
        <tr>
          <td>default</td>
          <td>—</td>
          <td>Rendered above the canvas, below the tooltip</td>
        </tr>
      </tbody>
    </table>
    <h2 id="contribution-graph-3d-exposed" tabindex="-1">Exposed</h2>
    <p>Access through a template ref:</p>
    <CodeBlock :code="snippets[1].code" :title="snippets[1].lang" />
    <table tabindex="0">
      <thead>
        <tr>
          <th>Member</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>ready</code></td>
          <td><code>Ref&lt;boolean&gt;</code></td>
          <td>Whether the scene exists.</td>
        </tr>
        <tr>
          <td><code>years</code></td>
          <td><code>Ref&lt;string[]&gt;</code></td>
          <td>Years returned by the API, newest first.</td>
        </tr>
        <tr>
          <td><code>year</code></td>
          <td><code>Ref&lt;string&gt;</code></td>
          <td>Active year.</td>
        </tr>
        <tr>
          <td><code>setYear</code></td>
          <td><code>(year: string | number) =&gt; void</code></td>
          <td>Switch year.</td>
        </tr>
        <tr>
          <td><code>load</code></td>
          <td><code>(username?: string) =&gt; Promise&lt;void&gt;</code></td>
          <td>Fetch a profile.</td>
        </tr>
        <tr>
          <td><code>reload</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Re-fetch the current profile.</td>
        </tr>
        <tr>
          <td><code>status</code></td>
          <td><code>Ref&lt;ContributionStatus&gt;</code></td>
          <td>
            <code>idle</code>, <code>loading</code>, <code>success</code>, <code>error</code>.
          </td>
        </tr>
        <tr>
          <td><code>error</code></td>
          <td><code>Ref&lt;string | null&gt;</code></td>
          <td>Failure message.</td>
        </tr>
        <tr>
          <td><code>replay</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Restart the grow animation.</td>
        </tr>
        <tr>
          <td><code>resetView</code></td>
          <td><code>() =&gt; void</code></td>
          <td>Return the camera to its default framing.</td>
        </tr>
      </tbody>
    </table>
    <h2 id="contribution-graph-3d-loading-a-profile" tabindex="-1">Loading a profile</h2>
    <CodeBlock :code="snippets[2].code" :title="snippets[2].lang" />
    <h2 id="contribution-graph-3d-rendering-without-webgl" tabindex="-1">
      Rendering without WebGL
    </h2>
    <p>
      The <code>ContributionScene</code> is constructed in <code>onMounted</code>, so the server
      renders an empty, correctly sized container and the client builds the scene after hydration —
      no <code>&lt;ClientOnly&gt;</code> required. Construction is wrapped in a
      <code>try</code>/<code>catch</code>: on machines without WebGL the <code>error</code> event
      fires with a readable message instead of throwing.
    </p>
    <h2 id="contribution-graph-3d-dispose" tabindex="-1">Dispose</h2>
    <p>
      <code>&lt;ContributionGraph3D /&gt;</code> releases everything it creates on unmount:
      geometries, materials, canvas textures, <code>OrbitControls</code>, the
      <code>ResizeObserver</code>, pointer listeners and the animation frame. If you build the scene
      yourself with <code>new ContributionScene(el)</code>, call <code>.dispose()</code> yourself.
    </p>
  </div>
</template>
