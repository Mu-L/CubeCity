import Building from '../building.js'

export default class Hospital extends Building {
  constructor(type = 'hospital', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)
    this.mesh.scale.set(0.5, 0.5, 0.5)

    // --- 状态指示系统配置 ---
    this.statusConfig = [
      ...super.getDefaultStatusConfig(),
      // 缺少人员（如有）
      {
        statusType: 'POPULATION_SHORTAGE',
        condition: (building, gs) => gs.totalJobs > gs.population,
        effect: { type: 'missPopulation', offsetY: 1.4, scale: 1.5 },
      },
      // 提供buff等特有状态
      {
        statusType: 'PROVIDING_BUFF',
        condition: (building, gs) => {
          building.buffConfig = { targets: ['house', 'house2'], range: 3 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'upgrade', offsetY: 1.4, scale: 1.5 },
      },
    ]
  }

  upgrade() { return null }
  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
