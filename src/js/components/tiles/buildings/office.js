import Building from '../building.js'

export default class Office extends Building {
  static upgradeMap = {
    office_level1: 'office_level2',
    office_level2: 'office_level3',
    office_level3: null,
  }

  constructor(type = 'office_level1', direction = 0, options = {}) {
    super(type, direction, options)
  }

  upgrade() {
    const nextType = Office.upgradeMap[this.type]
    if (nextType) {
      // 预留材料/金币判断接口
      return new Office(nextType, this.direction, this.options)
    }
    return null
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
