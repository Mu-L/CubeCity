import Building from '../building.js'

export default class SunPower extends Building {
  constructor(type = 'sun_power', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // --- 新的轮循状态系统配置 ---
    this.statusConfig = [
      // 继承基础的 debuff 状态（如缺少道路）
      ...super.getDefaultStatusConfig(),

      // === BUFF 状态（能源建筑主要提供正面效果） ===

      // 提供电力增益
      {
        statusType: 'POWER_BOOST',
        condition: (building, gs) => {
          // 太阳能发电站正常运行时激活
          return gs.power >= 0
        },
        effect: { type: 'powerup', offsetY: 0.6 },
      },

      // 环保增益（清洁能源）
      {
        statusType: 'COIN_BUFF',
        condition: (building, gs) => {
          // 周围有住宅时提供环保经济增益
          building.buffConfig = { targets: ['house', 'house2'], range: 3 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'coinBuff', offsetY: 0.6 },
      },

      // 能源集群增益
      {
        statusType: 'HUMAN_BUFF',
        condition: (building, gs) => {
          // 与其他清洁能源设施形成集群时激活
          building.buffConfig = { targets: ['wind_power'], range: 2 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'humanBuff', offsetY: 0.6 },
      },
    ]
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }

  // 重写 update 方法以调用新的轮循系统
  update() {
    // 调用父类的新轮循逻辑
    super.update()

    // 调用需要持续更新的效果（如shader、广告牌朝向相机等）
    super.updateActiveEffect()
  }
}
