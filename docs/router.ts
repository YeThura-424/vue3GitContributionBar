import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'
import pages from './pages.json'

const modules = import.meta.glob('./pages/*.vue')

export function createDocsRouter(history: RouterHistory = createWebHistory()) {
  return createRouter({
    history,
    routes: [
      { path: '/', redirect: '/overview' },
      {
        path: '/overview',
        name: 'overview',
        component: () => import('./Overview.vue'),
        meta: { title: 'Overview' },
      },
      {
        path: '/playground',
        name: 'playground',
        component: () => import('./PlaygroundPage.vue'),
        meta: { title: 'Playground', group: 'guide' },
      },
      ...pages.map((page) => ({
        path: `/${page.id}`,
        name: page.id,
        component: modules[`./pages/${page.id}.vue`],
        meta: { title: page.title, group: page.group, document: true },
      })),
      { path: '/:pathMatch(.*)*', redirect: '/overview' },
    ],
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return { ...savedPosition, behavior: 'instant' }
      if (to.hash) return { el: to.hash, top: 96, behavior: 'instant' }
      return { top: 0, left: 0, behavior: 'instant' }
    },
  })
}
