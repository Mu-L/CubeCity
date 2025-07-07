import * as THREE from 'three'
import Experience from '../../experience.js'
import SimObject from './sim-object.js'

// 建筑物基类，所有具体建筑继承自此类
export default class Building extends SimObject {
  /**
   * @param {string} type 建筑类型
   * @param {number} direction 朝向（0/1/2/3，单位90度）
   * @param {object} [options] 其他可选参数
   */
  constructor(type, direction = 0, options = {}) {
    // 位置和资源由外部设置，建筑一般位于tile中心
    super(0, 0, null)
    this.experience = new Experience()
    this.resources = this.experience.resources
    this.type = type
    this.direction = direction
    this.options = options
    this.initModel()
  }

  // 初始化建筑模型
  initModel() {
    const modelResource = this.resources.items[this.type]
    if (modelResource && modelResource.scene) {
      const mesh = this.initMeshFromResource(modelResource)
      mesh.position.set(0, 0, 0)
      mesh.scale.set(0.8, 0.8, 0.8)
      // 设置朝向
      const angle = (this.direction % 4) * 90
      mesh.rotation.y = THREE.MathUtils.degToRad(angle)
      // 禁止建筑被选中
      mesh.raycast = () => {}
      this.setMesh(mesh)
    }
    else {
      // 没有资源时，使用占位体
      const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8)
      const material = new THREE.MeshStandardMaterial({ color: '#bdae93' })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(0, 0.4, 0)
      this.setMesh(mesh)
    }
  }

  // 可被子类重写：升级、产出等
  update() {
  }

  /**
   * 通用升级方法：根据命名规则推算下一级类型
   * @returns {object|null} 下一级类型信息，或 null（不可升级/已最高级）
   */
  upgrade() {
    // 匹配形如 'xxx_level1' 的类型
    const match = this.type.match(/^(.*)_level(\d+)$/)
    if (!match) {
      // 不可升级类型，直接返回 null
      return null
    }
    const base = match[1]
    const level = Number.parseInt(match[2], 10)
    const nextLevel = level + 1
    // 假设最高级为 level3，可根据实际情况调整
    if (nextLevel > 3) {
      return null // 已是最高级
    }
    return {
      type: `${base}_level${nextLevel}`,
      direction: this.direction,
      options: this.options,
    }
  }

  getPopulation() { return 0 }
  getPower() { return 0 }
  getEconomy() { return 0 }

  // 可重写：返回建筑信息
  toHTML() {
    const dirMap = ['右', '下', '左', '上']
    const dirText = dirMap[this.direction % 4] || this.direction
    return `
      <div class="info-heading text-lg font-bold mb-2 text-green-700">建筑信息</div>
      <div class="flex flex-col gap-1">
        <div><span class="info-label text-gray-500">类型：</span><span class="info-value text-gray-800">${this.type}</span></div>
        <div><span class="info-label text-gray-500">朝向：</span><span class="info-value text-gray-800">${dirText}</span></div>
      </div>
    `
  }
}
