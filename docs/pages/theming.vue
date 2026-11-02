<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

import { ref } from 'vue'
import {
  ContributionGraph3D,
  ContributionLegend,
  PALETTE_LABELS,
  PALETTE_NAMES,
  useGitHubContributions,
} from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const palette = ref<'forest' | 'daylight' | 'midnight'>('forest')
const { days, loading } = useGitHubContributions({ username: 'torvalds' })
const siteTheme = useSiteTheme()

const snippets = [
  {
    lang: 'vue',
    code: '\u003cContributionGraph3D :data="days" palette="daylight" theme="light" />',
  },
  { lang: 'vue', code: '\u003cContributionStats :data="days" palette="daylight" theme="dark" />' },
  {
    lang: 'html',
    code: '\u003c!-- rendered by \u003cContributionLegend palette="midnight" /> -->\n\u003cdiv data-cg-theme="dark" data-cg-palette="midnight" …>\u003c/div>',
  },
  {
    lang: 'css',
    code: "/* app.css — imported after 'vue-contribution-graph-3d/style.css' */\n[data-cg-theme='dark'] {\n  --color-cg-accent: #7dd3fc;\n  --color-cg-accent-ink: #082f49;\n}",
  },
  { lang: 'ts', code: "import 'vue-contribution-graph-3d/style.css'\nimport './app.css'" },
  {
    lang: 'ts',
    code: "// main.ts — before the first graph mounts\nimport { THEME_PALETTES, THEME_SCENE_COLORS } from 'vue-contribution-graph-3d'\nimport 'vue-contribution-graph-3d/style.css'\nimport './sunset.css'\n\nObject.assign(THEME_PALETTES, {\n  sunset: ['#3b2233', '#7a3350', '#b84f63', '#ef8f6b', '#ffd9a0'],\n})\n\nObject.assign(THEME_SCENE_COLORS, {\n  sunset: '#1a1119',\n})",
  },
  {
    lang: 'css',
    code: "/* sunset.css */\n@layer components {\n  [data-cg-palette='sunset'] {\n    --color-cg-scene: #1a1119;\n    --color-cg-level-0: #3b2233;\n    --color-cg-level-1: #7a3350;\n    --color-cg-level-2: #b84f63;\n    --color-cg-level-3: #ef8f6b;\n    --color-cg-level-4: #ffd9a0;\n  }\n}",
  },
  {
    lang: 'vue',
    code: '\u003ctemplate>\n  \u003cContributionGraph3D :data="days" palette="sunset" />\n  \u003cContributionLegend palette="sunset" />\n\u003c/template>',
  },
  {
    lang: 'ts',
    code: "import { useReducedMotion } from 'vue-contribution-graph-3d'\n\nconst reduced = useReducedMotion() // Ref\u003cboolean>, live-updating",
  },
  {
    lang: 'css',
    code: "[data-cg-theme] {\n  --font-cg-sans: 'Inter', system-ui, sans-serif;\n  --font-cg-mono: 'JetBrains Mono', monospace;\n}",
  },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">Theming &amp; palettes</h2>
    <p>Two independent knobs control how everything looks:</p>
    <ul>
      <li>
        <strong><code>palette</code></strong> — the color ramp of the bars, the Three.js scene
        background, and the matching default chrome.
      </li>
      <li>
        <strong><code>theme</code></strong> — the light or dark chrome of the surrounding widgets.
      </li>
    </ul>
    <CodeBlock :code="snippets[0].code" :title="snippets[0].lang" />
    <h2 id="theming-palettes" tabindex="-1">Palettes</h2>
    <table tabindex="0">
      <thead>
        <tr>
          <th>Name</th>
          <th>Look</th>
          <th>Default chrome</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>forest</code></td>
          <td>Deep greens with a bright mint highlight.</td>
          <td>dark</td>
        </tr>
        <tr>
          <td><code>daylight</code></td>
          <td>Soft sage greens on a warm off-white scene.</td>
          <td>light</td>
        </tr>
        <tr>
          <td><code>midnight</code></td>
          <td>Violet ramp on a near-black blue scene.</td>
          <td>dark</td>
        </tr>
      </tbody>
    </table>
    <div class="cg-doc-card palette-demo">
      <div class="palette-demo__options">
        <button
          v-for="option in PALETTE_NAMES"
          :key="option"
          type="button"
          class="rounded border border-(--vp-c-divider) px-3 py-1 text-sm"
          :class="palette === option ? 'bg-(--vp-c-brand-soft)' : ''"
          :aria-pressed="palette === option"
          @click="palette = option"
        >
          {{ PALETTE_LABELS[option] }}
        </button>
      </div>
      <ContributionGraph3D
        :data="days"
        :loading="loading"
        :palette="palette"
        :theme="siteTheme"
        :duration="2400"
        height="320px"
      />
      <ContributionLegend class="palette-demo__legend" :palette="palette" :theme="siteTheme" />
    </div>
    <p>
      Each swatch of <code>&lt;ContributionLegend /&gt;</code> follows the palette automatically
      through CSS variables, so you never have to pass colors around by hand.
    </p>
    <h2 id="theming-light-and-dark-chrome" tabindex="-1">Light and dark chrome</h2>
    <p>
      <code>theme</code> accepts <code>dark</code>, <code>light</code> or <code>auto</code> (the
      default). <code>auto</code> follows the palette, which means <code>daylight</code> renders
      light chrome and the other two render dark chrome. Pass an explicit value when you want, for
      example, a dark toolbar on top of the daylight scene:
    </p>
    <CodeBlock :code="snippets[1].code" :title="snippets[1].lang" />
    <p>Every component exposes the resolved values on its root element:</p>
    <CodeBlock :code="snippets[2].code" :title="snippets[2].lang" />
    <p>
      Because both attributes are set by the component itself, nesting widgets never causes a theme
      to leak from a parent.
    </p>
    <h2 id="theming-the-token-layer" tabindex="-1">The token layer</h2>
    <p>
      The library ships <code>dist/style.css</code>, built from <code>src/tokens.css</code>. It
      contains a <code>@theme</code> block of namespaced custom properties plus a small
      <code>@layer components</code> block of overrides — and <strong>nothing else</strong>. No
      preflight, no base reset, no global element selectors.
    </p>
    <table tabindex="0">
      <thead>
        <tr>
          <th>Token</th>
          <th>Used for</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>--color-cg-page</code></td>
          <td>Full page background (yours to use).</td>
        </tr>
        <tr>
          <td><code>--color-cg-panel</code></td>
          <td>Panel background (yours to use).</td>
        </tr>
        <tr>
          <td><code>--color-cg-field</code></td>
          <td>Input and tooltip background.</td>
        </tr>
        <tr>
          <td><code>--color-cg-selected</code></td>
          <td>Selected year / palette background.</td>
        </tr>
        <tr>
          <td><code>--color-cg-border</code></td>
          <td>Borders, dividers, the grid frame.</td>
        </tr>
        <tr>
          <td><code>--color-cg-text</code></td>
          <td>Primary text.</td>
        </tr>
        <tr>
          <td><code>--color-cg-muted</code></td>
          <td>Secondary text and legends.</td>
        </tr>
        <tr>
          <td><code>--color-cg-accent</code></td>
          <td>Accent: buttons, stats, focus rings.</td>
        </tr>
        <tr>
          <td><code>--color-cg-accent-ink</code></td>
          <td>Text on top of the accent color.</td>
        </tr>
        <tr>
          <td><code>--color-cg-error</code></td>
          <td>Error text.</td>
        </tr>
        <tr>
          <td><code>--color-cg-scene</code></td>
          <td>WebGL scene background (and its placeholder).</td>
        </tr>
        <tr>
          <td><code>--color-cg-level-0 … 4</code></td>
          <td>The five intensity levels.</td>
        </tr>
        <tr>
          <td><code>--font-cg-sans</code>, <code>--font-cg-mono</code></td>
          <td>Component typography (<code>font-cg-sans</code>, <code>font-cg-mono</code>).</td>
        </tr>
      </tbody>
    </table>
    <h2 id="theming-overriding-a-color" tabindex="-1">Overriding a color</h2>
    <p>
      Add your own override after the library stylesheet. Attribute selectors win over
      <code>:root</code>, so nothing needs <code>!important</code>:
    </p>
    <CodeBlock :code="snippets[3].code" :title="snippets[3].lang" /><CodeBlock
      :code="snippets[4].code"
      :title="snippets[4].lang"
    />
    <h2 id="theming-defining-your-own-palette" tabindex="-1">Defining your own palette</h2>
    <p>
      A palette is three things: the ramp used by the WebGL bars, the scene background, and the CSS
      variables for the legend and the container.
    </p>
    <CodeBlock :code="snippets[5].code" :title="snippets[5].lang" /><CodeBlock
      :code="snippets[6].code"
      :title="snippets[6].lang"
    /><CodeBlock :code="snippets[7].code" :title="snippets[7].lang" />
    <p>
      An unknown palette name falls back to <code>forest</code> everywhere instead of throwing, so a
      missing entry degrades rather than crashing the scene.
    </p>
    <h2 id="theming-reduced-motion" tabindex="-1">Reduced motion</h2>
    <p>
      The grow animation is disabled automatically when the visitor prefers reduced motion — the
      bars appear at their final height on the first frame. You can still call
      <code>replay()</code> explicitly.
    </p>
    <CodeBlock :code="snippets[8].code" :title="snippets[8].lang" />
    <p>
      The component wires this up for you; the composable exists for the rare case where you want to
      fade something else out too.
    </p>
    <h2 id="theming-typography" tabindex="-1">Typography</h2>
    <p>
      Components use <code>--font-cg-sans</code> (Arial) and <code>--font-cg-mono</code> (Courier
      New) so they look like the original demo regardless of what your application sets. Override
      the two variables to match your brand:
    </p>
    <CodeBlock :code="snippets[9].code" :title="snippets[9].lang" />
  </div>
</template>
