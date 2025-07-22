import Building from '../building.js'

export default class Park extends Building {
  constructor(type = 'park', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // --- 新的轮循状态系统配置 ---
    this.statusConfig = [
      // 继承基础的 debuff 状态（如缺少道路）
      ...super.getDefaultStatusConfig(),

      // === DEBUFF 状态（问题状态，会优先轮循显示） ===

      // 缺少人口（示例 debuff）
      {
        statusType: 'MISSING_POPULATION',
        condition: (building, gs) => {
          // 周围2格内没有住宅建筑时激活
          building.buffConfig = { targets: ['house', 'house2'], range: 2 }
          return !building.checkForBuffTargets(gs)
        },
        effect: { type: 'missPopulation', offsetY: 0.7 },
      },

      // 缺少电力（示例 debuff）
      {
        statusType: 'MISSING_POWER',
        condition: (building, gs) => {
          // 假设公园也需要电力支持
          return gs.power < 1
        },
        effect: { type: 'missPower', offsetY: 0.7 },
      },

      // === BUFF 状态（增益状态，在没有 debuff 时轮循显示） ===

      // 提供居民幸福度增益
      {
        statusType: 'HUMAN_BUFF',
        condition: (building, gs) => {
          // 当周围有住宅时提供人口增益效果
          building.buffConfig = { targets: ['house', 'house2'], range: 1 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'humanBuff', offsetY: 0.7 },
      },

      // 提供经济增益
      {
        statusType: 'COIN_BUFF',
        condition: (building, gs) => {
          // 当公园等级>=2且周围有商业建筑时激活
          building.buffConfig = { targets: ['shop'], range: 1 }
          return this.level >= 2 && building.checkForBuffTargets(gs)
        },
        effect: { type: 'coinBuff', offsetY: 0.7 },
      },

      // 能量增益（高级公园提供）
      {
        statusType: 'POWER_BOOST',
        condition: (building, gs) => {
          // 3级公园可以提供少量电力增益
          return this.level >= 3 && gs.power > 5
        },
        effect: { type: 'powerup', offsetY: 0.7 },
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
