import Building from '../building.js'

// 消防站 3D 组件
export default class FireStation extends Building {
  constructor(type = 'fire_station', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // --- 状态指示系统配置 ---
    this.statusConfig = [
      ...super.getDefaultStatusConfig(),
      // 缺少人员（如有）
      {
        statusType: 'POPULATION_SHORTAGE',
        condition: (building, gs) => gs.totalJobs > gs.population,
        effect: { type: 'missPopulation' },
      },
      // 提供buff等特有状态
      {
        statusType: 'PROVIDING_BUFF',
        condition: (building, gs) => {
          building.buffConfig = { targets: ['factory', 'chemistry-factory', 'nuke-factory'], range: 2 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'upgrade' },
      },
    ]
  }

  // 可扩展升级等方法
  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
