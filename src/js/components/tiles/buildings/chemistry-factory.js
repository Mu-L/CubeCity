import Building from '../building.js'

export default class ChemistryFactory extends Building {
  constructor(type = 'chemistry_factory', level = 1, direction = 0, options = {}) {
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
        effect: { type: 'missPower', offsetY: 0.7 },
      },

      // 缺少工业支持
      {
        statusType: 'MISSING_POPULATION',
        condition: (building, gs) => {
          // 需要基础工厂支持
          building.buffConfig = { targets: ['factory'], range: 3 }
          return !building.checkForBuffTargets(gs)
        },
        effect: { type: 'missPopulation', offsetY: 0.7 },
      },

      // 环境污染警告
      {
        statusType: 'MISSING_POLLUTION',
        condition: (building, gs) => {
          // 周围没有垃圾站时激活污染警告
          building.buffConfig = { targets: ['garbage_station'], range: 3 }
          return !building.checkForBuffTargets(gs)
        },
        effect: { type: 'missPollution', offsetY: 0.7 },
      },

      // === BUFF 状态（增益状态，无问题时轮循显示） ===

      // 高级工业增益
      {
        statusType: 'POWER_BOOST',
        condition: (building, gs) => {
          // 与基础工厂形成工业集群时激活
          building.buffConfig = { targets: ['factory'], range: 2 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'powerup', offsetY: 0.7 },
      },

      // 经济增益
      {
        statusType: 'COIN_BUFF',
        condition: (building, gs) => {
          // 工业区完善时提供经济增益
          const hasFactory = this.checkTargetsInRange(['factory'], 2, gs)
          const hasCleanup = this.checkTargetsInRange(['garbage_station'], 3, gs)
          return hasFactory && hasCleanup
        },
        effect: { type: 'coinBuff', offsetY: 0.7 },
      },

      // 可升级状态
      {
        statusType: 'UPGRADE',
        condition: (building, gs) => {
          const upgradeInfo = building.upgrade()
          return upgradeInfo && gs.credits >= building.getCost()
        },
        effect: { type: 'upgrade', offsetY: 0.7 },
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

  // 化工厂提供高级电力
  getPower() {
    return 75
  }

  // 重写 update 方法以调用新的轮循系统
  update() {
    // 调用父类的新轮循逻辑
    super.update()

    // 调用需要持续更新的效果（如shader、广告牌朝向相机等）
    super.updateActiveEffect()
  }
}
