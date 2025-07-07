import Building from '../building.js'

// 住宅类建筑
export default class House extends Building {
  static upgradeMap = {
    house_level1: 'house_level2',
    house_level2: 'house_level3',
    house_level3: null,
    house2_level1: 'house2_level2',
    house2_level2: 'house2_level3',
    house2_level3: null,
  }

  constructor(type = 'house_level1', direction = 0, options = {}) {
    super(type, direction, options)
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }

  // 住宅提供人口容量
  getPopulation() {
    return 10 // 示例：每个住宅提供10人口
  }

  // 可扩展更多住宅特有方法
}
