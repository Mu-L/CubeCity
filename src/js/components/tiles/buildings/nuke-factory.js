import Building from '../building.js'

// 核工厂类建筑
export default class NukeFactory extends Building {
  constructor(type = 'nuke_factory', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // --- 新的轮循状态系统配置 ---
    this.statusConfig = [
      // 继承基础的 debuff 状态（如缺少道路）
      ...super.getDefaultStatusConfig(),

      // === DEBUFF 状态（问题状态，优先轮循显示） ===

      // 缺少安全服务
      {
        statusType: 'MISSING_POPULATION',
        condition: (building, gs) => {
          // 核工厂需要强制安全服务覆盖
          building.buffConfig = { targets: ['police', 'fire_station'], range: 4 }
          return !building.checkForBuffTargets(gs)
        },
        effect: { type: 'missPopulation', offsetY: 0.8 },
      },

      // 缺少废料处理
      {
        statusType: 'MISSING_POLLUTION',
        condition: (building, gs) => {
          // 核工厂必须有垃圾处理设施
          building.buffConfig = { targets: ['garbage_station'], range: 3 }
          return !building.checkForBuffTargets(gs)
        },
        effect: { type: 'missPollution', offsetY: 0.8 },
      },

      // 人口过载风险
      {
        statusType: 'OVER_POPULATION',
        condition: (building, gs) => {
          // 周围人口密度过高时激活风险警告
          const nearbyHouses = this.countTargetsInRange(['house', 'house2'], 3, gs)
          return nearbyHouses > 2 // 周围超过2栋住宅时警告
        },
        effect: { type: 'overPopulation', offsetY: 0.8 },
      },

      // === BUFF 状态（增益状态，无问题时轮循显示） ===

      // 强力电力增益
      {
        statusType: 'POWER_BOOST',
        condition: (building, gs) => {
          // 安全运行时提供强力电力增益
          const hasSafety = this.checkTargetsInRange(['police', 'fire_station'], 4, gs)
          const hasCleanup = this.checkTargetsInRange(['garbage_station'], 3, gs)
          return hasSafety && hasCleanup
        },
        effect: { type: 'powerup', offsetY: 0.8 },
      },

      // 高端经济增益
      {
        statusType: 'COIN_BUFF',
        condition: (building, gs) => {
          // 完整的工业区配套时激活
          const hasIndustrial = this.checkTargetsInRange(['factory', 'chemistry_factory'], 4, gs)
          const hasServices = this.checkTargetsInRange(['hospital'], 4, gs)
          return hasIndustrial && hasServices
        },
        effect: { type: 'coinBuff', offsetY: 0.8 },
      },

      // 可升级状态
      {
        statusType: 'UPGRADE',
        condition: (building, gs) => {
          const upgradeInfo = building.upgrade()
          const hasSafety = this.checkTargetsInRange(['police', 'fire_station'], 4, gs)
          // 核工厂升级需要安全保障
          return upgradeInfo && gs.credits >= building.getCost() && hasSafety
        },
        effect: { type: 'upgrade', offsetY: 0.8 },
      },
    ]
  }

  // 辅助方法：检查指定范围内的目标
  checkTargetsInRange(targets, range, gameState) {
    this.buffConfig = { targets, range }
    return this.checkForBuffTargets(gameState)
  }

  // 辅助方法：计算指定范围内的目标数量
  countTargetsInRange(targets, range, gameState) {
    if (!gameState)
      return 0

    let count = 0
    for (let dx = -range; dx <= range; dx++) {
      for (let dy = -range; dy <= range; dy++) {
        if (dx === 0 && dy === 0)
          continue

        const neighborTile = gameState.getTile(this.x + dx, this.y + dy)
        if (neighborTile && targets.includes(neighborTile.building)) {
          count++
        }
      }
    }
    return count
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }

  // 核工厂提供最强电力但有风险
  getPower() {
    return 150
  }

  // 重写 update 方法以调用新的轮循系统
  update() {
    // 调用父类的新轮循逻辑
    super.update()

    // 调用需要持续更新的效果（如shader、广告牌朝向相机等）
    super.updateActiveEffect()
  }
}
