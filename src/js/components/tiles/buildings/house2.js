import Building from '../building.js'

// 住宅类建筑
export default class House extends Building {

  constructor(type = 'house2', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)
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
