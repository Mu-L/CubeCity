import Building from '../building.js'

export default class WindPower extends Building {
  constructor(type = 'wind_power', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    this.fanRotationSpeed = 0.01 + Math.random() * 0.02
    // --- 新的轮循状态系统配置 ---
    this.statusConfig = [
      // 环保增益（和垃圾站配合）
      {
        statusType: 'COIN_BUFF',
        condition: (building, gs) => {
          // 周围有垃圾处理设施时提供环保经济增益
          building.buffConfig = { targets: ['garbage_station'], range: 3 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'coinBuff', offsetY: 0.8 },
      },

      // 能源集群增益
      {
        statusType: 'HUMAN_BUFF',
        condition: (building, gs) => {
          // 与其他能源设施形成集群时激活
          building.buffConfig = { targets: ['sun_power', 'factory'], range: 2 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'humanBuff', offsetY: 0.8 },
      },
    ]
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }

  // 风力发电提供清洁电力
  getPower() {
    return 30
  }

  // 重写 update 方法以调用新的轮循系统
  update() {
    // 调用父类的新轮循逻辑
    super.update()

    // 调用需要持续更新的效果（如shader、广告牌朝向相机等）
    super.updateActiveEffect()

    this.mesh.traverse((child) => {
      if (child.name === 'fan') {
        child.rotation.x += this.fanRotationSpeed
      }
    })
  }
}
