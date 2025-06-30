import Building from '../building.js'

// 化工厂类建筑，支持多级升级
export default class ChemistryFactory extends Building {
  static upgradeMap = {
    chemistry_level1: 'chemistry_level2',
    chemistry_level2: 'chemistry_level3',
    chemistry_level3: null,
  }

  constructor(type = 'chemistry_level1', direction = 0, options = {}) {
    super(type, direction, options)
  }

  // 升级到下一级化工厂
  upgrade() {
    const nextType = ChemistryFactory.upgradeMap[this.type]
    if (nextType) {
      // 可扩展材料/金币判断逻辑
      return {
        type: nextType,
        direction: this.direction,
        options: this.options,
      }
    }
    return null
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