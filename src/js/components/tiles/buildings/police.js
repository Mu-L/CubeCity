import Building from '../building.js'

export default class Police extends Building {
  constructor(type = 'police', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)
    // this.mesh.scale.set(2, 2, 2)
  }

  upgrade() { return null }
  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
