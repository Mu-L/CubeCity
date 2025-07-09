import Building from '../building.js'

export default class Park extends Building {

  constructor(type = 'park', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
