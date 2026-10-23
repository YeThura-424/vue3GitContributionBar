import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import ContributionAnimationControls from '../src/components/ContributionAnimationControls.vue'
import ContributionButton from '../src/components/ContributionButton.vue'
import ContributionLegend from '../src/components/ContributionLegend.vue'
import ContributionPalettePicker from '../src/components/ContributionPalettePicker.vue'
import ContributionStats from '../src/components/ContributionStats.vue'
import ContributionToolbar from '../src/components/ContributionToolbar.vue'
import ContributionUserForm from '../src/components/ContributionUserForm.vue'
import ContributionYearTabs from '../src/components/ContributionYearTabs.vue'
import { normalizeContributionData } from '../src/utils/normalize'

describe('ContributionLegend', () => {
  test('renders the five intensity swatches', () => {
    const wrapper = mount(ContributionLegend)

    const swatches = wrapper.findAll('i')
    expect(swatches).toHaveLength(5)
    expect(swatches.map((node) => node.classes())).toEqual([
      ['block', 'h-3', 'w-3', 'rounded-sm', 'bg-cg-level-0'],
      ['block', 'h-3', 'w-3', 'rounded-sm', 'bg-cg-level-1'],
      ['block', 'h-3', 'w-3', 'rounded-sm', 'bg-cg-level-2'],
      ['block', 'h-3', 'w-3', 'rounded-sm', 'bg-cg-level-3'],
      ['block', 'h-3', 'w-3', 'rounded-sm', 'bg-cg-level-4'],
    ])
    expect(wrapper.text()).toContain('Less')
    expect(wrapper.text()).toContain('More')
  })

  test('reflects the palette and theme on its root', () => {
    const wrapper = mount(ContributionLegend, {
      props: { palette: 'midnight', showLabels: false },
    })

    expect(wrapper.attributes('data-cg-palette')).toBe('midnight')
    expect(wrapper.attributes('data-cg-theme')).toBe('dark')
    expect(wrapper.text()).not.toContain('Less')
  })

  test('daylight defaults to a light chrome', () => {
    const wrapper = mount(ContributionLegend, { props: { palette: 'daylight' } })

    expect(wrapper.attributes('data-cg-theme')).toBe('light')
  })

  test('an explicit theme wins over the palette default', () => {
    const wrapper = mount(ContributionLegend, {
      props: { palette: 'daylight', theme: 'dark' },
    })

    expect(wrapper.attributes('data-cg-theme')).toBe('dark')
  })
})

describe('ContributionStats', () => {
  const year = 2026

  test('aggregates the day grid', () => {
    const data = normalizeContributionData(
      [
        { date: `${year}-01-01`, count: 2 },
        { date: `${year}-01-02`, count: 6 },
        { date: `${year}-01-03`, count: 3 },
      ],
      year,
    )

    const wrapper = mount(ContributionStats, { props: { data } })
    const values = wrapper.findAll('strong').map((node) => node.text())

    expect(values[0]).toBe('11')
    expect(values[1]).toBe('3')
    expect(values[2]).toBe('3 days')
    expect(values[3]).toBe('6')
    expect(wrapper.text()).toContain('Total contributions')
    expect(wrapper.text()).toContain('Longest streak')
  })

  test('accepts pre-computed stats', () => {
    const wrapper = mount(ContributionStats, {
      props: {
        stats: { total: 42, activeDays: 7, longestStreak: 4, bestDay: null },
      },
    })

    expect(wrapper.findAll('strong').map((node) => node.text())).toEqual(['42', '7', '4 days', '0'])
  })

  test('renders zeroed placeholders without data', () => {
    const wrapper = mount(ContributionStats)

    expect(wrapper.findAll('strong').map((node) => node.text())).toEqual(['0', '0', '0 days', '0'])
  })
})

describe('ContributionYearTabs', () => {
  test('marks the selected year and emits updates', async () => {
    const wrapper = mount(ContributionYearTabs, {
      props: { years: [2026, 2025, 2024], modelValue: 2025 },
    })

    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs.map((tab) => tab.attributes('aria-selected'))).toEqual(['false', 'true', 'false'])

    await tabs[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[2026]])
  })

  test('re-clicking the selected year emits nothing', async () => {
    const wrapper = mount(ContributionYearTabs, {
      props: { years: [2026], modelValue: 2026 },
    })

    await wrapper.find('[role="tab"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('ContributionPalettePicker', () => {
  test('offers the three built-in palettes', () => {
    const wrapper = mount(ContributionPalettePicker, { props: { modelValue: 'forest' } })

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(3)
    expect(buttons.map((button) => button.attributes('aria-pressed'))).toEqual([
      'true',
      'false',
      'false',
    ])
    expect(wrapper.text()).toContain('Forest')
    expect(wrapper.text()).toContain('Daylight')
    expect(wrapper.text()).toContain('Midnight')
  })

  test('emits the picked palette', async () => {
    const wrapper = mount(ContributionPalettePicker, { props: { modelValue: 'forest' } })

    await wrapper.findAll('button')[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['midnight']])
  })
})

describe('ContributionToolbar', () => {
  test('forwards replay and reset', async () => {
    const wrapper = mount(ContributionToolbar, { props: { badge: 'Public activity' } })

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)

    await buttons[0].trigger('click')
    await buttons[1].trigger('click')

    expect(wrapper.emitted('replay')).toHaveLength(1)
    expect(wrapper.emitted('reset')).toHaveLength(1)
    expect(wrapper.text()).toContain('Public activity')
  })

  test('disables the buttons while loading', () => {
    const wrapper = mount(ContributionToolbar, { props: { disabled: true } })

    expect(
      wrapper.findAll('button').every((button) => button.attributes('disabled') !== undefined),
    ).toBe(true)
  })
})

describe('ContributionUserForm', () => {
  test('keeps the input in sync with the model', async () => {
    const wrapper = mount(ContributionUserForm, { props: { modelValue: '' } })

    await wrapper.find('input').setValue('octocat')

    expect(wrapper.emitted('update:modelValue')).toEqual([['octocat']])
  })

  test('submits the username', async () => {
    const wrapper = mount(ContributionUserForm, { props: { modelValue: 'octocat' } })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toEqual([['octocat']])
  })

  test('associates the label with the input', () => {
    const wrapper = mount(ContributionUserForm)

    const input = wrapper.find('input')
    const label = wrapper.find('label')

    expect(label.attributes('for')).toBe(input.attributes('id'))
  })

  test('shows the busy state', () => {
    const wrapper = mount(ContributionUserForm, { props: { loading: true } })

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    expect(wrapper.find('button').text()).toContain('Loading')
  })
})

describe('ContributionAnimationControls', () => {
  test('emits numeric duration and independent toggle updates', async () => {
    const wrapper = mount(ContributionAnimationControls, {
      props: { duration: 2400, animate: true, loop: false },
    })

    await wrapper.find('input[type="range"]').setValue('3200')
    expect(wrapper.emitted('update:duration')).toEqual([[3200]])

    const toggles = wrapper.findAll('input[type="checkbox"]')
    await toggles[0].setValue(false)
    await toggles[1].setValue(true)
    expect(wrapper.emitted('update:animate')).toEqual([[false]])
    expect(wrapper.emitted('update:loop')).toEqual([[true]])
    expect(wrapper.emitted('update:showTooltip')).toBeUndefined()

    await wrapper.setProps({ duration: 3200, theme: 'light' })
    expect(wrapper.text()).toContain('3.2s')
    expect(wrapper.attributes('data-cg-theme')).toBe('light')
  })
})

describe('ContributionButton', () => {
  test('forwards accessibility attributes and honors disabled state', async () => {
    const wrapper = mount(ContributionButton, {
      props: { disabled: true },
      attrs: { 'aria-label': 'Copy snippet' },
      slots: { default: 'Copy' },
    })

    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.attributes('aria-label')).toBe('Copy snippet')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    await wrapper.setProps({ disabled: false })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
