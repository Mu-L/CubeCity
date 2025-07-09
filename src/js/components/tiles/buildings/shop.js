import Building from '../building.js'

export default class Shop extends Building {

  constructor(type = 'shop', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }

  getEconomy() {
    return 20 // 示例：每级商店提供20经济
  }
}
