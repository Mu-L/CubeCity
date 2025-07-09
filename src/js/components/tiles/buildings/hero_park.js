import Building from '../building.js'

// 英雄纪念碑 3D 组件
export default class HeroPark extends Building {
  constructor(type = 'hero_park', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)
  }

  // 可扩展升级等方法
  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
