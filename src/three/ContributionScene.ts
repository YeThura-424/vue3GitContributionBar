import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import {
  CELL_GAP,
  CELL_SIZE,
  CELL_STEP,
  DAYS_PER_WEEK,
  DEFAULT_GROW_DURATION,
  WEEKS_PER_YEAR,
  ZERO_HEIGHT,
} from '../constants'
import { getPaletteColors, getSceneColor, resolveTheme } from '../themes'
import type { ContributionDay, PaletteName, ThemeName } from '../types'
import { getBarHeight, getContributionLevel, getMaxContributionCount } from '../utils/levels'
import { GrowthAnimator, type GrowthBlock } from './growth'

/** Emitted when the pointer enters or leaves a bar. */
export interface SceneHover {
  day: ContributionDay
  level: number
  /** Position inside the canvas, in CSS pixels. */
  x: number
  y: number
}

export type SceneHoverListener = (hover: SceneHover | null) => void

export interface ContributionSceneOptions {
  palette?: PaletteName
  theme?: ThemeName | 'auto'
  animate?: boolean
  loop?: boolean
  duration?: number
  showAxisLabels?: boolean
  showGridFrame?: boolean
  reducedMotion?: boolean
  label?: string
}

interface AxisLabel {
  sprite: THREE.Sprite
  anchor: THREE.Vector3
  projected: THREE.Vector3
  kind: 'month-label' | 'weekday-label'
}

// Spread weekday rows in depth so their labels remain distinct in the initial view.
const ROW_STEP = 2.3
const BAR_DEPTH = ROW_STEP - CELL_GAP
const GRID_DEPTH = (DAYS_PER_WEEK - 1) * ROW_STEP + BAR_DEPTH
const FRAME_PADDING = 1
const MONTH_LABEL_OFFSET = 3
const WEEKDAY_LABEL_OFFSET = 3
const INITIAL_CAMERA_POSITION = new THREE.Vector3(10, 30, 35)
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * Owns the Three.js scene behind `<ContributionGraph3D />`.
 *
 * The class is deliberately framework free: the Vue component creates it on
 * mount, forwards prop changes through the setters and calls {@link dispose}
 * on unmount.
 */
export class ContributionScene {
  private readonly container: HTMLElement
  private readonly scene = new THREE.Scene()
  private readonly camera: THREE.PerspectiveCamera
  private readonly renderer: THREE.WebGLRenderer
  private readonly controls: OrbitControls
  private readonly graphGroup = new THREE.Group()
  private readonly sharedGeometry = new THREE.BoxGeometry(CELL_SIZE, 1, BAR_DEPTH)
  private readonly materials: THREE.MeshStandardMaterial[]
  private readonly hoverMaterial: THREE.MeshStandardMaterial
  private readonly ambientLight: THREE.HemisphereLight
  private readonly keyLight: THREE.DirectionalLight
  private readonly rimLight: THREE.DirectionalLight
  private readonly raycaster = new THREE.Raycaster()
  private readonly pointer = new THREE.Vector2(99, 99)
  private readonly animator: GrowthAnimator
  private readonly resizeObserver?: ResizeObserver
  private readonly labelLayer: HTMLElement

  private frame: THREE.Mesh<THREE.ShapeGeometry, THREE.MeshBasicMaterial> | null = null
  private blocks: THREE.Mesh[] = []
  private growthBlocks: GrowthBlock[] = []
  private labels: AxisLabel[] = []
  private days: ContributionDay[] = []
  private hovered: THREE.Mesh | null = null
  private hoverListener: SceneHoverListener | null = null
  private pointerPixel = { x: 0, y: 0 }
  private gridWidth = (WEEKS_PER_YEAR - 1) * CELL_STEP + CELL_SIZE
  private maxCount = 1
  private frameHandle = 0
  private palette: PaletteName
  private theme: ThemeName | 'auto'
  private showAxisLabels: boolean
  private showGridFrame: boolean
  private paused = false
  private disposed = false

  constructor(container: HTMLElement, options: ContributionSceneOptions = {}) {
    this.container = container
    this.palette = options.palette ?? 'forest'
    this.theme = options.theme ?? 'auto'
    this.showAxisLabels = options.showAxisLabels ?? true
    this.showGridFrame = options.showGridFrame ?? true

    this.animator = new GrowthAnimator({
      duration: options.duration ?? DEFAULT_GROW_DURATION,
      animate: options.animate ?? true,
      loop: options.loop ?? false,
      reducedMotion: options.reducedMotion ?? false,
    })

    this.camera = new THREE.PerspectiveCamera(43, 1, 0.1, 180)
    this.camera.position.copy(INITIAL_CAMERA_POSITION)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05

    const canvas = this.renderer.domElement
    canvas.setAttribute('aria-hidden', 'true')
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    container.appendChild(canvas)

    this.labelLayer = document.createElement('div')
    Object.assign(this.labelLayer.style, {
      position: 'absolute',
      inset: '0',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: '1',
    })
    container.appendChild(this.labelLayer)

    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.07
    this.controls.minDistance = 16
    this.controls.maxDistance = 120
    this.controls.maxPolarAngle = Math.PI * 0.47
    this.controls.target.set(0, 1.8, 0)
    this.controls.update()
    this.controls.saveState()

    this.ambientLight = new THREE.HemisphereLight(0xffffff, 0xb8bcb5, 1.2)
    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.4)
    this.keyLight.position.set(-12, 28, 16)
    this.keyLight.castShadow = true
    this.keyLight.shadow.mapSize.set(2048, 2048)
    this.keyLight.shadow.camera.left = -32
    this.keyLight.shadow.camera.right = 32
    this.keyLight.shadow.camera.top = 20
    this.keyLight.shadow.camera.bottom = -20
    this.keyLight.shadow.camera.near = 1
    this.keyLight.shadow.camera.far = 70

    this.rimLight = new THREE.DirectionalLight(0xffffff, 0.45)
    this.rimLight.position.set(18, 12, -22)

    this.scene.add(this.ambientLight, this.keyLight, this.rimLight, this.graphGroup)

    this.materials = getPaletteColors(this.palette).map(
      (color, index) =>
        new THREE.MeshStandardMaterial({
          color,
          roughness: index === 0 ? 0.92 : 0.68,
          metalness: index === 0 ? 0.02 : 0.08,
        }),
    )

    this.hoverMaterial = new THREE.MeshStandardMaterial({
      color: getPaletteColors(this.palette)[3],
      emissive: new THREE.Color(getPaletteColors(this.palette)[2]),
      emissiveIntensity: 0.45,
      roughness: 0.55,
      metalness: 0.1,
    })

    this.applyPalette()
    this.buildFrame()
    this.resize()

    canvas.addEventListener('pointermove', this.onPointerMove)
    canvas.addEventListener('pointerleave', this.onPointerLeave)

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.resize())
      this.resizeObserver.observe(container)
    } else {
      window.addEventListener('resize', this.resize)
    }

    this.frameHandle = requestAnimationFrame(this.renderLoop)
  }

  /* ---------------------------------------------------------------- data -- */

  /** Replace the rendered year. */
  setData(days: readonly ContributionDay[]): void {
    if (this.disposed) return
    this.setHovered(null)
    for (const block of this.blocks) this.graphGroup.remove(block)
    this.blocks = []
    this.growthBlocks = []
    this.days = [...days]

    this.gridWidth = Math.max(0, ...days.map((day) => day.week)) * CELL_STEP + CELL_SIZE
    this.maxCount = getMaxContributionCount(days)

    const flat = this.animator.reducedMotion
    for (const day of this.days) {
      const level = getContributionLevel(day.count, this.maxCount)
      const targetHeight = getBarHeight(day.count, this.maxCount)
      const mesh = new THREE.Mesh(this.sharedGeometry, this.materials[level])

      const x = day.week * CELL_STEP - this.gridWidth / 2 + CELL_SIZE / 2
      const z = day.weekday * ROW_STEP - GRID_DEPTH / 2 + BAR_DEPTH / 2
      mesh.position.set(x, flat ? targetHeight / 2 : ZERO_HEIGHT / 2, z)
      mesh.scale.y = flat ? targetHeight : ZERO_HEIGHT
      mesh.castShadow = day.count > 0
      mesh.receiveShadow = true
      mesh.userData = { day, level, targetHeight }

      this.graphGroup.add(mesh)
      this.blocks.push(mesh)
      this.growthBlocks.push({ targetHeight, scale: mesh.scale, position: mesh.position })
    }

    this.buildFrame()
    this.buildAxisLabels()
    this.fitCameraToGraph()
    this.animator.replay(this.growthBlocks)
  }

  /** Currently rendered days. */
  getData(): readonly ContributionDay[] {
    return this.days
  }

  /* -------------------------------------------------------------- config -- */

  setPalette(palette: PaletteName): void {
    if (palette === this.palette) return
    this.palette = palette
    this.applyPalette()
  }

  setTheme(theme: ThemeName | 'auto'): void {
    if (theme === this.theme) return
    this.theme = theme
    this.applyPalette()
  }

  setAnimation(options: { animate?: boolean; loop?: boolean; duration?: number }): void {
    let needsReplay = false
    if (options.duration !== undefined && options.duration !== this.animator.duration) {
      this.animator.duration = options.duration
      needsReplay = true
    }
    if (options.animate !== undefined && options.animate !== this.animator.animate) {
      this.animator.animate = options.animate
      needsReplay = true
    }
    if (options.loop !== undefined) this.animator.loop = options.loop

    if (needsReplay) this.replay()
  }

  setReducedMotion(reducedMotion: boolean): void {
    this.animator.reducedMotion = reducedMotion
    this.replay()
  }

  setAxisLabels(visible: boolean): void {
    this.showAxisLabels = visible
    if (!visible) for (const label of this.labels) label.sprite.visible = false
  }

  setGridFrame(visible: boolean): void {
    this.showGridFrame = visible
    if (this.frame) this.frame.visible = visible
  }

  /** Block interaction and stop the loop while data is loading. */
  setPaused(paused: boolean): void {
    if (paused === this.paused) return
    this.paused = paused
    this.animator.paused = paused
    this.controls.enabled = !paused
    if (paused) this.setHovered(null)
  }

  setHoverListener(listener: SceneHoverListener | null): void {
    this.hoverListener = listener
  }

  /* ------------------------------------------------------------ controls -- */

  /** Restart the grow animation from the flat state. */
  replay(): void {
    this.animator.replay(this.growthBlocks)
  }

  /** Move the camera back to the default framing. */
  resetView(): void {
    this.fitCameraToGraph(INITIAL_CAMERA_POSITION.clone().normalize())
  }

  /* ------------------------------------------------------------- lifecycle */

  dispose(): void {
    if (this.disposed) return
    this.disposed = true

    cancelAnimationFrame(this.frameHandle)
    this.resizeObserver?.disconnect()
    window.removeEventListener('resize', this.resize)

    const canvas = this.renderer.domElement
    canvas.removeEventListener('pointermove', this.onPointerMove)
    canvas.removeEventListener('pointerleave', this.onPointerLeave)

    this.controls.dispose()

    for (const label of this.labels) {
      label.sprite.material.map?.dispose()
      label.sprite.material.dispose()
      this.scene.remove(label.sprite)
    }
    this.labels = []

    this.clearFrame()
    this.sharedGeometry.dispose()
    for (const material of this.materials) material.dispose()
    this.hoverMaterial.dispose()

    this.scene.clear()
    this.renderer.dispose()
    canvas.remove()
    this.labelLayer.remove()
  }

  /* --------------------------------------------------------------- private */

  private applyPalette(): void {
    const colors = getPaletteColors(this.palette)
    this.materials.forEach((material, index) => material.color.set(colors[index]))
    this.hoverMaterial.color.set(colors[3])
    this.hoverMaterial.emissive.set(colors[2])

    this.scene.background = new THREE.Color(getSceneColor(this.palette))

    const dark = resolveTheme(this.palette, this.theme) === 'dark'
    if (this.frame) {
      this.frame.material.color.set(colors[0])
      this.frame.material.opacity = 1
    }
    this.ambientLight.groundColor.set(dark ? '#41484f' : '#b8bcb5')
    this.ambientLight.intensity = dark ? 1.1 : 1.2
    this.keyLight.intensity = dark ? 1.8 : 2.4

    const labelColor =
      this.palette === 'daylight' ? '#5a6d48' : this.palette === 'midnight' ? '#b1a6c9' : '#a4b292'
    for (const label of this.labels) label.sprite.material.color.set(labelColor)
  }

  private clearFrame(): void {
    if (!this.frame) return
    this.scene.remove(this.frame)
    this.frame.geometry.dispose()
    this.frame.material.dispose()
    this.frame = null
  }

  private buildFrame(): void {
    this.clearFrame()

    const halfWidth = this.gridWidth / 2 + FRAME_PADDING
    const halfDepth = GRID_DEPTH / 2 + FRAME_PADDING
    const borderWidth = 0.7
    const cornerRadius = 0.3
    const outline = new THREE.Shape()
    outline.moveTo(-halfWidth + cornerRadius, -halfDepth)
    outline.lineTo(halfWidth - cornerRadius, -halfDepth)
    outline.quadraticCurveTo(halfWidth, -halfDepth, halfWidth, -halfDepth + cornerRadius)
    outline.lineTo(halfWidth, halfDepth - cornerRadius)
    outline.quadraticCurveTo(halfWidth, halfDepth, halfWidth - cornerRadius, halfDepth)
    outline.lineTo(-halfWidth + cornerRadius, halfDepth)
    outline.quadraticCurveTo(-halfWidth, halfDepth, -halfWidth, halfDepth - cornerRadius)
    outline.lineTo(-halfWidth, -halfDepth + cornerRadius)
    outline.quadraticCurveTo(-halfWidth, -halfDepth, -halfWidth + cornerRadius, -halfDepth)
    outline.closePath()

    const opening = new THREE.Path()
    const innerWidth = halfWidth - borderWidth
    const innerDepth = halfDepth - borderWidth
    const innerRadius = 0.15
    opening.moveTo(-innerWidth, -innerDepth + innerRadius)
    opening.lineTo(-innerWidth, innerDepth - innerRadius)
    opening.quadraticCurveTo(-innerWidth, innerDepth, -innerWidth + innerRadius, innerDepth)
    opening.lineTo(innerWidth - innerRadius, innerDepth)
    opening.quadraticCurveTo(innerWidth, innerDepth, innerWidth, innerDepth - innerRadius)
    opening.lineTo(innerWidth, -innerDepth + innerRadius)
    opening.quadraticCurveTo(innerWidth, -innerDepth, innerWidth - innerRadius, -innerDepth)
    opening.lineTo(-innerWidth + innerRadius, -innerDepth)
    opening.quadraticCurveTo(-innerWidth, -innerDepth, -innerWidth, -innerDepth + innerRadius)
    opening.closePath()
    outline.holes.push(opening)

    const frame = new THREE.Mesh(
      new THREE.ShapeGeometry(outline),
      new THREE.MeshBasicMaterial({
        color: 0x899184,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      }),
    )
    frame.rotation.x = -Math.PI / 2
    frame.position.y = 0.005
    frame.visible = this.showGridFrame
    this.scene.add(frame)
    this.frame = frame
    this.applyPalette()
  }

  private buildAxisLabels(): void {
    for (const label of this.labels) {
      label.sprite.material.map?.dispose()
      label.sprite.material.dispose()
      this.scene.remove(label.sprite)
    }
    this.labels = []
    this.labelLayer.replaceChildren()

    const labelColor =
      this.palette === 'daylight' ? '#5a6d48' : this.palette === 'midnight' ? '#b1a6c9' : '#a4b292'

    const addLabel = (text: string, x: number, z: number, kind: AxisLabel['kind']) => {
      const accessible = document.createElement('span')
      accessible.textContent = text
      Object.assign(accessible.style, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        margin: '-1px',
        padding: '0',
        overflow: 'hidden',
        clipPath: 'inset(50%)',
        whiteSpace: 'nowrap',
        border: '0',
      })
      this.labelLayer.appendChild(accessible)

      const canvas = document.createElement('canvas')
      canvas.width = 192
      canvas.height = 64
      const context = canvas.getContext('2d')
      if (context) {
        context.font = '48px Arial, sans-serif'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillStyle = '#ffffff'
        context.fillText(text, 96, 32)
      }

      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace

      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        color: labelColor,
      })
      const sprite = new THREE.Sprite(material)
      const anchor = new THREE.Vector3(x, 0.12, z)
      sprite.position.copy(anchor)
      this.scene.add(sprite)
      this.labels.push({ sprite, anchor, projected: new THREE.Vector3(), kind })
    }

    let previousMonth = ''
    for (const day of this.days) {
      if (day.isOutsideYear) continue
      const monthKey = day.date.slice(0, 7)
      if (monthKey === previousMonth) continue
      previousMonth = monthKey
      addLabel(
        MONTH_LABELS[Number(day.date.slice(5, 7)) - 1] ?? '',
        day.week * CELL_STEP - this.gridWidth / 2 + CELL_SIZE / 2,
        GRID_DEPTH / 2 + MONTH_LABEL_OFFSET,
        'month-label',
      )
    }

    const rightEdge = this.gridWidth / 2 + WEEKDAY_LABEL_OFFSET
    WEEKDAY_LABELS.forEach((text, weekday) => {
      addLabel(
        text,
        rightEdge,
        weekday * ROW_STEP - GRID_DEPTH / 2 + BAR_DEPTH / 2,
        'weekday-label',
      )
    })

    if (!this.showAxisLabels) {
      for (const label of this.labels) label.sprite.visible = false
    }
  }

  private updateAxisLabels(): void {
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    const visibleMonths: { x: number; y: number }[] = []

    for (const label of this.labels) {
      label.projected.copy(label.anchor).project(this.camera)
      const x = ((label.projected.x + 1) * width) / 2
      const y = ((1 - label.projected.y) * height) / 2

      let visible =
        this.showAxisLabels &&
        label.projected.z >= -1 &&
        label.projected.z <= 1 &&
        x >= 20 &&
        x <= width - 20 &&
        y >= 10 &&
        y <= height - 10

      if (visible && label.kind === 'month-label') {
        visible = !visibleMonths.some(
          (point) => Math.abs(point.x - x) < 36 && Math.abs(point.y - y) < 18,
        )
        if (visible) visibleMonths.push({ x, y })
      }

      label.sprite.visible = visible
      if (!visible) continue

      const labelHeight = 12
      const worldHeight =
        (labelHeight *
          2 *
          this.camera.position.distanceTo(label.anchor) *
          Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))) /
        Math.max(1, height)
      label.sprite.scale.set(worldHeight * 3, worldHeight, 1)
    }
  }

  private fitCameraToGraph(
    direction: THREE.Vector3 = this.camera.position.clone().sub(this.controls.target).normalize(),
  ): void {
    // Include the label margins when centering the complete graph in the viewport.
    const minX = -this.gridWidth / 2 - 1
    const maxX = this.gridWidth / 2 + WEEKDAY_LABEL_OFFSET + 1.5
    const minZ = -GRID_DEPTH / 2 - 1
    const maxZ = GRID_DEPTH / 2 + MONTH_LABEL_OFFSET + 0.8
    const graphHeight = Math.max(
      ZERO_HEIGHT,
      ...this.growthBlocks.map((block) => block.targetHeight),
    )
    const center = new THREE.Vector3((minX + maxX) / 2, graphHeight / 2, (minZ + maxZ) / 2)
    const right = new THREE.Vector3().crossVectors(this.camera.up, direction).normalize()
    const up = new THREE.Vector3().crossVectors(direction, right).normalize()
    const tanVertical = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))
    const tanHorizontal = tanVertical * this.camera.aspect

    let distance = 0
    for (const x of [minX, maxX]) {
      for (const y of [-0.5, graphHeight + 0.5]) {
        for (const z of [minZ, maxZ]) {
          const offset = new THREE.Vector3(x, y, z).sub(center)
          const depth = offset.dot(direction)
          distance = Math.max(
            distance,
            depth + Math.abs(offset.dot(right)) / tanHorizontal,
            depth + Math.abs(offset.dot(up)) / tanVertical,
          )
        }
      }
    }

    distance *= 1.04
    this.controls.maxDistance = Math.max(120, distance * 2)
    this.camera.far = Math.max(180, distance * 3)
    this.camera.position.copy(center).addScaledVector(direction, distance)
    this.controls.target.copy(center)
    this.camera.updateProjectionMatrix()
    this.controls.update()
    this.controls.saveState()
  }

  private onPointerMove = (event: PointerEvent): void => {
    const rect = this.renderer.domElement.getBoundingClientRect()
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    this.pointerPixel = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    if (this.hovered) this.emitHover()
  }

  private onPointerLeave = (): void => {
    this.pointer.set(99, 99)
    this.setHovered(null)
  }

  private setHovered(mesh: THREE.Mesh | null): void {
    if (this.hovered === mesh) return

    if (this.hovered) {
      this.hovered.material = this.materials[this.hovered.userData.level] ?? this.hovered.material
      this.hovered.scale.x = 1
      this.hovered.scale.z = 1
    }

    this.hovered = mesh

    if (!mesh) {
      this.hoverListener?.(null)
      return
    }

    mesh.material = this.hoverMaterial
    mesh.scale.x = 1.12
    mesh.scale.z = 1.12
    this.emitHover()
  }

  private emitHover(): void {
    if (!this.hovered) return
    const { day, level } = this.hovered.userData as {
      day: ContributionDay
      level: number
    }
    this.hoverListener?.({ day, level, x: this.pointerPixel.x, y: this.pointerPixel.y })
  }

  private resize = (): void => {
    if (this.disposed) return
    const width = Math.max(1, this.container.clientWidth)
    const height = Math.max(1, this.container.clientHeight)

    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.fov = width < 600 ? 58 : 43
    this.camera.updateProjectionMatrix()
    this.fitCameraToGraph()
  }

  private renderLoop = (now: number): void => {
    if (this.disposed) return
    this.frameHandle = requestAnimationFrame(this.renderLoop)

    this.animator.tick(now, this.growthBlocks)

    if (!this.paused) {
      this.raycaster.setFromCamera(this.pointer, this.camera)
      const hit = this.raycaster.intersectObjects(this.blocks, false)[0]
      this.setHovered(hit ? (hit.object as THREE.Mesh) : null)
    }

    this.controls.update()
    this.updateAxisLabels()
    this.renderer.render(this.scene, this.camera)
  }
}
