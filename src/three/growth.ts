import { DEFAULT_GROW_DURATION, LOOP_DELAY, ZERO_HEIGHT } from '../constants'

/** Minimal shape the animator needs from a Three.js bar. */
export interface GrowthBlock {
  targetHeight: number
  scale: { y: number }
  position: { y: number }
}

export interface GrowthAnimatorOptions {
  /** Grow duration in milliseconds. */
  duration?: number
  /** Whether bars grow from the ground up. */
  animate?: boolean
  /** Restart the animation after it finishes. */
  loop?: boolean
  /** The visitor prefers reduced motion. */
  reducedMotion?: boolean
  /** Delay between loops, in milliseconds. */
  loopDelay?: number
}

/**
 * Time based grow animation for the bars.
 *
 * Kept free of Three.js on purpose so the easing, looping and reduced motion
 * rules can be unit tested without a WebGL context.
 */
export class GrowthAnimator {
  duration: number
  animate: boolean
  loop: boolean
  reducedMotion: boolean
  loopDelay: number

  /** Timestamp the current run started at, or `null` when idle. */
  startedAt: number | null = null

  /** Freezes the animation while data is loading. */
  paused = false

  constructor(options: GrowthAnimatorOptions = {}) {
    this.duration = options.duration ?? DEFAULT_GROW_DURATION
    this.animate = options.animate ?? true
    this.loop = options.loop ?? false
    this.reducedMotion = options.reducedMotion ?? false
    this.loopDelay = options.loopDelay ?? LOOP_DELAY
  }

  /** Restart from the flat state, or jump straight to the final heights. */
  replay(blocks: readonly GrowthBlock[]): void {
    if (!this.animate || this.reducedMotion) {
      this.startedAt = null
      this.applyFinalHeights(blocks)
      return
    }

    this.applyHeight(blocks, ZERO_HEIGHT)
    this.startedAt = performance.now()
  }

  /** Advance the animation to `now` (a `requestAnimationFrame` timestamp). */
  tick(now: number, blocks: readonly GrowthBlock[]): void {
    if (this.startedAt === null || now < this.startedAt) return

    const duration = Math.max(1, this.duration)
    const progress = Math.min(1, (now - this.startedAt) / duration)
    const eased = 1 - Math.pow(1 - progress, 3)

    for (const block of blocks) {
      const height = ZERO_HEIGHT + (block.targetHeight - ZERO_HEIGHT) * eased
      block.scale.y = height
      block.position.y = height / 2
    }

    if (progress < 1) return

    this.startedAt =
      this.loop && this.animate && !this.reducedMotion && !this.paused ? now + this.loopDelay : null
  }

  /** Immediately render the final heights. */
  applyFinalHeights(blocks: readonly GrowthBlock[]): void {
    for (const block of blocks) {
      block.scale.y = block.targetHeight
      block.position.y = block.targetHeight / 2
    }
  }

  private applyHeight(blocks: readonly GrowthBlock[], height: number): void {
    for (const block of blocks) {
      block.scale.y = height
      block.position.y = height / 2
    }
  }
}

/** Cubic out easing shared by the animator and the docs playground. */
export function easeOutCubic(progress: number): number {
  const clamped = Math.max(0, Math.min(1, progress))
  return 1 - Math.pow(1 - clamped, 3)
}
