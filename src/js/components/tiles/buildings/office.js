import Building from '../building.js'

export default class Office extends Building {

  constructor(type = 'office', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
