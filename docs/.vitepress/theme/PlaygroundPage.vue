<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  ContributionAnimationControls,
  ContributionButton,
  ContributionGraph3D,
  ContributionLegend,
  ContributionPalettePicker,
  ContributionStats,
  ContributionToolbar,
  ContributionUserForm,
  ContributionYearTabs,
  useContributionStats,
  useGitHubContributions,
  type PaletteName,
} from 'vue-contribution-graph-3d'

import { useSiteTheme } from '@/composables/useSiteTheme'

const username = ref('torvalds')
const draft = ref('torvalds')

const { days, years, year, status, error, loading, load, reload, setYear } = useGitHubContributions(
  { username: () => username.value },
)

const stats = useContributionStats(() => days.value)
const siteTheme = useSiteTheme()

function onLoadProfile(handle: string): void {
  const next = handle.replace(/^@/, '').trim()
  draft.value = handle
  if (next === username.value) reload()
  else username.value = next
}

/* ------------------------------------------------------------ appearance -- */

const palette = ref<PaletteName>('forest')
const duration = ref(2400)
const animate = ref(true)
const loop = ref(false)
const showAxisLabels = ref(true)
const showGridFrame = ref(true)
const showTooltip = ref(true)

const graph = ref<{ replay(): void; resetView(): void } | null>(null)
const graphError = ref('')

/* -------------------------------------------------------------- snippet -- */

const CLOSE_SCRIPT = '</' + 'script>'

const attrLines = computed<string[]>(() => {
  const attrs = [`username="${username.value}"`, `palette="${palette.value}"`]

  if (!animate.value) attrs.push(':animate="false"')
  if (loop.value) attrs.push(':loop="true"')
  attrs.push(`:duration="${duration.value}"`)
  if (!showAxisLabels.value) attrs.push(':show-axis-labels="false"')
  if (!showGridFrame.value) attrs.push(':show-grid-frame="false"')
  if (!showTooltip.value) attrs.push(':show-tooltip="false"')

  return attrs
})

const snippet = computed(() =>
  [
    '<script setup lang="ts">',
    "import { ContributionGraph3D } from 'vue-contribution-graph-3d'",
    "import 'vue-contribution-graph-3d/style.css'",
    CLOSE_SCRIPT,
    '',
    '<template>',
    '<ContributionGraph3D',
    ...attrLines.value.map((attr) => `  ${attr}`),
    '/>',
    '</template>',
  ].join('\n'),
)

const copied = ref(false)

async function copySnippet(): Promise<void> {
  try {
    await navigator.clipboard.writeText(snippet.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="playground-page" :data-cg-theme="siteTheme">
    <div class="playground-dashboard">
      <!-- ------------------------------------------------------------ panel -->
      <aside
        class="playground-controls flex h-full min-w-0 flex-col gap-3 p-4 font-cg-sans text-(--vp-c-text-1)"
      >
        <section>
          <ContributionUserForm
            class="playground-user-form"
            v-model="draft"
            :loading="loading"
            :theme="siteTheme"
            :palette="palette"
            button-label="Load profile"
            @submit="onLoadProfile"
          />

          <p
            v-if="status === 'error'"
            class="mt-2 font-cg-mono text-xs text-(--vp-c-danger-1)"
            role="alert"
          >
            {{ error }}
          </p>
        </section>

        <section>
          <h2 class="mb-3 text-sm font-semibold">Year</h2>
          <ContributionYearTabs
            v-if="years.length > 0"
            :years="years"
            :model-value="year"
            :palette="palette"
            :theme="siteTheme"
            @update:model-value="setYear"
          />
          <p v-else class="font-cg-mono text-xs text-(--vp-c-text-2)">Loading years…</p>
        </section>

        <section>
          <h2 class="mb-3 text-sm font-semibold">Appearance</h2>
          <ContributionPalettePicker
            v-model="palette"
            class="playground-palette-picker"
            :theme="siteTheme"
            label="Color palette"
          />
        </section>

        <section>
          <h2 class="mb-3 text-sm font-semibold">Animation</h2>

          <ContributionAnimationControls
            v-model:duration="duration"
            v-model:animate="animate"
            v-model:loop="loop"
            v-model:show-axis-labels="showAxisLabels"
            v-model:show-grid-frame="showGridFrame"
            v-model:show-tooltip="showTooltip"
            :palette="palette"
            :theme="siteTheme"
          />
        </section>
      </aside>

      <!-- ------------------------------------------------------------ stage -->
      <main class="playground-stage flex min-w-0 flex-col overflow-hidden">
        <div class="playground-stage__header">
          <ContributionToolbar
            badge="Public activity"
            :palette="palette"
            :theme="siteTheme"
            :disabled="loading"
            @replay="graph?.replay()"
            @reset="graph?.resetView()"
          />
          <h1>{{ username }}</h1>
          <p>{{ year }}-01-01 <span>→</span> {{ year }}-12-31</p>
        </div>

        <ContributionGraph3D
          ref="graph"
          :data="days"
          :palette="palette"
          :theme="siteTheme"
          :animate="animate"
          :loop="loop"
          :duration="duration"
          :show-axis-labels="showAxisLabels"
          :show-grid-frame="showGridFrame"
          :show-tooltip="showTooltip"
          :loading="loading"
          height="clamp(320px, 46vh, 470px)"
          @error="(message) => (graphError = message)"
        />

        <p
          v-if="graphError"
          class="px-4 pb-3 font-cg-mono text-xs text-(--vp-c-danger-1)"
          role="alert"
        >
          {{ graphError }}
        </p>

        <div class="playground-stage__legend flex flex-wrap items-center justify-between gap-4">
          <ContributionLegend :palette="palette" :theme="siteTheme" />
          <span class="font-cg-mono text-xs text-(--vp-c-text-2)">
            drag to orbit · scroll to zoom · hover a bar
          </span>
        </div>

        <ContributionStats
          class="playground-stage__stats mt-auto"
          :stats="stats"
          :palette="palette"
          :theme="siteTheme"
        />
      </main>
    </div>

    <!-- --------------------------------------------------------- snippet -->
    <section
      class="mt-6 overflow-hidden rounded-[10px] border border-(--vp-c-divider) bg-(--vp-c-bg-soft)"
    >
      <div
        class="flex items-center justify-between gap-3 border-b border-(--vp-c-divider) px-4 py-3"
      >
        <h2 class="font-cg-sans text-xs font-semibold uppercase tracking-wide text-(--vp-c-text-2)">
          Generated snippet
        </h2>

        <ContributionButton
          :palette="palette"
          :theme="siteTheme"
          :aria-label="
            copied ? 'Snippet copied to the clipboard' : 'Copy the snippet to the clipboard'
          "
          @click="copySnippet"
        >
          <svg
            v-if="!copied"
            class="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg
            v-else
            class="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {{ copied ? 'Copied' : 'Copy' }}
        </ContributionButton>
      </div>

      <pre
        class="overflow-x-auto px-4 py-4 font-cg-mono text-[12px] leading-relaxed text-(--vp-c-text-1)"
      ><code>{{ snippet }}</code></pre>
    </section>
  </div>
</template>
