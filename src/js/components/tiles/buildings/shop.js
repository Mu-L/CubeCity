import Building from '../building.js'

export default class Shop extends Building {
  static upgradeMap = {
    shop_level1: 'shop_level2',
    shop_level2: 'shop_level3',
    shop_level3: null,
  }

  constructor(type = 'shop_level1', direction = 0, options = {}) {
    super(type, direction, options)
  }

  upgrade() {
    const nextType = Shop.upgradeMap[this.type]
    if (nextType) {
      // 预留材料/金币判断接口
      return new Shop(nextType, this.direction, this.options)
    }
    return null
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }

  getEconomy() {
    return 20 // 示例：每级商店提供20经济
  }
}
