import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import { createMemoryHistory } from 'vue-router'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import App from '../docs/App.vue'
import { createDocsRouter } from '../docs/router'
import pages from '../docs/pages.json'

vi.mock('../docs/composables/useSiteTheme', () => ({ useSiteTheme: () => ref('light') }))

describe('documentation navigation', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  test('switches one page at a time and keeps the sidebar, breadcrumb and mobile menu in sync', async () => {
    const router = createDocsRouter(createMemoryHistory())
    // Exercise the real navigation shell without creating WebGL scenes or fetching profiles.
    for (const route of router.getRoutes()) {
      if (route.components) {
        route.components.default = defineComponent({
          setup: () => () => h('article', { 'data-page': route.name }, String(route.meta.title)),
        })
      }
    }
    await router.push('/overview')
    const wrapper = mount(App, { global: { plugins: [router] } })
    for (const id of ['installation', 'utilities', 'introduction', 'playground', 'contributing']) {
      await wrapper.get('[aria-label="Toggle documentation menu"]').trigger('click')
      expect(wrapper.get('#sidebar').classes()).toContain('open')
      await wrapper.get(`nav a[href="/${id}"]`).trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.name).toBe(id)
      expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: 'instant' })
      expect(wrapper.findAll('[data-page]')).toHaveLength(1)
      expect(wrapper.get('[data-page]').attributes('data-page')).toBe(id)
      expect(wrapper.get('nav a.active').attributes('href')).toBe(`/${id}`)
      expect(wrapper.get('nav a.active').attributes('aria-current')).toBe('page')
      expect(wrapper.get('.breadcrumb strong').text()).toBe(router.currentRoute.value.meta.title)
      expect(wrapper.get('#sidebar').classes()).not.toContain('open')
    }
    router.back()
    await flushPromises()
    expect(wrapper.get('nav a.active').attributes('href')).toBe('/playground')
    router.forward()
    await flushPromises()
    expect(wrapper.get('nav a.active').attributes('href')).toBe('/contributing')
    wrapper.unmount()
  })

  test('resolves every documentation URL and redirects unknown pages', async () => {
    const router = createDocsRouter(createMemoryHistory())
    for (const page of pages) {
      expect(router.resolve(`/${page.id}`).name).toBe(page.id)
      expect(router.resolve(`/${page.id}`).meta.title).toBe(page.title)
    }
    // Redirects are followed before a route component is loaded.
    const overview = router.getRoutes().find((route) => route.name === 'overview')!
    overview.components!.default = defineComponent({ render: () => null })
    await router.push('/missing-page')
    expect(router.currentRoute.value.name).toBe('overview')
    await router.push('/')
    expect(router.currentRoute.value.name).toBe('overview')
  })
})
