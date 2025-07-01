import Building from '../building.js'

// 垃圾站 3D 组件
export default class GarbageStation extends Building {
  constructor(type = 'garbage_station', direction = 0, options = {}) {
    super(type, direction, options)
  }

  // 可扩展升级等方法
  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
