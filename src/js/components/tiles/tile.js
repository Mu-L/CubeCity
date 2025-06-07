import * as THREE from 'three'
import { BUILDING_DATA } from '../../constants.js'
import Experience from '../../experience.js'
import { createBuilding } from './building-factory.js'
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
    super(x, y, null) // 父类不传 mesh，由本类自行管理
    this.experience = experience
    this.scene = experience.scene
    this.resources = resources
    this.debug = experience.debug

    this.name = `Tile-${x}-${y}`
    this.type = type // 草地/道路
    this.direction = direction // 建筑朝向，单位为度
    this.buildingInstance = null

    // ========== 创建 grass mesh ==========
    const grassResource = resources.items.grass ? resources.items.grass : null
    this.grassMesh = grassResource
      ? this.initMeshFromResource(grassResource)
      : new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.2, 1),
        new THREE.MeshStandardMaterial({ color: '#8ec07c' }),
      )
    this.grassMesh.position.set(0, 0, 0)
    this.grassMesh.scale.set(0.98, 1, 0.98)
    this.grassMesh.userData = this
    this.grassMesh.name = `${this.name}-grass`

    // ========== 创建 road mesh（上层，默认隐藏） ==========
    const roadResource = resources.items.road ? resources.items.road : null
    this.roadMesh = roadResource
      ? this.initMeshFromResource(roadResource)
      : new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.2, 1),
        new THREE.MeshStandardMaterial({ color: '#a89984' }),
      )
    this.roadMesh.position.set(0, 0.01, 0) // 稍微高于 grass，避免 z-fighting
    this.roadMesh.scale.set(0.98, 1, 0.98)
    this.roadMesh.userData = this
    this.roadMesh.name = `${this.name}-road`
    this.roadMesh.visible = (type === 'road') // 初始是否显示

    this.grassMesh.add(this.roadMesh)
    this.setMesh(this.grassMesh)

    // 如果有建筑，加载建筑实例
    if (building) {
      this.setBuilding(building, direction)
    }
  }

  // 切换地皮类型（只切换 road mesh 显隐）
  setType(type) {
    this.type = type
    this.roadMesh.visible = (type === 'road')
  }

  // 创建并添加建筑实例
  setBuilding(type, direction = 0) {
    this.removeBuilding()
    // 传递元数据
    const baseType = type.split('_level')[0]
    const options = { buildingData: BUILDING_DATA[baseType] }
    const buildingInstance = createBuilding(type, direction, options)
    if (buildingInstance) {
      this.buildingInstance = buildingInstance
      this.grassMesh.add(buildingInstance)
    }
  }

  // 移除原有建筑实例
  removeBuilding() {
    if (this.buildingInstance) {
      this.grassMesh.remove(this.buildingInstance)
      this.buildingInstance = null
    }
  }

  // 设置材质颜色（只作用于 grass）
  setColor(color) {
    if (this.grassMesh && this.grassMesh.material) {
      this.grassMesh.material.color.set(color)
    }
  }

  update() {
    // 建筑实例存在时，调用其 update
    if (this.buildingInstance) {
      this.buildingInstance.update()
    }
    // ...
  }

  resize() {
    // 预留
  }
}
