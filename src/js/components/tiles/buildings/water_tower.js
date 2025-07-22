import Building from '../building.js'

export default class WaterTower extends Building {
  constructor(type = 'water_tower', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // --- 新的轮循状态系统配置 ---
    this.statusConfig = [
      // 继承基础的 debuff 状态（如缺少道路）
      ...super.getDefaultStatusConfig(),

      // === BUFF 状态（水塔主要提供正面效果） ===

      // 提供水资源增益
      {
        statusType: 'HUMAN_BUFF',
        condition: (building, gs) => {
          // 为周围住宅提供水资源增益
          building.buffConfig = { targets: ['house', 'house2'], range: 4 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'humanBuff', offsetY: 1.2 },
      },

      // 工业支持增益
      {
        statusType: 'POWER_BOOST',
        condition: (building, gs) => {
          // 为工业建筑提供水资源支持
          building.buffConfig = { targets: ['factory', 'chemistry_factory'], range: 3 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'powerup', offsetY: 1.2 },
      },

      // 城市基础设施增益
      {
        statusType: 'COIN_BUFF',
        condition: (building, gs) => {
          // 与其他基础设施形成网络时激活
          const hasServices = this.checkTargetsInRange(['hospital', 'police', 'fire_station'], 4, gs)
          const hasUtilities = this.checkTargetsInRange(['garbage_station'], 3, gs)
          return hasServices || hasUtilities
        },
        effect: { type: 'coinBuff', offsetY: 1.2 },
      },
    ]
  }

  // 辅助方法：检查指定范围内的目标
  checkTargetsInRange(targets, range, gameState) {
    this.buffConfig = { targets, range }
    return this.checkForBuffTargets(gameState)
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }

  // 重写 update 方法以调用新的轮循系统
  update() {
    // 调用父类的新轮循逻辑
    super.update()

    // 调用需要持续更新的效果（如shader、广告牌朝向相机等）
    super.updateActiveEffect()
  }
}
