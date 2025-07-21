import Building from '../building.js'

export default class Park extends Building {
  constructor(type = 'park', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // --- 状态指示系统配置 ---
    this.statusConfig = [
      ...super.getDefaultStatusConfig(),
      // 缺少人员（如有）
      {
        statusType: 'POPULATION_SHORTAGE',
        condition: (building, gs) => gs.totalJobs > gs.population,
        effect: { type: 'missPopulation', offsetY: 0.7 },
      },
      // 提供buff等特有状态
      {
        statusType: 'PROVIDING_BUFF',
        condition: (building, gs) => {
          building.buffConfig = { targets: ['house', 'house2'], range: 2 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'upgrade', offsetY: 0.7 },
      },
    ]
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
