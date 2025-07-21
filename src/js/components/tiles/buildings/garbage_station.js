import Building from '../building.js'

// 垃圾站 3D 组件
export default class GarbageStation extends Building {
  constructor(type = 'garbage_station', level = 1, direction = 0, options = {}) {
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
          building.buffConfig = { targets: ['factory', 'chemistry-factory', 'nuke-factory'], range: 2 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'missPollution' },
      },
    ]
  }

  // 可扩展升级等方法
  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
