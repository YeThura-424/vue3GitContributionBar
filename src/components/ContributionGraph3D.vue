<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

import ContributionTooltip from './ContributionTooltip.vue'
import { useGitHubContributions } from '../composables/useGitHubContributions'
import { useReducedMotion } from '../composables/useReducedMotion'
import { useCgTheme, type CgThemeProps } from '../composables/useCgTheme'
import { DEFAULT_GROW_DURATION } from '../constants'
import type { ContributionDay, ContributionHover } from '../types'
import { ContributionScene } from '../three/ContributionScene'

defineOptions({ name: 'ContributionGraph3D', inheritAttrs: false })

const props = withDefaults(
  defineProps<
    CgThemeProps & {
      /** Day grid to render. Wins over `username` when both are set. */
      data?: readonly ContributionDay[] | null
      /** GitHub handle to load through the community contributions API. */
      username?: string | null
      /** Year to display when `username` is used. */
      year?: number | string | null
      /** Animate the bars when data changes. */
      animate?: boolean
      /** Restart the animation after it completes. */
      loop?: boolean
      /** Grow duration in milliseconds. */
      duration?: number
      /** Render the month and weekday sprites. */
      showAxisLabels?: boolean
      /** Draw the outline around the grid. */
      showGridFrame?: boolean
      /** Render the hover tooltip. */
      showTooltip?: boolean
      /** Force the loading overlay. */
      loading?: boolean
      /** Accessible name of the graph. */
      label?: string
      /** Height of the container. Accepts any CSS length. */
      height?: string
    }
  >(),
  {
    data: null,
    username: null,
    year: null,
    palette: 'forest',
    theme: 'auto',
    animate: true,
    loop: false,
    duration: DEFAULT_GROW_DURATION,
    showAxisLabels: true,
    showGridFrame: true,
    showTooltip: true,
    loading: false,
    label: 'Interactive 3D contribution graph',
    height: 'clamp(360px, 48.3vh, 500px)',
  },
)

const emit = defineEmits<{
  /** The WebGL scene is mounted and ready for data. */
  ready: []
  /** The pointer entered or left a bar. */
  hover: [hover: ContributionHover | null]
  /** New data was handed to the scene. */
  loaded: [days: ContributionDay[]]
  /** Fetching the profile failed. */
  error: [message: string]
}>()

const { cgAttrs, resolvedTheme } = useCgTheme(props)

const github = useGitHubContributions({
  username: () => props.username ?? '',
  year: () => props.year ?? new Date().getFullYear(),
})

const reducedMotion = useReducedMotion()

const container = ref<HTMLElement | null>(null)
const scene = shallowRef<ContributionScene | null>(null)
const hover = shallowRef<ContributionHover | null>(null)
const ready = ref(false)

const days = computed<readonly ContributionDay[]>(() => {
  if (props.data && props.data.length > 0) return props.data
  if (props.username && github.days.value.length > 0) return github.days.value
  return props.data ?? []
})

const isLoading = computed(() => props.loading || github.loading.value)
const isEmpty = computed(() => days.value.length === 0)

watch(days, (value) => {
  if (!scene.value || value.length === 0) return
  scene.value.setData(value)
  emit('loaded', [...value])
})

watch(isLoading, (value) => scene.value?.setPaused(value), { immediate: true })
watch(
  () => props.palette,
  (value) => scene.value?.setPalette(value),
)
watch(
  () => props.theme,
  (value) => scene.value?.setTheme(value),
)
watch(
  () => [props.animate, props.loop, props.duration] as const,
  ([animate, loop, duration]) => scene.value?.setAnimation({ animate, loop, duration }),
)
watch(
  () => props.showAxisLabels,
  (value) => scene.value?.setAxisLabels(value),
)
watch(
  () => props.showGridFrame,
  (value) => scene.value?.setGridFrame(value),
)
watch(reducedMotion, (value) => scene.value?.setReducedMotion(value))

watch(github.error, (message) => {
  if (message) emit('error', message)
})

onMounted(() => {
  const element = container.value
  if (!element) return

  // Everything WebGL happens here, which is why the server render stays empty.
  let instance: ContributionScene
  try {
    instance = new ContributionScene(element, {
      palette: props.palette,
      theme: props.theme,
      animate: props.animate,
      loop: props.loop,
      duration: props.duration,
      showAxisLabels: props.showAxisLabels,
      showGridFrame: props.showGridFrame,
      reducedMotion: reducedMotion.value,
      label: props.label,
    })
  } catch (cause) {
    emit('error', cause instanceof Error ? cause.message : 'WebGL is not available.')
    return
  }

  instance.setHoverListener((next) => {
    hover.value = next
    emit('hover', next)
  })

  scene.value = instance
  ready.value = true
  emit('ready')

  if (days.value.length > 0) {
    instance.setData(days.value)
    emit('loaded', [...days.value])
  }
  instance.setPaused(isLoading.value)
})

onBeforeUnmount(() => {
  scene.value?.dispose()
  scene.value = null
  hover.value = null
})

/** Restart the grow animation. */
function replay(): void {
  scene.value?.replay()
}

/** Move the camera back to the default framing. */
function resetView(): void {
  scene.value?.resetView()
}

defineExpose({
  ready,
  replay,
  resetView,
  years: github.years,
  year: github.year,
  setYear: github.setYear,
  reload: github.reload,
  status: github.status,
  errorMessage: github.error,
})
</script>

<template>
  <div
    ref="container"
    v-bind="{ ...cgAttrs, ...$attrs }"
    class="relative w-full touch-none overflow-hidden rounded-[10px] bg-cg-scene"
    :style="{ height }"
    :aria-label="label"
    :aria-busy="isLoading"
  >
    <div
      v-if="isLoading"
      class="absolute inset-0 z-20 grid place-items-center bg-cg-scene"
      role="status"
      aria-live="polite"
    >
      <slot name="loading">
        <div class="flex flex-col items-center gap-3.5 font-cg-sans text-xs text-cg-muted">
          <span
            class="h-7 w-7 animate-spin rounded-full border-2 border-cg-border border-t-cg-accent"
            aria-hidden="true"
          />
          <span>Loading contributions…</span>
        </div>
      </slot>
    </div>

    <div v-else-if="isEmpty" class="absolute inset-0 z-10 grid place-items-center px-6 text-center">
      <slot name="empty">
        <p class="font-cg-sans text-sm text-cg-muted">
          No contribution data yet. Pass a <code class="font-cg-mono">username</code> or some
          <code class="font-cg-mono">data</code>.
        </p>
      </slot>
    </div>

    <ContributionTooltip
      v-if="showTooltip && hover"
      :count="hover.day.count"
      :date-key="hover.day.date"
      :x="hover.x"
      :y="hover.y"
      :palette="palette"
      :theme="resolvedTheme"
    >
      <template #default="{ count, date }">
        <p class="font-semibold">{{ count }}</p>
        <p v-if="date" class="text-cg-muted">{{ date }}</p>
      </template>
    </ContributionTooltip>

    <slot />
  </div>
</template>
