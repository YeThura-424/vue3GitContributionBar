<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

const snippets = [
  {
    lang: 'text',
    code: 'vue-contribution-graph-3d/\n├── src/\n│   ├── components/        Vue components (one file per component)\n│   ├── composables/       useGitHubContributions, useContributionStats, …\n│   ├── three/             ContributionScene + the growth animator\n│   ├── utils/             Pure logic: normalize, levels, stats, sample, format\n│   ├── constants.ts       Sizes, durations, level thresholds\n│   ├── themes.ts          Palettes, scene colors, theme resolution\n│   ├── tokens.css         Tailwind @theme tokens + attribute overrides\n│   ├── style.css          The stylesheet shipped as dist/style.css\n│   └── index.ts           Public entry point\n├── tests/                 Vitest suites, one file per module\n├── docs/                  Vue + Vite site and playground\n├── vite.config.ts         Library build (ES + CJS + .d.ts)\n└── vitest.config.ts       jsdom environment',
  },
  {
    lang: 'sh',
    code: 'npm install\nnpm run dev        # Vue + Vite dev server → http://localhost:5173\nnpm run test:watch # Vitest in watch mode',
  },
  {
    lang: 'ts',
    code: "import { computeStats } from '../src/utils/stats'\n\nexpect(computeStats(days)).toEqual({ total: 12, activeDays: 4, … })",
  },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">Contributing</h2>
    <p>
      Thanks for helping out. The project is a single package, so the loop is short: edit, test,
      build, document.
    </p>
    <h2 id="contributing-repository-layout" tabindex="-1">Repository layout</h2>
    <CodeBlock :code="snippets[0].code" :title="snippets[0].lang" />
    <h2 id="contributing-getting-started" tabindex="-1">Getting started</h2>
    <CodeBlock :code="snippets[1].code" :title="snippets[1].lang" />
    <h2 id="contributing-scripts" tabindex="-1">Scripts</h2>
    <table tabindex="0">
      <thead>
        <tr>
          <th>Script</th>
          <th>What it does</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>npm run dev</code></td>
          <td>Documentation site with hot reload.</td>
        </tr>
        <tr>
          <td><code>npm run build</code></td>
          <td>Build <code>dist/</code> (ES, CJS, <code>.d.ts</code>, <code>style.css</code>).</td>
        </tr>
        <tr>
          <td><code>npm run typecheck</code></td>
          <td><code>vue-tsc --noEmit</code> over source, tests and theme.</td>
        </tr>
        <tr>
          <td><code>npm test</code></td>
          <td>Run the Vitest suite once.</td>
        </tr>
        <tr>
          <td><code>npm run test:watch</code></td>
          <td>Vitest in watch mode.</td>
        </tr>
        <tr>
          <td><code>npm run docs:build</code></td>
          <td>Static build of the documentation.</td>
        </tr>
        <tr>
          <td><code>npm run format</code></td>
          <td>Prettier, over everything.</td>
        </tr>
        <tr>
          <td><code>npm run format:check</code></td>
          <td>CI-friendly formatting check.</td>
        </tr>
      </tbody>
    </table>
    <p>
      Run
      <code
        >npm run typecheck &amp;&amp; npm test &amp;&amp; npm run build &amp;&amp; npm run
        docs:build</code
      >
      before opening a pull request.
    </p>
    <h2 id="contributing-coding-style" tabindex="-1">Coding style</h2>
    <ul>
      <li>
        <strong>TypeScript, strict.</strong> No <code>any</code> in public signatures; internal
        escapes need a comment.
      </li>
      <li>
        <strong>Prettier, no ESLint.</strong> Formatting is <code>printWidth: 100</code>, single
        quotes, no semicolons, trailing commas. Let the editor run Prettier on save.
      </li>
      <li>
        <strong>Vue single-file components</strong> with <code>&lt;script setup&gt;</code> and the
        <code>defineOptions</code> name.
      </li>
      <li>
        <strong>Doc comments on every public export.</strong> They are what the API pages and the
        generated <code>.d.ts</code> show.
      </li>
    </ul>
    <h2 id="contributing-testing" tabindex="-1">Testing</h2>
    <p>
      Logic lives in <code>src/utils</code> and <code>src/three/growth.ts</code> precisely so it can
      be tested without WebGL. When you add a feature:
    </p>
    <ol>
      <li>Keep the pure part pure — no <code>THREE.*</code> in <code>utils/</code>.</li>
      <li>Add a test next to the matching file in <code>tests/</code>.</li>
      <li>Inject <code>fetchFn</code> in network tests; never let a unit test hit the network.</li>
    </ol>
    <CodeBlock :code="snippets[2].code" :title="snippets[2].lang" />
    <p>
      Component tests use <code>@vue/test-utils</code> and assert on attributes, emitted events and
      accessible markup rather than CSS.
    </p>
    <h2 id="contributing-documentation" tabindex="-1">Documentation</h2>
    <p>
      Every feature needs a page in <code>docs/</code>. Add the prop to the component page, add the
      option to the composables table, and add a runnable example when the feature is interactive.
      The docs import the library through an alias to <code>src/</code>, so an example that runs in
      <code>npm run dev</code> runs for consumers too.
    </p>
    <h2 id="contributing-three-js-etiquette" tabindex="-1">Three.js etiquette</h2>
    <ul>
      <li>
        <strong>Dispose everything you create.</strong> Geometries, materials, canvas textures,
        controls, observers, listeners and the <code>requestAnimationFrame</code> handle all have to
        go in <code>dispose()</code>.
      </li>
      <li>
        <strong>Never dispose shared objects.</strong> <code>THREE.Sprite</code> shares one
        module-level geometry — disposing it would break every other sprite in the page.
      </li>
      <li>
        <strong>Keep the animation loop allocation free.</strong> The per-frame work must not create
        objects; adapter arrays are rebuilt only when the data changes.
      </li>
    </ul>
    <h2 id="contributing-pull-request-checklist" tabindex="-1">Pull request checklist</h2>
    <ul>
      <li>[ ] <code>npm run typecheck</code> passes.</li>
      <li>[ ] <code>npm test</code> passes, with tests for new behaviour.</li>
      <li>[ ] <code>npm run build</code> and <code>npm run docs:build</code> succeed.</li>
      <li>[ ] <code>npm run format</code> was run.</li>
      <li>[ ] New props, events and slots are documented.</li>
      <li>[ ] <code>dispose()</code> still releases anything the change created.</li>
    </ul>
    <h2 id="contributing-reporting-bugs" tabindex="-1">Reporting bugs</h2>
    <p>
      Open an issue with the component, the props you passed, the browser and a way to reproduce it.
      A reproducible sandbox or a failing test is worth a dozen screenshots.
    </p>
  </div>
</template>
