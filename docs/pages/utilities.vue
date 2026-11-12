<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

const snippets = [
  {
    lang: 'ts',
    code: "import { normalizeContributionData } from 'vue-contribution-graph-3d'\n\nconst days = normalizeContributionData([{ date: '2025-09-21', count: 4 }], 2025)",
  },
  {
    lang: 'ts',
    code: 'count === 0 ? 0.1 : 0.24 + (Math.log1p(count) / Math.log1p(maxCount)) * (10.5 - 0.24)',
  },
  {
    lang: 'ts',
    code: "import {\n  THEME_PALETTES, // Record\u003cPaletteName, readonly string[]> — 5 levels each\n  THEME_SCENE_COLORS, // Record\u003cPaletteName, string>\n  PALETTE_THEME, // Record\u003cPaletteName, ThemeName>\n  PALETTE_LABELS, // Record\u003cPaletteName, string>\n  PALETTE_NAMES, // ['forest', 'daylight', 'midnight']\n  resolveTheme, // (palette, theme?) => 'dark' | 'light'\n  getPaletteColors, // safe lookup, falls back to forest\n  getSceneColor, // safe lookup, falls back to forest\n} from 'vue-contribution-graph-3d'",
  },
  {
    lang: 'ts',
    code: "import { ContributionScene, GrowthAnimator, easeOutCubic } from 'vue-contribution-graph-3d'",
  },
  {
    lang: 'ts',
    code: 'const animator = new GrowthAnimator({ duration: 2400, loop: true })\nanimator.replay(blocks) // blocks: { targetHeight, scale, position }[]\nanimator.tick(performance.now(), blocks)',
  },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">Utilities &amp; constants</h2>
    <p>
      Everything below is a pure function or a frozen value. No Three.js, no Vue, no globals — safe
      to use in tests, in a worker, or to drive a 2D fallback that matches the 3D scene exactly.
    </p>
    <h2 id="utilities-data-helpers" tabindex="-1">Data helpers</h2>
    <h3 id="utilities-normalizecontributiondata-entries-year" tabindex="-1">
      <code>normalizeContributionData(entries, year)</code>
    </h3>
    <p>Expands sparse <code>{ date, count }</code> pairs into a complete rectangular week grid.</p>
    <CodeBlock :code="snippets[0].code" :title="snippets[0].lang" />
    <ul>
      <li>Columns run Sunday-first from the Sunday on or before January 1.</li>
      <li>
        Padding days from the neighbouring years are included with <code>count: 0</code> and
        <code>isOutsideYear: true</code>.
      </li>
      <li>
        Days that have not happened yet are flagged <code>isFuture: true</code> and never carry a
        count.
      </li>
      <li>Missing and malformed entries are ignored rather than throwing.</li>
    </ul>
    <h3 id="utilities-getweeksforyear-year" tabindex="-1"><code>getWeeksForYear(year)</code></h3>
    <p>Number of week columns a year needs (53 or 54).</p>
    <h3 id="utilities-startofday-date-·-startofweek-date-·-tolocaldatekey-date" tabindex="-1">
      <code>startOfDay(date)</code> · <code>startOfWeek(date)</code> ·
      <code>toLocalDateKey(date)</code>
    </h3>
    <p>
      Local-time helpers used by the normalizer. <code>toLocalDateKey</code> produces
      <code>YYYY-MM-DD</code> <strong>in local time</strong>, which is what GitHub's payload uses.
    </p>
    <h2 id="utilities-level-and-height-helpers" tabindex="-1">Level and height helpers</h2>
    <h3 id="utilities-getcontributionlevel-count" tabindex="-1">
      <code>getContributionLevel(count)</code>
    </h3>
    <p>
      Returns <code>0</code>–<code>4</code> using the GitHub buckets: <code>0</code>,
      <code>1–3</code>, <code>4–7</code>, <code>8–13</code>, <code>14+</code>.
    </p>
    <h3 id="utilities-getbarheight-count-maxcount" tabindex="-1">
      <code>getBarHeight(count, maxCount)</code>
    </h3>
    <CodeBlock :code="snippets[1].code" :title="snippets[1].lang" />
    <p>
      The busiest day always lands exactly on <code>MAX_VISIBLE_HEIGHT</code> and an empty day on
      <code>ZERO_HEIGHT</code>. <code>maxCount &lt;= 0</code> is treated as <code>1</code> so the
      division is always safe.
    </p>
    <h3 id="utilities-getmaxcontributioncount-days" tabindex="-1">
      <code>getMaxContributionCount(days)</code>
    </h3>
    <p>Largest count in a list, never below <code>1</code>.</p>
    <h2 id="utilities-statistics" tabindex="-1">Statistics</h2>
    <h3 id="utilities-computestats-days" tabindex="-1"><code>computeStats(days)</code></h3>
    <p>
      <code>{ total, activeDays, longestStreak, bestDay }</code>. Ignores
      <code>isFuture</code> days, so a partial year reports honest numbers. See
      <a href="#composables"><code>useContributionStats</code></a
      >.
    </p>
    <h2 id="utilities-sample-data" tabindex="-1">Sample data</h2>
    <h3 id="utilities-buildsamplecontributions-year-seed" tabindex="-1">
      <code>buildSampleContributions(year, seed?)</code>
    </h3>
    <p>
      The pure version of <a href="#composables"><code>useSampleContributions</code></a
      >. Default seed is <code>20260921</code>.
    </p>
    <h3 id="utilities-mulberry32-seed" tabindex="-1"><code>mulberry32(seed)</code></h3>
    <p>Small, fast, deterministic PRNG. Useful in your own fixtures.</p>
    <h2 id="utilities-formatting" tabindex="-1">Formatting</h2>
    <h3 id="utilities-formatdate-datekey-locale-en" tabindex="-1">
      <code>formatDate(dateKey, locale = 'en')</code>
    </h3>
    <p><code>Mon, Sep 21, 2026</code> via <code>Intl.DateTimeFormat</code>.</p>
    <h3 id="utilities-formatmonth-datekey-locale-en" tabindex="-1">
      <code>formatMonth(dateKey, locale = 'en')</code>
    </h3>
    <p><code>Sep</code> — the same label the axis sprites draw.</p>
    <h2 id="utilities-themes" tabindex="-1">Themes</h2>
    <CodeBlock :code="snippets[2].code" :title="snippets[2].lang" />
    <h2 id="utilities-constants" tabindex="-1">Constants</h2>
    <div class="table-scroll" role="region" aria-labelledby="utilities-constants" tabindex="0">
      <table>
        <thead>
          <tr>
            <th scope="col">Constant</th>
            <th scope="col">Value</th>
            <th scope="col">Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>WEEKS_PER_YEAR</code></td>
            <td><code>53</code></td>
            <td>Maximum week columns.</td>
          </tr>
          <tr>
            <td><code>DAYS_PER_WEEK</code></td>
            <td><code>7</code></td>
            <td>Rows per column.</td>
          </tr>
          <tr>
            <td><code>CELL_SIZE</code></td>
            <td><code>0.9</code></td>
            <td>Bar edge length in world units.</td>
          </tr>
          <tr>
            <td><code>CELL_GAP</code></td>
            <td><code>0.3</code></td>
            <td>Space between bars.</td>
          </tr>
          <tr>
            <td><code>CELL_STEP</code></td>
            <td><code>1.2</code></td>
            <td><code>CELL_SIZE + CELL_GAP</code>.</td>
          </tr>
          <tr>
            <td><code>ZERO_HEIGHT</code></td>
            <td><code>0.1</code></td>
            <td>Height of an empty day.</td>
          </tr>
          <tr>
            <td><code>MIN_BAR_HEIGHT</code></td>
            <td><code>0.24</code></td>
            <td>Height of the first contribution.</td>
          </tr>
          <tr>
            <td><code>MAX_VISIBLE_HEIGHT</code></td>
            <td><code>10.5</code></td>
            <td>Height of the busiest day.</td>
          </tr>
          <tr>
            <td><code>DEFAULT_GROW_DURATION</code></td>
            <td><code>2400</code></td>
            <td>Animation length in ms.</td>
          </tr>
          <tr>
            <td><code>LOOP_DELAY</code></td>
            <td><code>700</code></td>
            <td>Pause between loops in ms.</td>
          </tr>
          <tr>
            <td><code>LEVEL_COUNT</code></td>
            <td><code>5</code></td>
            <td>Number of intensity levels.</td>
          </tr>
          <tr>
            <td><code>LEVEL_THRESHOLDS</code></td>
            <td><code>[3, 7, 13]</code></td>
            <td>Upper bounds of levels 1–3.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2 id="utilities-three-js-classes" tabindex="-1">Three.js classes</h2>
    <p>Advanced use only — these are exported for people who want to host the scene themselves.</p>
    <CodeBlock :code="snippets[3].code" :title="snippets[3].lang" />
    <h3 id="utilities-new-contributionscene-container-options" tabindex="-1">
      <code>new ContributionScene(container, options?)</code>
    </h3>
    <div
      class="table-scroll"
      role="region"
      aria-labelledby="utilities-new-contributionscene-container-options"
      tabindex="0"
    >
      <table>
        <thead>
          <tr>
            <th scope="col">Method</th>
            <th scope="col">Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>setData(days)</code></td>
            <td>Replace the rendered year.</td>
          </tr>
          <tr>
            <td><code>setPalette(name)</code> / <code>setTheme(theme)</code></td>
            <td>Retint bars, scene, lights and labels.</td>
          </tr>
          <tr>
            <td><code>setAnimation({ animate, loop, duration })</code></td>
            <td>Update the grow animation.</td>
          </tr>
          <tr>
            <td><code>setAxisLabels(visible)</code></td>
            <td>Toggle the month/weekday sprites.</td>
          </tr>
          <tr>
            <td><code>setGridFrame(visible)</code></td>
            <td>Toggle the outline.</td>
          </tr>
          <tr>
            <td><code>setPaused(paused)</code></td>
            <td>Freeze interaction and looping while loading.</td>
          </tr>
          <tr>
            <td><code>setHoverListener(fn)</code></td>
            <td>Receive <code>{ day, level, x, y }</code> or <code>null</code>.</td>
          </tr>
          <tr>
            <td><code>replay()</code> · <code>resetView()</code></td>
            <td>Animation and camera.</td>
          </tr>
          <tr>
            <td><code>dispose()</code></td>
            <td>Release every GPU resource and listener.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h3 id="utilities-growthanimator" tabindex="-1"><code>GrowthAnimator</code></h3>
    <p>The time-based grow animation, deliberately free of Three.js so it can be unit tested:</p>
    <CodeBlock :code="snippets[4].code" :title="snippets[4].lang" />
    <p>
      <code>easeOutCubic(progress)</code> is the easing it uses, exported so a matching 2D chart can
      share it.
    </p>
  </div>
</template>
