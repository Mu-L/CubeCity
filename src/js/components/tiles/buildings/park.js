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

  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
