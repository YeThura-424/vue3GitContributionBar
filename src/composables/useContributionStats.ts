import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import type { ContributionDay, ContributionStats } from '../types'
import { computeStats } from '../utils/stats'

const EMPTY_STATS: ContributionStats = {
  total: 0,
  activeDays: 0,
  longestStreak: 0,
  bestDay: null,
}

/**
 * Reactive wrapper around {@link computeStats}.
 *
 * ```ts
 * const stats = useContributionStats(() => days.value)
 * ```
 */
export function useContributionStats(
  days: MaybeRefOrGetter<readonly ContributionDay[] | null | undefined>,
) {
  return computed<ContributionStats>(() => {
    const list = toValue(days)
    return list && list.length > 0 ? computeStats(list) : EMPTY_STATS
  })
}
