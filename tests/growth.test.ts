import { describe, expect, test } from 'vitest'

import { ZERO_HEIGHT } from '../src/constants'
import { GrowthAnimator, easeOutCubic, type GrowthBlock } from '../src/three/growth'

function blocks(...heights: number[]): GrowthBlock[] {
  return heights.map((targetHeight) => ({
    targetHeight,
    scale: { y: ZERO_HEIGHT },
    position: { y: ZERO_HEIGHT / 2 },
  }))
}

describe('GrowthAnimator.replay', () => {
  test('disabling animation immediately restores the final bar heights', () => {
    const animator = new GrowthAnimator({ animate: false, reducedMotion: false })
    const list = blocks(1, 4, 10.5)
    animator.startedAt = 100

    animator.replay(list)

    expect(animator.startedAt).toBeNull()
    for (const block of list) {
      expect(block.scale.y).toBe(block.targetHeight)
      expect(block.position.y).toBe(block.targetHeight / 2)
    }
  })

  test('reduced motion skips the growth entirely', () => {
    const animator = new GrowthAnimator({ animate: true, reducedMotion: true })
    const list = blocks(6)

    animator.replay(list)

    expect(animator.startedAt).toBeNull()
    expect(list[0].scale.y).toBe(6)
  })

  test('animated replays start from the flat placeholder height', () => {
    const animator = new GrowthAnimator({ animate: true, reducedMotion: false })
    const list = blocks(8)

    animator.replay(list)

    expect(animator.startedAt).not.toBeNull()
    expect(list[0].scale.y).toBe(ZERO_HEIGHT)
    expect(list[0].position.y).toBe(ZERO_HEIGHT / 2)
  })
})

describe('GrowthAnimator.tick', () => {
  test('eases the bars towards their target height', () => {
    const animator = new GrowthAnimator({ duration: 2400, animate: true, loop: false })
    const list = blocks(4)
    animator.startedAt = 0

    animator.tick(1200, list) // half way, cubic out easing

    expect(list[0].scale.y).toBeCloseTo(ZERO_HEIGHT + (4 - ZERO_HEIGHT) * 0.875, 10)
    expect(list[0].position.y).toBeCloseTo(list[0].scale.y / 2, 10)
    expect(animator.startedAt).toBe(0) // still running
  })

  test('a completed loop schedules the next run', () => {
    const animator = new GrowthAnimator({
      duration: 2400,
      animate: true,
      loop: true,
      loopDelay: 700,
    })
    const list = blocks(4)
    animator.startedAt = 0

    animator.tick(2400, list)

    expect(list[0].scale.y).toBeCloseTo(4, 10)
    expect(animator.startedAt).toBe(3100)
  })

  test('a finished non looping run stops at the final heights', () => {
    const animator = new GrowthAnimator({ duration: 2400, animate: true, loop: false })
    const list = blocks(4)
    animator.startedAt = 0

    animator.tick(5000, list)

    expect(list[0].scale.y).toBeCloseTo(4, 10)
    expect(animator.startedAt).toBeNull()
  })

  test('a paused scene never schedules another loop', () => {
    const animator = new GrowthAnimator({ duration: 2400, animate: true, loop: true })
    const list = blocks(4)
    animator.startedAt = 0
    animator.paused = true

    animator.tick(2400, list)

    expect(animator.startedAt).toBeNull()
  })

  test('ticks before the start time are ignored', () => {
    const animator = new GrowthAnimator({ duration: 1000, animate: true })
    const list = blocks(9)
    animator.startedAt = 5000
    list[0].scale.y = ZERO_HEIGHT

    animator.tick(4000, list)

    expect(list[0].scale.y).toBe(ZERO_HEIGHT)
    expect(animator.startedAt).toBe(5000)
  })

  test('an idle animator does nothing', () => {
    const animator = new GrowthAnimator()
    const list = blocks(3)
    list[0].scale.y = 0.5

    animator.tick(1000, list)

    expect(list[0].scale.y).toBe(0.5)
    expect(animator.startedAt).toBeNull()
  })

  test('reduced motion stops the loop from restarting', () => {
    const animator = new GrowthAnimator({ duration: 1000, animate: true, loop: true })
    const list = blocks(5)
    animator.startedAt = 0
    animator.reducedMotion = true

    animator.tick(1000, list)

    expect(animator.startedAt).toBeNull()
  })
})

describe('easeOutCubic', () => {
  test('is clamped to the 0-1 range', () => {
    expect(easeOutCubic(-3)).toBe(0)
    expect(easeOutCubic(0)).toBe(0)
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875, 10)
    expect(easeOutCubic(1)).toBe(1)
    expect(easeOutCubic(12)).toBe(1)
  })
})
