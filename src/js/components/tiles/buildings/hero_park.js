import Building from '../building.js'

export default class HeroPark extends Building {
  constructor(type = 'hero_park', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // --- 新的轮循状态系统配置 ---
    this.statusConfig = [
      // 继承基础的 debuff 状态（如缺少道路）
      ...super.getDefaultStatusConfig(),

      // === BUFF 状态（英雄公园提供强力增益） ===

      // 强力人口增益
      {
        statusType: 'HUMAN_BUFF',
        condition: (building, gs) => {
          // 为大范围内的住宅提供强力人口增益
          building.buffConfig = { targets: ['house', 'house2'], range: 5 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'humanBuff', offsetY: 0.8 },
      },

      // 经济文化增益
      {
        statusType: 'COIN_BUFF',
        condition: (building, gs) => {
          // 为商业和办公建筑提供文化经济增益
          building.buffConfig = { targets: ['shop', 'office'], range: 4 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'coinBuff', offsetY: 0.8 },
      },

      // 城市灵感增益
      {
        statusType: 'POWER_BOOST',
        condition: (building, gs) => {
          // 当城市发展良好时提供灵感增益
          const hasResidential = this.checkTargetsInRange(['house', 'house2'], 4, gs)
          const hasCommercial = this.checkTargetsInRange(['shop', 'office'], 3, gs)
          const hasServices = this.checkTargetsInRange(['hospital', 'police', 'fire_station'], 4, gs)
          return hasResidential && hasCommercial && hasServices
        },
        effect: { type: 'powerup', offsetY: 0.8 },
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
