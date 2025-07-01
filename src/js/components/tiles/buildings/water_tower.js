import Building from '../building.js'

// 水塔 3D 组件
export default class WaterTower extends Building {
  constructor(type = 'water_tower', direction = 0, options = {}) {
    super(type, direction, options)
  }

  // 可扩展升级等方法
  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
