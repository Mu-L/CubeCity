import Building from '../building.js'

// 太阳能电板 3D 组件
export default class SunPower extends Building {
  constructor(type = 'sun_power', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // --- 状态指示系统配置 ---
    this.statusConfig = [
      ...super.getDefaultStatusConfig(),
      // 可升级（如有）
      // ...如有升级逻辑可补充
    ]
  }

  // 可扩展升级等方法
  getCost() {
    return this.options.buildingData?.cost || 0
  }
}
