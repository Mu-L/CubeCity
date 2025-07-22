import Building from '../building.js'

export default class Police extends Building {
  constructor(type = 'police', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    // --- 新的轮循状态系统配置 ---
    this.statusConfig = [
      // 继承基础的 debuff 状态（如缺少道路）
      ...super.getDefaultStatusConfig(),

      // === DEBUFF 状态（问题状态，优先轮循显示） ===

      // 缺少电力
      {
        statusType: 'MISSING_POWER',
        condition: (building, gs) => gs.power < 1,
        effect: { type: 'missPower', offsetY: 0.7 },
      },

      // 缺少服务人口
      {
        statusType: 'MISSING_POPULATION',
        condition: (building, gs) => {
          // 周围没有住宅时激活
          building.buffConfig = { targets: ['house', 'house2'], range: 4 }
          return !building.checkForBuffTargets(gs)
        },
        effect: { type: 'missPopulation', offsetY: 0.7 },
      },

      // === BUFF 状态（增益状态，无问题时轮循显示） ===

      // 提供安全增益
      {
        statusType: 'HUMAN_BUFF',
        condition: (building, gs) => {
          // 为周围住宅和商业提供安全增益
          building.buffConfig = { targets: ['house', 'house2', 'shop'], range: 3 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'humanBuff', offsetY: 0.7 },
      },

      // 服务网络增益
      {
        statusType: 'COIN_BUFF',
        condition: (building, gs) => {
          // 与医院、消防站形成服务网络时激活
          building.buffConfig = { targets: ['hospital', 'fire_station'], range: 3 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'coinBuff', offsetY: 0.7 },
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
