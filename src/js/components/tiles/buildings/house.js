import Building from '../building.js'

// 住宅类建筑
export default class House extends Building {
  constructor(type = 'house', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // --- 状态指示系统配置 ---
    this.statusConfig = [
      ...super.getDefaultStatusConfig(),
      // 人口超负荷
      {
        statusType: 'POPULATION_OVERLOAD',
        condition: (building, gs) => gs.totalJobs > gs.population,
        effect: { type: 'overPopulation', offsetY: 0.8 },
      },
      // 可升级（如有）
      {
        statusType: 'UPGRADE_AVAILABLE',
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

  // 住宅提供人口容量
  getPopulation() {
    return 10 // 示例：每个住宅提供10人口
  }
}
