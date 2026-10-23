import { computed, ref, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue'

import type { ContributionDay, ContributionEntry, GitHubContributionsPayload } from '../types'
import { normalizeContributionData } from '../utils/normalize'

/** Base URL of the community contributions API. */
export const GITHUB_CONTRIBUTIONS_API = 'https://github-contributions-api.jogruber.de/v4'

export type ContributionStatus = 'idle' | 'loading' | 'success' | 'error'

export interface UseGitHubContributionsOptions {
  /** GitHub handle to load. Reactive. */
  username?: MaybeRefOrGetter<string | null | undefined>
  /** Year to display. Reactive. Defaults to the current year. */
  year?: MaybeRefOrGetter<number | string | null | undefined>
  /** Load automatically when the username changes. Default `true`. */
  autoLoad?: boolean
  /** Custom `fetch` implementation (useful for tests and SSR mocks). */
  fetchFn?: typeof fetch
}

/**
 * Fetch the full contribution history of a GitHub user.
 *
 * Throws an `Error` with a human readable message on failure.
 */
export async function fetchContributions(
  username: string,
  fetchFn: typeof fetch = fetch,
  signal?: AbortSignal,
): Promise<GitHubContributionsPayload> {
  const handle = username.trim().replace(/^@/, '')
  if (!handle) throw new Error('Enter a GitHub username.')

  const response = await fetchFn(
    `${GITHUB_CONTRIBUTIONS_API}/${encodeURIComponent(handle)}?y=all`,
    signal ? { signal } : undefined,
  )

  if (!response.ok) {
    throw new Error(response.status === 404 ? 'User not found.' : 'Request failed.')
  }

  return (await response.json()) as GitHubContributionsPayload
}

/**
 * Reactive state around the GitHub contributions API.
 *
 * ```ts
 * const { days, years, year, status, load, setYear } = useGitHubContributions({
 *   username: () => 'octocat',
 * })
 * ```
 */
export function useGitHubContributions(options: UseGitHubContributionsOptions = {}) {
  const username = ref((toValue(options.username) ?? '').replace(/^@/, ''))
  const year = ref<string>(String(toValue(options.year) ?? new Date().getFullYear()))
  const payload = shallowRef<GitHubContributionsPayload | null>(null)
  const status = ref<ContributionStatus>('idle')
  const error = ref<string | null>(null)

  let requestId = 0
  let controller: AbortController | null = null

  const years = computed(() =>
    Object.keys(payload.value?.total ?? {})
      .filter((key) => /^\d{4}$/.test(key))
      .sort((a, b) => Number(b) - Number(a)),
  )

  const days = computed<ContributionDay[]>(() => {
    if (!payload.value) return []
    return normalizeContributionData(payload.value.contributions, Number(year.value))
  })

  const totals = computed(() => payload.value?.total ?? {})
  const loading = computed(() => status.value === 'loading')

  /** Fetch (or re-fetch) the profile of `handle`. */
  async function load(handle?: string): Promise<void> {
    const nextUsername = (handle ?? username.value).trim().replace(/^@/, '')
    if (!nextUsername) return

    const currentRequestId = ++requestId
    controller?.abort()
    controller = new AbortController()

    username.value = nextUsername
    status.value = 'loading'
    error.value = null

    try {
      const fetchFn = options.fetchFn ?? fetch
      const result = await fetchContributions(nextUsername, fetchFn, controller.signal)
      if (currentRequestId !== requestId) return

      const availableYears = Object.keys(result.total ?? {})
        .filter((key) => /^\d{4}$/.test(key))
        .sort((a, b) => Number(b) - Number(a))

      if (availableYears.length > 0 && !availableYears.includes(year.value)) {
        year.value = availableYears[0]
      }

      payload.value = result
      status.value = 'success'
    } catch (cause) {
      if (currentRequestId !== requestId) return
      if (cause instanceof DOMException && cause.name === 'AbortError') return
      status.value = 'error'
      error.value = cause instanceof Error ? cause.message : 'Could not load that GitHub profile.'
    }
  }

  /** Switch the rendered year. */
  function setYear(nextYear: number | string): void {
    year.value = String(nextYear)
  }

  function reload(): void {
    void load()
  }

  if (options.autoLoad !== false && username.value) {
    void load()
  }

  if (options.autoLoad !== false && options.username) {
    watch(
      () => toValue(options.username),
      (value) => {
        const handle = (value ?? '').trim().replace(/^@/, '')
        if (handle && handle !== username.value) void load(handle)
      },
    )
  }

  if (options.year) {
    watch(
      () => toValue(options.year),
      (value) => {
        if (value != null && String(value) !== year.value) year.value = String(value)
      },
    )
  }

  return {
    username,
    year,
    years,
    totals,
    days,
    payload,
    status,
    error,
    loading,
    load,
    setYear,
    reload,
  }
}
