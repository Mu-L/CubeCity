import Building from '../building.js'

// 化工厂类建筑，支持多级升级
export default class ChemistryFactory extends Building {
  constructor(type = 'chemistry_factory', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)
    this.mesh.scale.set(1.2, 1.2, 1.2)

    // --- 状态指示系统配置 ---
    this.statusConfig = [
      ...super.getDefaultStatusConfig(),
      // 电力不足
      {
        statusType: 'POWER_SHORTAGE',
        condition: (building, gs) => gs.power > gs.maxPower,
        effect: { type: 'missPower', scale: 0.6, offsetY: 0.1 },
      },
      // 缺少人员
      {
        statusType: 'POPULATION_SHORTAGE',
        condition: (building, gs) => gs.population < gs.totalJobs,
        effect: { type: 'missPopulation', scale: 0.6, offsetY: -0.5 },
      },
      // 可升级
      {
        statusType: 'UPGRADE_AVAILABLE',
        condition: (building, gs) => {
          const upgradeInfo = building.upgrade()
          return upgradeInfo && gs.credits >= building.getCost()
        },
        effect: { type: 'upgrade', level: this.nextLevel, scale: 0.6, offsetY: -0.5 },
      },
      // 提供增益
      {
        statusType: 'PROVIDING_BUFF',
        condition: (building, gs) => {
          building.buffConfig = { targets: ['factory'] }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'coinBuff', scale: 0.6, offsetY: 0.2 },
      },
    ]
  }

  update() {
    super.update()
    // ... 此处可以添加化学工厂特有的 update 逻辑 ...
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }

  // 化工厂可提供特殊产出
  getChemistryOutput() {
    return 30 // 示例：每级化工厂产出30单位化学品
  }

  // 可扩展更多化工厂特有方法
}
