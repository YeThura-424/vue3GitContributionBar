# ContributionUserForm

A labelled `@username` input with a submit button. It is a controlled component: it never fetches
anything itself, it just tells you when the visitor pressed <kbd>Load profile</kbd>.

<script setup lang="ts">
import { ref } from 'vue'
import { ContributionGraph3D, ContributionUserForm } from 'vue-contribution-graph-3d'
import { useSiteTheme } from '@/composables/useSiteTheme'

const username = ref('torvalds')
const submitted = ref('')
const siteTheme = useSiteTheme()

function onSubmit(value: string) {
  submitted.value = value
}
</script>

<div class="cg-doc-card">
  <ContributionUserForm v-model="username" :theme="siteTheme" @submit="onSubmit" />
  <p class="mt-3 font-mono text-xs text-(--vp-c-text-2)">
    last submit: {{ submitted || '—' }} · current model: {{ username || '—' }}
  </p>
</div>

## Props

| Prop          | Type      | Default             | Description                                    |
| ------------- | --------- | ------------------- | ---------------------------------------------- |
| `modelValue`  | `string`  | `''`                | The username, with or without the leading `@`. |
| `loading`     | `boolean` | `false`             | Disables the input and shows _Loading…_        |
| `label`       | `string`  | `'GitHub username'` | Label above the input.                         |
| `placeholder` | `string`  | `'username'`        | Input placeholder.                             |
| `buttonLabel` | `string`  | `'Load profile'`    | Submit button text.                            |
| `palette`     | `string`  | `'forest'`          | Sets `data-cg-palette`.                        |
| `theme`       | `string`  | `'auto'`            | Sets `data-cg-theme`.                          |

## Events

| Event               | Payload            |
| ------------------- | ------------------ |
| `update:modelValue` | `username: string` |
| `submit`            | `username: string` |

The form uses `@submit.prevent`, so pressing <kbd>Enter</kbd> in the input emits `submit` and never
reloads the page.

## Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ContributionGraph3D, ContributionUserForm } from 'vue-contribution-graph-3d'

const username = ref('torvalds')
const graph = ref<InstanceType<typeof ContributionGraph3D> | null>(null)
const busy = ref(false)
</script>

<template>
  <ContributionUserForm v-model="username" :loading="busy" @submit="handleLoad" />
  <ContributionGraph3D ref="graph" :username="username" />
</template>
```

`<ContributionGraph3D :username>` already watches its prop, so binding the same `v-model` to both
the form and the graph is usually all you need.

## Accessibility

- The `<label>` is associated with the input through a generated, collision-free id (`useId()`), so
  clicking the label focuses the field.
- The `@` is `aria-hidden` decoration; the accessible value is just the username.
- `required`, `autocomplete="off"` and `spellcheck="false"` are set for a username field.
- The submit button announces its busy state through both `disabled` and its text.
