import Building from '../building.js'

// 化工厂类建筑，支持多级升级
export default class ChemistryFactory extends Building {
  constructor(type = 'chemistry_factory', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)
    this.mesh.scale.set(1.2, 1.2, 1.2)
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
