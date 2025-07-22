import Building from '../building.js'

export default class Hospital extends Building {
  constructor(type = 'hospital', level = 1, direction = 0, options = {}) {
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
        effect: { type: 'missPower', offsetY: 0.8 },
      },

      // 缺少服务人口
      {
        statusType: 'MISSING_POPULATION',
        condition: (building, gs) => {
          // 周围没有住宅时激活
          building.buffConfig = { targets: ['house', 'house2'], range: 4 }
          return !building.checkForBuffTargets(gs)
        },
        effect: { type: 'missPopulation', offsetY: 0.8 },
      },

      // 可升级状态
      {
        statusType: 'UPGRADE',
        condition: (building, gs) => {
          const upgradeInfo = building.upgrade()
          return upgradeInfo && gs.credits >= building.getCost()
        },
        effect: { type: 'upgrade', offsetY: 0.8 },
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
