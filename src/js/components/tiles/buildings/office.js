import Building from '../building.js'

export default class Office extends Building {
  static upgradeMap = {
    office_level1: 'office_level2',
    office_level2: 'office_level3',
    office_level3: null,
  }

  constructor(type = 'office', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
