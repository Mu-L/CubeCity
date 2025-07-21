import Building from '../building.js'

// 风力发电塔 3D 组件
export default class WindPower extends Building {
  constructor(type = 'wind_power', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)
    this.mesh.rotateY(-45)
    // 随机的fan 旋转速度
    this.fanRotationSpeed = Math.random() * 0.02 + 0.01

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

  update() {
    // 寻找 name 为 fan 的Object 并旋转他
    this.mesh.traverse((child) => {
      if (child.name === 'fan') {
        child.rotation.x += this.fanRotationSpeed
      }
    })
  }
}
