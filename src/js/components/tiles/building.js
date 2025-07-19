import { BUILDING_DATA } from '@/constants/constants.js'
import * as THREE from 'three'
import Experience from '../../experience.js'
import { BuffEffects } from '../effects.js'
import SimObject from './sim-object.js'

// 建筑物基类，所有具体建筑继承自此类
export default class Building extends SimObject {
  /**
   * @param {string} type 建筑类型
   * @param {number} level 建筑等级
   * @param {number} direction 朝向（0/1/2/3，单位90度）
   * @param {object} [options] 其他可选参数
   */
  constructor(type, level = 1, direction = 0, options = {}) {
    // 位置和资源由外部设置，建筑一般位于tile中心
    super(0, 0, null)
    this.experience = new Experience()
    this.resources = this.experience.resources
    this.type = type
    this.level = level
    this.direction = direction
    this.options = options
    this.levelData = options.levelData || null

    // 状态指示系统相关属性
    this.statusConfig = [] // 由子类定义所有可能的状态及其效果
    this.activeStatusType = null // 当前激活的状态类型 (e.g., 'NO_POWER')
    this.activeStatusInstance = null // 当前激活效果的实例 (e.g., gsap animation)

    this.initModel()
  }

  // 初始化建筑模型
  initModel() {
    const modelName = `${this.type}_level${this.level}`
    const modelResource = this.resources.items[modelName]
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
    // 如果没有状态配置，则什么也不做
    if (!this.statusConfig || this.statusConfig.length === 0) {
      return
    }

    const gameState = this.experience.gameState
    let highestPriorityStatus = null

    // 1. 遍历配置，找到当前优先级最高且被激活的状态
    for (const status of this.statusConfig) {
      if (status.condition(this, gameState)) {
        highestPriorityStatus = status

        break // 找到第一个就停止，因为数组是有序的
      }
    }

    // 2. 状态机逻辑：根据找到的状态更新视觉效果
    const newStatusType = highestPriorityStatus ? highestPriorityStatus.statusType : null

    // 如果新状态和当前状态不同，则更新效果
    if (newStatusType !== this.activeStatusType) {
      // 如果之前有效果，先停掉
      if (this.activeStatusType) {
        this.deactivateStatusEffect()
      }
      // 如果有新状态，启动新效果
      if (highestPriorityStatus) {
        this.activateStatusEffect(highestPriorityStatus.effect)
      }
      this.activeStatusType = newStatusType // 更新当前状态类型
    }

    // 3. 特殊处理：需要每帧更新的效果（如光墙的shader）
    if (this.activeStatusType) {
      this.updateActiveEffect()
    }
  }

  /**
   * 激活状态的视觉效果
   * @param {object} effectConfig - 效果配置
   */
  activateStatusEffect(effectConfig) {
    const handler = BuffEffects[effectConfig.type]

    if (handler) {
      this.activeStatusInstance = handler.activate(this.mesh, effectConfig, this.experience)
    }
    else {
      console.warn(`未找到名为 "${effectConfig.type}" 的效果处理器。`)
    }
  }

  /**
   * 关闭当前激活的状态效果
   */
  deactivateStatusEffect() {
    if (!this.activeStatusType)
      return
    const effectConfig = this.statusConfig.find(s => s.statusType === this.activeStatusType).effect
    const handler = BuffEffects[effectConfig.type]
    if (handler) {
      handler.deactivate(this.mesh, this.activeStatusInstance, this.experience)
      this.activeStatusInstance = null
    }
  }

  /**
   * 更新需要持续调用的效果（如Shader）
   */
  updateActiveEffect() {
    if (!this.activeStatusType)
      return
    const effectConfig = this.statusConfig.find(s => s.statusType === this.activeStatusType).effect
    const handler = BuffEffects[effectConfig.type]
    // 检查处理器是否有 update 方法
    if (handler.update)
      handler.update(this.mesh, this.activeStatusInstance)
  }

  /**
   * 检查周围是否有符合增益条件的目标建筑
   * @param {object} gameState - Pinia 的 gameState 实例
   * @returns {boolean} - 是否找到了目标
   */
  checkForBuffTargets(gameState) {
    if (!gameState)
      return false
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]
    for (const [dx, dy] of dirs) {
      // 使用 this.x 和 this.y 来获取邻居
      const neighborTile = gameState.getTile(this.x + dx, this.y + dy)

      // 检查邻居是否存在，以及其建筑类型是否在我们的目标列表里
      if (neighborTile && this.buffConfig.targets.includes(neighborTile.building)) {
        return true // 只要找到一个目标，就应该激活
      }
    }
    return false // 没有找到任何目标
  }

  /**
   * 通用升级方法：根据 BUILDING_DATA 结构查找下一级 level
   * @returns {object|null} 下一级 {type, level, direction}，或 null（不可升级/已最高级）
   */
  upgrade() {
    const buildingData = BUILDING_DATA[this.type]
    if (!buildingData || !buildingData.levels)
      return null
    const nextLevel = this.level + 1
    const nextLevelData = buildingData.levels[nextLevel]
    if (!nextLevelData)
      return null // 已是最高级
    return {
      type: this.type,
      level: nextLevel,
      direction: this.direction,
    }
  }

  /**
   * 获取建筑升级所需资源
   * @returns {number} 升级所需资源
   */
  getCost() {
    return BUILDING_DATA[this.type].levels[this.level].cost
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
