import Building from '../building.js'

export default class Hospital extends Building {
  constructor(type = 'hospital', direction = 0, options = {}) {
    super(type, direction, options)
    this.mesh.scale.set(0.5, 0.5, 0.5)
  }

  upgrade() { return null }
  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
