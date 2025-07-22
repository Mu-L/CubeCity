import Building from '../building.js'

export default class GarbageStation extends Building {
  constructor(type = 'garbage_station', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // --- 新的轮循状态系统配置 ---
    this.statusConfig = [
      // 继承基础的 debuff 状态（如缺少道路）
      ...super.getDefaultStatusConfig(),

      // === DEBUFF 状态（问题状态，优先轮循显示） ===

      // 缺少电力
      {
        statusType: 'MISSING_POWER',
        condition: (building, gs) => gs.power < 1,
        effect: { type: 'missPower', offsetY: 0.6 },
      },

      // === BUFF 状态（增益状态，无问题时轮循显示） ===

      // 环境净化增益
      {
        statusType: 'COIN_BUFF',
        condition: (building, gs) => {
          // 为周围工业建筑提供环境净化增益
          building.buffConfig = { targets: ['factory', 'chemistry_factory', 'nuke_factory'], range: 4 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'coinBuff', offsetY: 0.6 },
      },

      // 清洁能源协同
      {
        statusType: 'POWER_BOOST',
        condition: (building, gs) => {
          // 与清洁能源设施协同工作时激活
          building.buffConfig = { targets: ['wind_power', 'sun_power'], range: 3 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'powerup', offsetY: 0.6 },
      },

      // 城市健康增益
      {
        statusType: 'HUMAN_BUFF',
        condition: (building, gs) => {
          // 为整个城市提供环境健康增益
          const hasResidential = this.checkTargetsInRange(['house', 'house2'], 5, gs)
          const hasCommercial = this.checkTargetsInRange(['shop', 'office'], 4, gs)
          return hasResidential && hasCommercial
        },
        effect: { type: 'humanBuff', offsetY: 0.6 },
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
