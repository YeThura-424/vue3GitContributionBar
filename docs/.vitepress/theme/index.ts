import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import type { Theme } from 'vitepress'
import VueContributionGraph3D from 'vue-contribution-graph-3d'

import PlaygroundPage from './PlaygroundPage.vue'
import YTR from './YTR.vue'
import './styles.css'

const HeroBars = () =>
  h(
    'span',
    { class: 'hero-bars', 'aria-hidden': 'true' },
    Array.from({ length: 3 }, (_, index) =>
      h('span', { class: `hero-bars__bar hero-bars__bar--${index + 1}` }),
    ),
  )

const theme: Theme = {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'nav-bar-title-before': () => h(YTR),
      'home-hero-image': () => h(HeroBars),
    }),
  enhanceApp({ app }) {
    app.use(VueContributionGraph3D)
    app.component('Playground', PlaygroundPage)
  },
}

export default theme
