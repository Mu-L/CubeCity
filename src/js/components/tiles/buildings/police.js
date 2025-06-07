import Building from '../building.js'

export default class Police extends Building {
  constructor(type = 'police', direction = 0, options = {}) {
    super(type, direction, options)
    // this.mesh.scale.set(2, 2, 2)
  }

  upgrade() { return null }
  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
