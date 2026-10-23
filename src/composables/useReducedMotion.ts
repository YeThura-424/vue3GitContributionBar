import { getCurrentScope, onScopeDispose, ref, type Ref } from 'vue'

/**
 * Tracks the `prefers-reduced-motion` media query.
 *
 * When it resolves to `true` the graph renders its final bar heights right
 * away instead of growing them.
 */
export function useReducedMotion(): Ref<boolean> {
  const reduced = ref(false)

  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return reduced
  }

  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.value = query.matches

  const onChange = (event: MediaQueryListEvent) => {
    reduced.value = event.matches
  }

  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', onChange)
    if (getCurrentScope()) {
      onScopeDispose(() => query.removeEventListener('change', onChange))
    }
  } else {
    // Safari < 14
    query.addListener(onChange)
    if (getCurrentScope()) {
      onScopeDispose(() => query.removeListener(onChange))
    }
  }

  return reduced
}
