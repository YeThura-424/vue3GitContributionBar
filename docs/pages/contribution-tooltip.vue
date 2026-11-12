<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ContributionTooltip } from 'vue-contribution-graph-3d'
import { useSiteTheme } from '../composables/useSiteTheme'
const siteTheme = useSiteTheme()

const position = ref({ x: 40, y: 40 })
const demo = ref<HTMLElement>()
let resizeObserver: ResizeObserver | undefined

function updatePosition(target: HTMLElement, x: number, y: number) {
  const rect = target.getBoundingClientRect()
  const tooltip = target.querySelector<HTMLElement>('[role="status"]')
  const maxX = Math.max(0, rect.width - (tooltip?.offsetWidth ?? 220) - 30)
  const maxY = Math.max(0, rect.height - (tooltip?.offsetHeight ?? 90) - 30)
  position.value = { x: Math.max(0, Math.min(x, maxX)), y: Math.max(0, Math.min(y, maxY)) }
}
function onMove(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  updatePosition(target, event.clientX - rect.left, event.clientY - rect.top)
}
onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    if (demo.value) updatePosition(demo.value, position.value.x, position.value.y)
  })
  if (demo.value) resizeObserver.observe(demo.value)
})
onBeforeUnmount(() => resizeObserver?.disconnect())

const snippets = [
  {
    lang: 'vue',
    code: '\u003cContributionTooltip :count="hit.day.count" :date-key="hit.day.date" :x="hit.x" :y="hit.y">\n  \u003ctemplate #default="{ count, date }">\n    \u003cdiv class="flex items-center gap-2">\n      \u003cspan class="h-2 w-2 rounded-full bg-cg-accent" />\n      \u003cstrong>{{ count }}\u003c/strong>\n      \u003cspan class="text-cg-muted">{{ date }}\u003c/span>\n    \u003c/div>\n  \u003c/template>\n\u003c/ContributionTooltip>',
  },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">ContributionTooltip</h2>
    <p>
      The hover card. <code>&lt;ContributionGraph3D /&gt;</code> renders one for you by default, but
      you can disable it with <code>:show-tooltip=&quot;false&quot;</code> and place your own, or
      use the component standalone over a 2D chart.
    </p>
    <div ref="demo" class="cg-doc-card tooltip-demo" @mousemove="onMove">
      <div class="absolute inset-0 grid place-items-center text-sm text-(--vp-c-text-2)">
        move the pointer over this box
      </div>
      <ContributionTooltip
        :count="7"
        date-key="2025-09-21"
        :x="position.x"
        :y="position.y"
        :theme="siteTheme"
      />
    </div>
    <h2 id="contribution-tooltip-props" tabindex="-1">Props</h2>
    <div
      class="table-scroll"
      role="region"
      aria-labelledby="contribution-tooltip-props"
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
            <td><code>count</code></td>
            <td><code>number</code></td>
            <td>required</td>
            <td>Number of contributions.</td>
          </tr>
          <tr>
            <td><code>dateKey</code></td>
            <td><code>string</code></td>
            <td><code>''</code></td>
            <td><code>YYYY-MM-DD</code>, formatted with <code>Intl.DateTimeFormat</code>.</td>
          </tr>
          <tr>
            <td><code>x</code></td>
            <td><code>number</code></td>
            <td><code>0</code></td>
            <td>Horizontal position in CSS pixels.</td>
          </tr>
          <tr>
            <td><code>y</code></td>
            <td><code>number</code></td>
            <td><code>0</code></td>
            <td>Vertical position in CSS pixels.</td>
          </tr>
          <tr>
            <td><code>locale</code></td>
            <td><code>string</code></td>
            <td><code>'en'</code></td>
            <td>BCP 47 locale used for the date.</td>
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
            <td>Light or dark chrome.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      The card is positioned with <code>translate(14px, 14px)</code> so it never sits under the
      pointer, and it is <code>pointer-events-none</code>, so it can never steal the hover from the
      bar underneath it.
    </p>
    <h2 id="contribution-tooltip-slots" tabindex="-1">Slots</h2>
    <p>The default slot receives the formatted values:</p>
    <CodeBlock :code="snippets[0].code" :title="snippets[0].lang" />
    <div
      class="table-scroll"
      role="region"
      aria-labelledby="contribution-tooltip-slots"
      tabindex="0"
    >
      <table>
        <thead>
          <tr>
            <th scope="col">Slot prop</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>count</code></td>
            <td>Ready-to-read label, e.g. <code>7 contributions</code>.</td>
          </tr>
          <tr>
            <td><code>date</code></td>
            <td>Formatted date, or <code>''</code> without <code>dateKey</code>.</td>
          </tr>
          <tr>
            <td><code>rawCount</code></td>
            <td>The raw <code>count</code> number.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2 id="contribution-tooltip-events" tabindex="-1">Events</h2>
    <p>
      None. The tooltip is presentational; the graph emits <code>hover</code> with the same
      <code>x</code>/<code>y</code> coordinates.
    </p>
    <h2 id="contribution-tooltip-accessibility" tabindex="-1">Accessibility</h2>
    <p>
      Rendered with <code>role=&quot;status&quot;</code>, so the count is announced politely when it
      changes — without the chatter of an <code>aria-live=&quot;assertive&quot;</code> region that
      would fire on every pixel of pointer movement.
    </p>
  </div>
</template>
