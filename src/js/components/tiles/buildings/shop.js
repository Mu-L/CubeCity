import Building from '../building.js'

export default class Shop extends Building {
  constructor(type = 'shop', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // --- 状态指示系统配置 ---
    this.statusConfig = [
      ...super.getDefaultStatusConfig(),
      // 电力不足
      {
        statusType: 'POWER_SHORTAGE',
        condition: (building, gs) => gs.power > gs.maxPower,
        effect: { type: 'missPower', offsetY: 0.7 },
      },
      // 缺少人员
      {
        statusType: 'POPULATION_SHORTAGE',
        condition: (building, gs) => gs.totalJobs > gs.population,
        effect: { type: 'missPopulation' },
      },
      // 可升级（如有）
      {
        statusType: 'UPGRADE_AVAILABLE',
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

  getEconomy() {
    return 20 // 示例：每级商店提供20经济
  }
}
