import { useGameState } from '@/stores/useGameState.js'

import * as THREE from 'three'
import Camera from './camera.js'
import Renderer from './renderer.js'
import sources from './sources.js'
import Debug from './utils/debug.js'
import { eventBus } from './utils/event-bus.js'
import IMouse from './utils/imouse.js'
import Resources from './utils/resources.js'
import Sizes from './utils/sizes.js'
import Stats from './utils/stats.js'
import Time from './utils/time.js'
import PhysicsWorld from './world/physics-world.js'
import World from './world/world.js'

let instance

export default class Experience {
  constructor(canvas) {
    // Singleton
    if (instance) {
      return instance
    }

    instance = this

    // Global access
    window.Experience = this

    this.canvas = canvas

    // 事件总线
    this.eventBus = eventBus

    // 全局状态
    this.gameState = useGameState()

    // this.credits = this.gameState.credits // 资源/金币
    // this.currentMode = this.gameState.currentMode // 当前操作模式
    // this.selectedBuilding = this.gameState.selectedBuilding // 当前选中的建筑类型

    // Panel
    this.debug = new Debug()
    this.stats = new Stats()
    this.sizes = new Sizes(this.canvas)
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.camera = new Camera(true)
    this.renderer = new Renderer()
    this.resources = new Resources(sources)
    this.physics = new PhysicsWorld()
    this.iMouse = new IMouse()
    this.world = new World()

    this.sizes.on('resize', () => {
      this.resize()
    })

    this.time.on('tick', () => {
      this.update()
    })
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    this.camera.update()
    this.world.update()
    this.renderer.update() // 切换为手动更新
    this.stats.update()
    this.iMouse.update()
  }
}
