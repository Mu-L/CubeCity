import Building from '../building.js'

export default class Office extends Building {
  constructor(type = 'office', level = 1, direction = 0, options = {}) {
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
        effect: { type: 'missPower', offsetY: 0.7 + this.level * 0.1 },
      },

      // 缺少人口
      {
        statusType: 'MISSING_POPULATION',
        condition: (building, gs) => {
          // 周围没有住宅时激活
          building.buffConfig = { targets: ['house', 'house2'], range: 3 }
          return !building.checkForBuffTargets(gs)
        },
        effect: { type: 'missPopulation', offsetY: 0.7 + this.level * 0.1 },
      },

      // === BUFF 状态（增益状态，无问题时轮循显示） ===

      // 提供经济增益
      {
        statusType: 'COIN_BUFF',
        condition: (building, gs) => {
          // 周围有住宅时提供经济增益
          building.buffConfig = { targets: ['house', 'house2'], range: 2 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'coinBuff', offsetY: 0.7 + this.level * 0.1 },
      },

      // 人口增益（商业区效应）
      {
        statusType: 'HUMAN_BUFF',
        condition: (building, gs) => {
          // 周围有商店时提供人口增益
          building.buffConfig = { targets: ['shop'], range: 2 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'humanBuff', offsetY: 0.7 + this.level * 0.1 },
      },

      // 能源增益（高级办公楼）
      {
        statusType: 'POWER_BOOST',
        condition: (building, gs) => {
          // 3级办公楼在商业区中心时提供少量电力增益
          const hasShops = this.checkTargetsInRange(['shop'], 1, gs)
          const hasHouses = this.checkTargetsInRange(['house', 'house2'], 2, gs)
          return this.level >= 3 && hasShops && hasHouses
        },
        effect: { type: 'powerup', offsetY: 0.7 + this.level * 0.1 },
      },

      // 可升级状态
      {
        statusType: 'UPGRADE',
        condition: (building, gs) => {
          const upgradeInfo = building.upgrade()
          return upgradeInfo && gs.credits >= building.getCost()
        },
        effect: { type: 'upgrade', offsetY: 0.7 + this.level * 0.1 },
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
