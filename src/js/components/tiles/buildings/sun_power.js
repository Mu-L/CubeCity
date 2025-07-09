import Building from '../building.js'

// 太阳能电板 3D 组件
export default class SunPower extends Building {
  constructor(type = 'sun_power', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)
  }

  // 可扩展升级等方法
  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
