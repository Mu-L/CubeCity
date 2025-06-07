import Building from '../building.js'

export default class Park extends Building {
  static upgradeMap = {
    park_level1: 'park_level2',
    park_level2: 'park_level3',
    park_level3: null,
  }

  constructor(type = 'park_level1', direction = 0, options = {}) {
    super(type, direction, options)
  }

  upgrade() {
    const nextType = Park.upgradeMap[this.type]
    if (nextType) {
      // 预留材料/金币判断接口
      return new Park(nextType, this.direction, this.options)
    }
    return null
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
