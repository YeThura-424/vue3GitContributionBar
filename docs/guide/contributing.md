# Contributing

Thanks for helping out. The project is a single package, so the loop is short: edit, test, build,
document.

## Repository layout

```text
vue-contribution-graph-3d/
├── src/
│   ├── components/        Vue components (one file per component)
│   ├── composables/       useGitHubContributions, useContributionStats, …
│   ├── three/             ContributionScene + the growth animator
│   ├── utils/             Pure logic: normalize, levels, stats, sample, format
│   ├── constants.ts       Sizes, durations, level thresholds
│   ├── themes.ts          Palettes, scene colors, theme resolution
│   ├── tokens.css         Tailwind @theme tokens + attribute overrides
│   ├── style.css          The stylesheet shipped as dist/style.css
│   └── index.ts           Public entry point
├── tests/                 Vitest suites, one file per module
├── docs/                  VitePress site and playground
├── vite.config.ts         Library build (ES + CJS + .d.ts)
└── vitest.config.ts       jsdom environment
```

## Getting started

```sh
npm install
npm run dev        # VitePress dev server → http://localhost:5173
npm run test:watch # Vitest in watch mode
```

## Scripts

| Script                 | What it does                                         |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Documentation site with hot reload.                  |
| `npm run build`        | Build `dist/` (ES, CJS, `.d.ts`, `style.css`).       |
| `npm run typecheck`    | `vue-tsc --noEmit` over source, tests and theme.       |
| `npm test`             | Run the Vitest suite once.                           |
| `npm run test:watch`   | Vitest in watch mode.                                |
| `npm run docs:build`   | Static build of the documentation.                   |
| `npm run format`       | Prettier, over everything.                           |
| `npm run format:check` | CI-friendly formatting check.                        |

Run `npm run typecheck && npm test && npm run build && npm run docs:build` before opening a pull
request — that is exactly what `prepublishOnly` runs.

## Coding style

- **TypeScript, strict.** No `any` in public signatures; internal escapes need a comment.
- **Prettier, no ESLint.** Formatting is `printWidth: 100`, single quotes, no semicolons, trailing
  commas. Let the editor run Prettier on save.
- **Vue single-file components** with `<script setup>` and the `defineOptions` name.
- **Doc comments on every public export.** They are what the API pages and the generated `.d.ts`
  show.

## Testing

Logic lives in `src/utils` and `src/three/growth.ts` precisely so it can be tested without WebGL.
When you add a feature:

1. Keep the pure part pure — no `THREE.*` in `utils/`.
2. Add a test next to the matching file in `tests/`.
3. Inject `fetchFn` in network tests; never let a unit test hit the network.

```ts
import { computeStats } from '../src/utils/stats'

expect(computeStats(days)).toEqual({ total: 12, activeDays: 4, … })
```

Component tests use `@vue/test-utils` and assert on attributes, emitted events and accessible
markup rather than CSS.

## Documentation

Every feature needs a page in `docs/`. Add the prop to the component page, add the option to the
composables table, and add a runnable example when the feature is interactive. The docs import the
library through an alias to `src/`, so an example that runs in `npm run dev` runs for consumers too.

## Three.js etiquette

- **Dispose everything you create.** Geometries, materials, canvas textures, controls, observers,
  listeners and the `requestAnimationFrame` handle all have to go in `dispose()`.
- **Never dispose shared objects.** `THREE.Sprite` shares one module-level geometry — disposing it
  would break every other sprite in the page.
- **Keep the animation loop allocation free.** The per-frame work must not create objects; adapter
  arrays are rebuilt only when the data changes.

## Pull request checklist

- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes, with tests for new behaviour.
- [ ] `npm run build` and `npm run docs:build` succeed.
- [ ] `npm run format` was run.
- [ ] New props, events and slots are documented.
- [ ] `dispose()` still releases anything the change created.

## Reporting bugs

Open an issue with the component, the props you passed, the browser and a way to reproduce it.
A reproducible sandbox or a failing test is worth a dozen screenshots.
