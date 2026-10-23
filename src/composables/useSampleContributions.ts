import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import type { ContributionDay } from '../types'
import { buildSampleContributions } from '../utils/sample'

/**
 * Deterministic sample data for demos and offline development.
 *
 * ```ts
 * const days = useSampleContributions(() => year.value)
 * ```
 */
export function useSampleContributions(
  year?: MaybeRefOrGetter<number | string | null | undefined>,
  seed?: number,
) {
  return computed<ContributionDay[]>(() => {
    const value = toValue(year)
    const parsed = value == null ? new Date().getFullYear() : Number(value)
    const targetYear = Number.isFinite(parsed) ? parsed : new Date().getFullYear()
    return buildSampleContributions(targetYear, seed)
  })
}
