import Building from '../building.js'

// 消防站 3D 组件
export default class FireStation extends Building {
  constructor(type = 'fire_station', direction = 0, options = {}) {
    super(type, direction, options)
  }

  // 可扩展升级等方法
  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
