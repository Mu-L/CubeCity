import Building from '../building.js'

export default class Office extends Building {
  constructor(type = 'office', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // --- 状态指示系统配置 ---
    this.statusConfig = [
      ...super.getDefaultStatusConfig(),
      // 电力不足
      {
        statusType: 'POWER_SHORTAGE',
        condition: (building, gs) => gs.power > gs.maxPower,
        effect: { type: 'missPower', offsetY: 0.7 + level * 0.1 },
      },
      // 缺少人员
      {
        statusType: 'POPULATION_SHORTAGE',
        condition: (building, gs) => gs.totalJobs > gs.maxPopulation,
        effect: { type: 'missPopulation', offsetY: 0.7 + level * 0.1 },
      },
      // 可升级（如有）
      {
        statusType: 'UPGRADE_AVAILABLE',
        condition: (building, gs) => {
          const upgradeInfo = building.upgrade()
          return upgradeInfo && gs.credits >= building.getCost()
        },
        effect: { type: 'upgrade', offsetY: 0.7 + level * 0.1 },
      },
    ]
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
