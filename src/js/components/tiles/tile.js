import * as THREE from 'three'
import Experience from '../../experience.js'
import House from './buildings/house.js'
import SimObject from './sim-object.js'
// 未来可引入更多建筑类型

// Tile 类，代表单个地皮格子，继承 SimObject
export default class Tile extends SimObject {
  /**
   * @param {number} x
   * @param {number} y
   * @param {object} options
   *   options.type: 'grass' | 'road'
   *   options.building: null | 'house'
   *   options.color: 颜色字符串
   *   options.direction: 建筑朝向，0/90/180/270，单位为度，默认为0
   */
  constructor(x, y, { type = 'grass', building = null, direction = 0 } = {}) {
    // 获取 Experience 单例
    const experience = new Experience()
    const resources = experience.resources
    // 优先传入地皮资源给父类，若无资源则传 null
    const tileResource = resources.items[type] && resources.items[type].scene ? resources.items[type] : null
    super(x, y, tileResource)
    this.experience = experience
    this.scene = experience.scene
    this.resources = resources
    this.debug = experience.debug

    this.name = `Tile-${x}-${y}`
    this.type = type // 草地/道路
    this.direction = direction // 建筑朝向，单位为度

    // 建筑实例（Building 子类）
    this.buildingInstance = null

    // 如果没有资源，使用占位 mesh
    if (!tileResource) {
      const geometry = new THREE.BoxGeometry(1, 0.2, 1)
      const material = new THREE.MeshStandardMaterial({ color: '#8ec07c' })
      this.mesh = new THREE.Mesh(geometry, material)
      this.mesh.userData = this
      this.mesh.name = this.name
      this.mesh.position.set(0, 0, 0)
      this.mesh.scale.set(0.98, 1, 0.98)
      this.setMesh(this.mesh)
    }
    else {
      // 有资源时，mesh 已由父类 setMesh
      this.mesh.position.set(0, 0, 0)
      this.mesh.scale.set(0.98, 1, 0.98)
    }

    // 如果有建筑，加载建筑实例
    if (building) {
      this.setBuilding(building, direction)
    }
  }

  // 创建并添加建筑实例
  setBuilding(type, direction = 0) {
    // 先移除原有建筑
    this.removeBuilding()
    let buildingInstance = null
    if (type === 'house') {
      buildingInstance = new House(direction)
    }
    // 未来可扩展更多类型
    if (buildingInstance) {
      this.buildingInstance = buildingInstance
      this.mesh.add(buildingInstance)
    }
  }

  // 移除原有建筑实例
  removeBuilding() {
    if (this.buildingInstance) {
      this.mesh.remove(this.buildingInstance)
      this.buildingInstance = null
    }
  }

  // 设置材质颜色
  setColor(color) {
    if (this.mesh) {
      if (this.mesh.material) {
        this.mesh.material.color.set(color)
      }
      else if (this.mesh.children) {
        this.mesh.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.color.set(color)
          }
        })
      }
    }
  }

  update() {
    // 建筑实例存在时，调用其 update
    if (this.buildingInstance) {
      this.buildingInstance.update()
    }
    // 示例：升级逻辑可交由建筑自身处理，或在此处触发
    // ...
  }

  resize() {
    // 预留
  }
}
