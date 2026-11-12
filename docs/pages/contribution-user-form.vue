<script setup lang="ts">
import CodeBlock from '../CodeBlock.vue'

import { ref } from 'vue'
import { ContributionGraph3D, ContributionUserForm } from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const username = ref('torvalds')
const submitted = ref('')
const siteTheme = useSiteTheme()

function onSubmit(value: string) {
  submitted.value = value
}

const snippets = [
  {
    lang: 'vue',
    code: '\u003cscript setup lang="ts">\nimport { ref } from \'vue\'\nimport { ContributionGraph3D, ContributionUserForm } from \'vue-contribution-graph-3d\'\n\nconst username = ref(\'torvalds\')\nconst graph = ref\u003cInstanceType\u003ctypeof ContributionGraph3D> | null>(null)\nconst busy = ref(false)\n\u003c/script>\n\n\u003ctemplate>\n  \u003cContributionUserForm v-model="username" :loading="busy" @submit="handleLoad" />\n  \u003cContributionGraph3D ref="graph" :username="username" />\n\u003c/template>',
  },
]
</script>
<template>
  <div class="reference-content">
    <h2 class="page-title">ContributionUserForm</h2>
    <p>
      A labelled <code>@username</code> input with a submit button. It is a controlled component: it
      never fetches anything itself, it just tells you when the visitor pressed
      <kbd>Load profile</kbd>.
    </p>
    <div class="cg-doc-card">
      <ContributionUserForm v-model="username" :theme="siteTheme" @submit="onSubmit" />
      <p class="mt-3 font-mono text-xs text-(--vp-c-text-2)">
        last submit: {{ submitted || '—' }} · current model: {{ username || '—' }}
      </p>
    </div>
    <h2 id="contribution-user-form-props" tabindex="-1">Props</h2>
    <div
      class="table-scroll"
      role="region"
      aria-labelledby="contribution-user-form-props"
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
            <td><code>modelValue</code></td>
            <td><code>string</code></td>
            <td><code>''</code></td>
            <td>The username, with or without the leading <code>@</code>.</td>
          </tr>
          <tr>
            <td><code>loading</code></td>
            <td><code>boolean</code></td>
            <td><code>false</code></td>
            <td>Disables the input and shows <em>Loading…</em></td>
          </tr>
          <tr>
            <td><code>label</code></td>
            <td><code>string</code></td>
            <td><code>'GitHub username'</code></td>
            <td>Label above the input.</td>
          </tr>
          <tr>
            <td><code>placeholder</code></td>
            <td><code>string</code></td>
            <td><code>'username'</code></td>
            <td>Input placeholder.</td>
          </tr>
          <tr>
            <td><code>buttonLabel</code></td>
            <td><code>string</code></td>
            <td><code>'Load profile'</code></td>
            <td>Submit button text.</td>
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
            <td>Sets <code>data-cg-theme</code>.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2 id="contribution-user-form-events" tabindex="-1">Events</h2>
    <div
      class="table-scroll"
      role="region"
      aria-labelledby="contribution-user-form-events"
      tabindex="0"
    >
      <table>
        <thead>
          <tr>
            <th scope="col">Event</th>
            <th scope="col">Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>update:modelValue</code></td>
            <td><code>username: string</code></td>
          </tr>
          <tr>
            <td><code>submit</code></td>
            <td><code>username: string</code></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      The form uses <code>@submit.prevent</code>, so pressing <kbd>Enter</kbd> in the input emits
      <code>submit</code> and never reloads the page.
    </p>
    <h2 id="contribution-user-form-example" tabindex="-1">Example</h2>
    <CodeBlock :code="snippets[0].code" :title="snippets[0].lang" />
    <p>
      <code>&lt;ContributionGraph3D :username&gt;</code> already watches its prop, so binding the
      same <code>v-model</code> to both the form and the graph is usually all you need.
    </p>
    <h2 id="contribution-user-form-accessibility" tabindex="-1">Accessibility</h2>
    <ul>
      <li>
        The <code>&lt;label&gt;</code> is associated with the input through a generated,
        collision-free id (<code>useId()</code>), so clicking the label focuses the field.
      </li>
      <li>
        The <code>@</code> is <code>aria-hidden</code> decoration; the accessible value is just the
        username.
      </li>
      <li>
        <code>required</code>, <code>autocomplete=&quot;off&quot;</code> and
        <code>spellcheck=&quot;false&quot;</code> are set for a username field.
      </li>
      <li>
        The submit button announces its busy state through both <code>disabled</code> and its text.
      </li>
    </ul>
  </div>
</template>
