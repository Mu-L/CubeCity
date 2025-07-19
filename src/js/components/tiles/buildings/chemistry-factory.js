import Building from '../building.js'

// 化工厂类建筑，支持多级升级
export default class ChemistryFactory extends Building {
  constructor(type = 'chemistry_factory', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)
    this.mesh.scale.set(1.2, 1.2, 1.2)

    // --- 状态指示系统配置 ---
    this.statusConfig = [
      // 优先级 1: 可升级
      {
        statusType: 'UPGRADE_AVAILABLE',
        // 条件：可升级 且 玩家有足够的钱
        condition: (building, gs) => {
          const upgradeInfo = building.upgrade()
          return upgradeInfo && gs.credits >= building.getCost()
        },
        // 效果：蓝色描边
        effect: { type: 'upgrade' },
      },
      // 优先级 2: 提供增益 (假设化工厂能给普通工厂提速)
      {
        statusType: 'PROVIDING_BUFF',
        // 条件：周围有普通工厂
        condition: (building, gs) => {
          // 我们需要定义此建筑能为哪些建筑提供增益
          building.buffConfig = { targets: ['factory'] }
          return building.checkForBuffTargets(gs)
        },
        // 效果：绿色辉光
        effect: { type: 'statusBillboard' },
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
