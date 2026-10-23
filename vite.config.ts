import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'

/**
 * Library build for vue-contribution-graph-3d.
 *
 * The documentation site lives in `docs/` and is built with VitePress
 * (see `docs/.vitepress/config.mts`).
 */
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({ include: ['src/**/*.ts', 'src/**/*.vue'], tsconfigPath: './tsconfig.json' }),
  ],
  build: {
    target: 'es2020',
    sourcemap: true,
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'VueContributionGraph3D',
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue', 'three', /^three\//],
      output: {
        globals: { vue: 'Vue', three: 'THREE' },
      },
    },
  },
})
