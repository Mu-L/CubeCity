import { SIZE } from '@/constants/constants.js' // 导入常量
import * as THREE from 'three'
import Experience from '../../experience.js'

import Tile from './tile.js'

// City 类，负责管理所有地皮
export default class City {
  constructor() {
    // 获取 Experience 单例
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug
    this.sceneMetadata = this.experience.sceneMetadata
    // 地皮专用 Group
    this.root = new THREE.Group()
    this.scene.add(this.root)
    // 地皮尺寸
    this.size = SIZE
    // 存储所有 tile
    this.meshes = []
    // 统一地皮颜色
    this.params = {
      color: '#8ec07c',
    }

    // 初始化地皮
    this.initTiles()

    // 调试面板
    if (this.debug.active) {
      this.debugInit()
    }
  }

  // 初始化 17x17 地皮，分布在 XOZ 平面 -8~+8
  initTiles() {
    this.meshes = []
    this.root.clear()

    const meta = this.sceneMetadata.getAll()
    for (let x = 0; x < this.size; x++) {
      const row = []
      for (let y = 0; y < this.size; y++) {
        // 读取元数据
        const tileMeta = meta[x]?.[y] || { type: 'grass', building: null }
        const tile = new Tile(x, y, {
          type: tileMeta.type,
          building: tileMeta.building,
          direction: tileMeta.direction !== undefined ? tileMeta.direction : 0, // 传递建筑朝向
        })
        row.push(tile)
        this.root.add(tile)
      }
      // 随后让 group 居中
      // this.root.position.x = -this.size / 2 + 0.5
      // this.root.position.z = -this.size / 2 + 0.5
      this.meshes.push(row)
    }
  }

  // 调试面板，批量调色
  debugInit() {
    this.debugFolder = this.debug.ui.addFolder({
      title: '城市地皮管理',
      expanded: true,
    })
    this.debugFolder.addBinding(this.params, 'color', {
      view: 'color',
      label: '地皮颜色',
    }).on('change', (ev) => {
      this.setAllTileColor(ev.value)
    })
    // 新增：地皮规模调控
    this.debugFolder.addBinding(this, 'size', {
      label: '地皮规模',
      min: 5,
      max: 65,
      step: 2,
    }).on('change', (_ev) => {
      // 变更规模时，重建地皮
      this.initTiles()
    })
  }

  // 批量设置所有 tile 颜色
  setAllTileColor(color) {
    for (const row of this.meshes) {
      for (const tile of row) {
        tile.setColor(color)
      }
    }
  }

  // 更新方法（如有动态行为可扩展）
  update() {
    // 遍历所有地皮，执行各自的 update
    for (const row of this.meshes) {
      for (const tile of row) {
        tile.update()
      }
    }
  }

  getTile(x, y) {
    return this.meshes[x]?.[y]
  }

  // resize方法（如有需要可扩展）
  resize() {
    // 预留
  }
}
