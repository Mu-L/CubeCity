import Building from '../building.js'

export default class Police extends Building {
  constructor(type = 'police', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // --- 状态指示系统配置 ---
    this.statusConfig = [
      ...super.getDefaultStatusConfig(),
      // 缺少人员（如有）
      {
        statusType: 'POPULATION_SHORTAGE',
        condition: (building, gs) => gs.population < gs.totalJobs,
        effect: { type: 'missPopulation' },
      },
      // 提供buff等特有状态
      {
        statusType: 'PROVIDING_BUFF',
        condition: (building, gs) => {
          building.buffConfig = { targets: ['shop', 'office'], range: 2 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'upgrade' },
      },
    ]
  }

  upgrade() { return null }
  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
