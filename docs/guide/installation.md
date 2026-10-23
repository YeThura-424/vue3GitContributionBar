# Installation

## Requirements

| Package       | Version     | Note                                   |
| ------------- | ----------- | -------------------------------------- |
| `vue`         | `^3.4.0`    | Peer dependency, must be installed.    |
| `three`       | `>=0.160.0` | Peer dependency, must be installed.    |
| `tailwindcss` | optional    | Only needed if you restyle the tokens. |

`vue-contribution-graph-3d` does **not** bundle `vue` or `three`, so your app keeps a single copy of
both.

## Package manager

::: code-group

```sh [npm]
npm install vue-contribution-graph-3d three
```

```sh [pnpm]
pnpm add vue-contribution-graph-3d three
```

```sh [yarn]
yarn add vue-contribution-graph-3d three
```

```sh [bun]
bun add vue-contribution-graph-3d three
```

:::

## Import the stylesheet

Import the CSS once, next to your application entry file:

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

import 'vue-contribution-graph-3d/style.css'

createApp(App).mount('#app')
```

::: info Why a separate import?
The stylesheet is a normal `dist/style.css`. Keeping it out of the JavaScript means your bundler can
cache and preload it independently, and it makes it obvious which styles come from this library.
:::

## Register the components

### Globally

```ts
import { createApp } from 'vue'
import VueContributionGraph3D from 'vue-contribution-graph-3d'

import 'vue-contribution-graph-3d/style.css'

createApp(App).use(VueContributionGraph3D).mount('#app')
```

This registers all eight components, so you can write `<ContributionGraph3D />` anywhere.

### Locally (tree-shakeable)

```vue
<script setup lang="ts">
import { ContributionGraph3D, ContributionLegend } from 'vue-contribution-graph-3d'
import 'vue-contribution-graph-3d/style.css'
</script>

<template>
  <div>
    <ContributionGraph3D :data="days" />
    <ContributionLegend />
  </div>
</template>
```

Only the components you import are pulled into your bundle. The composables and utilities are plain
functions and shake out the same way.

## Verifying the install

```vue
<template>
  <ContributionGraph3D username="torvalds" height="360px" />
</template>
```

You should see @torvalds's forest-green grid grow upwards once the profile loads. Drag to orbit,
scroll to zoom, and hover a bar for its exact count.

## Server-side rendering

Nothing WebGL runs on the server:

- The component renders an empty, correctly sized container during SSR.
- The `WebGLRenderer` is only constructed inside `onMounted`, so importing the library never touches
  `window`, `document` or WebGL while rendering on the server. Importing `three` itself is safe in
  Node — it is the renderer that needs a canvas.
- Stats, legend, toolbar and tabs render real HTML on the server and hydrate normally.

No `v-if` or `<ClientOnly>` wrapper is required.

## Version pinning

```jsonc
// package.json
{
  "dependencies": {
    "three": "^0.186.0",
    "vue-contribution-graph-3d": "^0.1.0",
  },
}
```

The library is tested against the latest Three.js release, but any version from `0.160.0` onward
exposes the APIs it uses (`OrbitControls` from `three/addons`, `SRGBColorSpace`,
`ACESFilmicToneMapping`).

## Upgrading

```sh
npm install vue-contribution-graph-3d@latest
```

Because every public token and component prop is documented, `npm run typecheck` is usually enough
to find what changed.
