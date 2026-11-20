import { createApp } from 'vue'
import VueContributionGraph3D from '../src/index'
import App from './App.vue'
import { createDocsRouter } from './router'
import pages from './pages.json'
import './style.css'
import './docs.css'

// Preserve links to sections shared before the docs used route-based navigation.
const legacyId = window.location.hash.slice(1)
if (['overview', 'playground', ...pages.map((page) => page.id)].includes(legacyId)) {
  window.history.replaceState(window.history.state, '', `#/${legacyId}`)
}

const router = createDocsRouter()
createApp(App).use(VueContributionGraph3D).use(router).mount('#app')
