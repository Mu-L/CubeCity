import Building from '../building.js'

export default class Park extends Building {
  constructor(type = 'park', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // 使用新的配置系统，大部分状态效果已在配置文件中定义
    this.statusConfig = [
      // 继承基础的状态配置（包括道路检查和配置文件中的所有效果）
      ...super.getDefaultStatusConfig(),

      // === 特殊状态（无法配置化的复杂逻辑） ===

      // // 缺少电力（全局状态检查）
      // {
      //   statusType: 'MISSING_POWER',
      //   condition: (building, gs) => gs.power > gs.maxPower,
      //   effect: { type: 'missPower', offsetY: 0.7 },
      // },

      // // 高级公园的能量增益（等级依赖）
      // {
      //   statusType: 'POWER_BOOST',
      //   condition: (building, gs) => {
      //     // 3级公园可以提供少量电力增益
      //     return this.level >= 3 && gs.power > 5
      //   },
      //   effect: { type: 'powerup', offsetY: 0.7 },
      // },

      // 可升级状态（依赖复杂的升级逻辑）
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
