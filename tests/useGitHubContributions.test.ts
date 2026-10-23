import { describe, expect, test, vi } from 'vitest'

import {
  GITHUB_CONTRIBUTIONS_API,
  fetchContributions,
  useGitHubContributions,
} from '../src/composables/useGitHubContributions'
import type { GitHubContributionsPayload } from '../src/types'

function payload(partial: Partial<GitHubContributionsPayload> = {}): GitHubContributionsPayload {
  return {
    contributions: [
      { date: '2025-05-05', count: 4 },
      { date: '2025-05-06', count: 9 },
    ],
    total: { 2025: 13, 2024: 2 },
    ...partial,
  }
}

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body } as Response
}

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((inner) => {
    resolve = inner
  })
  return { promise, resolve }
}

describe('fetchContributions', () => {
  test('asks the community API for the full history', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse(payload()))

    await fetchContributions('  @octocat ', fetchFn)

    expect(fetchFn).toHaveBeenCalledWith(`${GITHUB_CONTRIBUTIONS_API}/octocat?y=all`, undefined)
  })

  test('rejects an empty handle', async () => {
    await expect(fetchContributions('   ')).rejects.toThrow('Enter a GitHub username.')
  })

  test('turns a 404 into a readable message', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({}, false, 404))

    await expect(fetchContributions('ghost', fetchFn)).rejects.toThrow('User not found.')
  })

  test('turns other failures into a generic message', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({}, false, 500))

    await expect(fetchContributions('octocat', fetchFn)).rejects.toThrow('Request failed.')
  })
})

describe('useGitHubContributions', () => {
  test('loads the profile and exposes the selected year', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse(payload()))
    const { load, status, years, days, year } = useGitHubContributions({
      autoLoad: false,
      year: 2025,
      fetchFn,
    })

    expect(status.value).toBe('idle')

    await load('octocat')

    expect(fetchFn).toHaveBeenCalledOnce()
    expect(status.value).toBe('success')
    expect(years.value).toEqual(['2025', '2024'])
    expect(year.value).toBe('2025')
    expect(days.value.some((day) => day.date === '2025-05-05' && day.count === 4)).toBe(true)
    expect(days.value.every((day) => day.week >= 0)).toBe(true)
  })

  test('loads automatically when a username is provided', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse(payload()))

    const { status } = useGitHubContributions({
      username: () => 'octocat',
      year: 2025,
      fetchFn,
    })

    await vi.waitFor(() => expect(status.value).toBe('success'))
    expect(fetchFn).toHaveBeenCalledOnce()
  })

  test('reports failures without clobbering the status', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({}, false, 404))
    const { load, status, error } = useGitHubContributions({ autoLoad: false, fetchFn })

    await load('nobody')

    expect(status.value).toBe('error')
    expect(error.value).toBe('User not found.')
  })

  test('a stale response cannot overwrite a newer request', async () => {
    const first = deferred<Response>()
    const second = deferred<Response>()
    const fetchFn = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)

    const { load, status, days, username } = useGitHubContributions({ autoLoad: false, fetchFn })

    const firstLoad = load('first-user')
    const secondLoad = load('second-user')

    second.resolve(jsonResponse(payload({ contributions: [{ date: '2025-01-01', count: 7 }] })))
    await secondLoad
    expect(status.value).toBe('success')

    first.resolve(jsonResponse(payload({ contributions: [{ date: '2024-01-01', count: 99 }] })))
    await firstLoad

    expect(username.value).toBe('second-user')
    expect(status.value).toBe('success')
    expect(days.value.some((day) => day.count === 99)).toBe(false)
  })

  test('falls back to the newest available year', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValue(jsonResponse(payload({ total: { 2025: 13, 2024: 2 } })))
    const { load, year } = useGitHubContributions({ autoLoad: false, year: 2031, fetchFn })

    await load('octocat')

    expect(year.value).toBe('2025')
  })

  test('switching the year re-derives the grid', async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      jsonResponse(
        payload({
          contributions: [
            { date: '2025-05-05', count: 4 },
            { date: '2024-05-05', count: 11 },
          ],
          total: { 2025: 4, 2024: 11 },
        }),
      ),
    )
    const { load, setYear, days, year } = useGitHubContributions({ autoLoad: false, fetchFn })

    await load('octocat')
    setYear(2024)

    expect(year.value).toBe('2024')
    expect(days.value.find((day) => day.date === '2024-05-05')?.count).toBe(11)
    // The 2025 day is not part of the 2024 grid at all.
    expect(days.value.find((day) => day.date === '2025-05-05')).toBeUndefined()
  })

  test('a failing request keeps the loading state consistent', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error('Offline'))
    const { load, status, loading, error } = useGitHubContributions({ autoLoad: false, fetchFn })

    const pending = load('octocat')
    expect(loading.value).toBe(true)

    await pending

    expect(loading.value).toBe(false)
    expect(status.value).toBe('error')
    expect(error.value).toBe('Offline')
  })
})
