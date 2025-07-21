import Building from '../building.js'

// 水塔 3D 组件
export default class WaterTower extends Building {
  constructor(type = 'water_tower', level = 1, direction = 0, options = {}) {
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
      // 可升级（如有）
      // ...如有升级逻辑可补充
    ]
  }

  // 可扩展升级等方法
  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
