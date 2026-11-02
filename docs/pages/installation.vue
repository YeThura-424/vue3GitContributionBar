<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'
import CodeGroup from '../CodeGroup.vue'

const snippets = [
  { lang: 'sh [npm]', code: 'npm install vue-contribution-graph-3d three' },
  { lang: 'sh [pnpm]', code: 'pnpm add vue-contribution-graph-3d three' },
  { lang: 'sh [yarn]', code: 'yarn add vue-contribution-graph-3d three' },
  { lang: 'sh [bun]', code: 'bun add vue-contribution-graph-3d three' },
  {
    lang: 'ts',
    code: "// main.ts\nimport { createApp } from 'vue'\nimport App from './App.vue'\n\nimport 'vue-contribution-graph-3d/style.css'\n\ncreateApp(App).mount('#app')",
  },
  {
    lang: 'ts',
    code: "import { createApp } from 'vue'\nimport VueContributionGraph3D from 'vue-contribution-graph-3d'\n\nimport 'vue-contribution-graph-3d/style.css'\n\ncreateApp(App).use(VueContributionGraph3D).mount('#app')",
  },
  {
    lang: 'vue',
    code: '\u003cscript setup lang="ts">\nimport { ContributionGraph3D, ContributionLegend } from \'vue-contribution-graph-3d\'\nimport \'vue-contribution-graph-3d/style.css\'\n\u003c/script>\n\n\u003ctemplate>\n  \u003cdiv>\n    \u003cContributionGraph3D :data="days" />\n    \u003cContributionLegend />\n  \u003c/div>\n\u003c/template>',
  },
  {
    lang: 'vue',
    code: '\u003ctemplate>\n  \u003cContributionGraph3D username="torvalds" height="360px" />\n\u003c/template>',
  },
  {
    lang: 'jsonc',
    code: '// package.json\n{\n  "dependencies": {\n    "three": "^0.186.0",\n    "vue-contribution-graph-3d": "^0.1.0",\n  },\n}',
  },
  { lang: 'sh', code: 'npm install vue-contribution-graph-3d@latest' },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">Installation</h2>
    <h2 id="installation-requirements" tabindex="-1">Requirements</h2>
    <table tabindex="0">
      <thead>
        <tr>
          <th>Package</th>
          <th>Version</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>vue</code></td>
          <td><code>^3.4.0</code></td>
          <td>Peer dependency, must be installed.</td>
        </tr>
        <tr>
          <td><code>three</code></td>
          <td><code>&gt;=0.160.0</code></td>
          <td>Peer dependency, must be installed.</td>
        </tr>
        <tr>
          <td><code>tailwindcss</code></td>
          <td>optional</td>
          <td>Only needed if you restyle the tokens.</td>
        </tr>
      </tbody>
    </table>
    <p>
      <code>vue-contribution-graph-3d</code> does <strong>not</strong> bundle <code>vue</code> or
      <code>three</code>, so your app keeps a single copy of both.
    </p>
    <h2 id="installation-package-manager" tabindex="-1">Package manager</h2>
    <CodeGroup :snippets="snippets.slice(0, 4)" />
    <h2 id="installation-import-the-stylesheet" tabindex="-1">Import the stylesheet</h2>
    <p>Import the CSS once, next to your application entry file:</p>
    <CodeBlock :code="snippets[4].code" :title="snippets[4].lang" />
    <div class="tip custom-block">
      <p class="custom-block-title">Why a separate import?</p>
      <p>
        The stylesheet is a normal <code>dist/style.css</code>. Keeping it out of the JavaScript
        means your bundler can cache and preload it independently, and it makes it obvious which
        styles come from this library.
      </p>
    </div>
    <h2 id="installation-register-the-components" tabindex="-1">Register the components</h2>
    <h3 id="installation-globally" tabindex="-1">Globally</h3>
    <CodeBlock :code="snippets[5].code" :title="snippets[5].lang" />
    <p>
      This registers all eight components, so you can write
      <code>&lt;ContributionGraph3D /&gt;</code> anywhere.
    </p>
    <h3 id="installation-locally-tree-shakeable" tabindex="-1">Locally (tree-shakeable)</h3>
    <CodeBlock :code="snippets[6].code" :title="snippets[6].lang" />
    <p>
      Only the components you import are pulled into your bundle. The composables and utilities are
      plain functions and shake out the same way.
    </p>
    <h2 id="installation-verifying-the-install" tabindex="-1">Verifying the install</h2>
    <CodeBlock :code="snippets[7].code" :title="snippets[7].lang" />
    <p>
      You should see @torvalds's forest-green grid grow upwards once the profile loads. Drag to
      orbit, scroll to zoom, and hover a bar for its exact count.
    </p>
    <h2 id="installation-server-side-rendering" tabindex="-1">Server-side rendering</h2>
    <p>Nothing WebGL runs on the server:</p>
    <ul>
      <li>The component renders an empty, correctly sized container during SSR.</li>
      <li>
        The <code>WebGLRenderer</code> is only constructed inside <code>onMounted</code>, so
        importing the library never touches <code>window</code>, <code>document</code> or WebGL
        while rendering on the server. Importing <code>three</code> itself is safe in Node — it is
        the renderer that needs a canvas.
      </li>
      <li>Stats, legend, toolbar and tabs render real HTML on the server and hydrate normally.</li>
    </ul>
    <p>No <code>v-if</code> or <code>&lt;ClientOnly&gt;</code> wrapper is required.</p>
    <h2 id="installation-version-pinning" tabindex="-1">Version pinning</h2>
    <CodeBlock :code="snippets[8].code" :title="snippets[8].lang" />
    <p>
      The library is tested against the latest Three.js release, but any version from
      <code>0.160.0</code> onward exposes the APIs it uses (<code>OrbitControls</code> from
      <code>three/addons</code>, <code>SRGBColorSpace</code>, <code>ACESFilmicToneMapping</code>).
    </p>
    <h2 id="installation-upgrading" tabindex="-1">Upgrading</h2>
    <CodeBlock :code="snippets[9].code" :title="snippets[9].lang" />
    <p>
      Because every public token and component prop is documented, <code>npm run typecheck</code> is
      usually enough to find what changed.
    </p>
  </div>
</template>
