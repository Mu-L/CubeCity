import Building from '../building.js'

// 英雄纪念碑 3D 组件
export default class HeroPark extends Building {
  constructor(type = 'hero_park', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // --- 状态指示系统配置 ---
    this.statusConfig = [
      ...super.getDefaultStatusConfig(),
      // 缺少人员（如有）
      {
        statusType: 'POPULATION_SHORTAGE',
        condition: (building, gs) => gs.population < gs.totalJobs,
        effect: { type: 'missPopulation', offsetY: 0.7 },
      },
      // 其他特有状态...
    ]
  }

  // 可扩展升级等方法
  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
