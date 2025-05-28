import * as THREE from 'three'
import Experience from '../../experience.js'
import SimObject from './sim-object.js'

// Tile 类，代表单个地皮格子，继承 SimObject
export default class Tile extends SimObject {
  /**
   * @param {number} x
   * @param {number} y
   * @param {object} options
   *   options.type: 'grass' | 'road'
   *   options.building: null | 'house' | 'house-2'
   *   options.color: 颜色字符串
   *   options.direction: 建筑朝向，0/90/180/270，单位为度，默认为0
   */
  constructor(x, y, { type = 'grass', building = null, color = '#8ec07c', direction = 0 } = {}) {
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
    this.building = building // 建筑类型
    this.color = color // 由 City 统一管理
    this.direction = direction // 建筑朝向，单位为度

    // 如果没有资源，使用占位 mesh
    if (!tileResource) {
      const geometry = new THREE.BoxGeometry(1, 0.2, 1)
      const material = new THREE.MeshStandardMaterial({ color: this.color })
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

    // 如果有建筑，加载建筑模型
    if (this.building) {
      this.setBuilding()
    }
  }

  // 加载建筑模型
  setBuilding() {
    const buildingModel = this.resources.items[this.building]
    if (buildingModel && buildingModel.scene) {
      // 用 SimObject 的 mesh 初始化方法
      const buildingMesh = this.initMeshFromResource(buildingModel)
      // 建筑模型适当缩放和定位
      buildingMesh.position.set(0, 0, 0)
      buildingMesh.scale.set(0.8, 0.8, 0.8)
      // 将 direction (0/1/2/3) 转换为角度（0/90/180/270），并设置建筑朝向（绕Y轴旋转）
      const angle = (this.direction % 4) * 90 // 0:右 1:下 2:左 3:上
      buildingMesh.rotation.y = THREE.MathUtils.degToRad(angle)
      this.mesh.add(buildingMesh)
      this.buildingMesh = buildingMesh
    }
  }

  // 设置材质颜色
  setColor(color) {
    this.color = color
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
    // 获取场景元数据实例
    const sceneMetadata = this.experience.sceneMetadata

    if (this.building === 'house') {
      if (Math.random() < 0.001) {
        this.removeBuilding()
        this.building = 'house_level2'
        this.setBuilding()
        // 同步元数据
        sceneMetadata.set(this.x, this.y, { building: this.building })
      }
    }
    // 3. house_level2 有 1% 概率升级为 house_level3
    else if (this.building === 'house_level2') {
      if (Math.random() < 0.01) {
        this.removeBuilding()
        this.building = 'house_level3'
        this.setBuilding()
        // 同步元数据
        sceneMetadata.set(this.x, this.y, { building: this.building })
      }
    }
  }

  // 新增：移除原有建筑 mesh
  removeBuilding() {
    if (this.buildingMesh) {
      this.remove(this.buildingMesh)
      this.buildingMesh = null
    }
  }

  resize() {
    // 预留
  }
}
