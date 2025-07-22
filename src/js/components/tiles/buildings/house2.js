import Building from '../building.js'

// 住宅类建筑 (第二种样式)
export default class House2 extends Building {
  constructor(type = 'house2', level = 1, direction = 0, options = {}) {
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
        effect: { type: 'missPower', offsetY: 0.8 },
      },

      // 人口过载
      {
        statusType: 'OVER_POPULATION',
        condition: (building, gs) => gs.population > gs.maxPopulation,
        effect: { type: 'overPopulation', offsetY: 0.8 },
      },

      // === BUFF 状态（增益状态，无问题时轮循显示） ===

      // 提供人口增益
      {
        statusType: 'HUMAN_BUFF',
        condition: (building, gs) => {
          // 周围有服务设施时激活人口增益
          building.buffConfig = { targets: ['hospital', 'police', 'fire_station', 'park', 'hero_park'], range: 2 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'humanBuff', offsetY: 0.8 },
      },

      // 可升级状态
      {
        statusType: 'UPGRADE',
        condition: (building, gs) => {
          const upgradeInfo = building.upgrade()
          return upgradeInfo && gs.credits >= building.getCost()
        },
        effect: { type: 'upgrade', offsetY: 0.8 },
      },
    ]
  }

  getCost() {
    return this.options.buildingData?.cost || 0
  }

  // 住宅提供人口容量
  getPopulation() {
    return 12 // house2稍微比house多一点人口
  }

  // 重写 update 方法以调用新的轮循系统
  update() {
    // 调用父类的新轮循逻辑
    super.update()

    // 调用需要持续更新的效果（如shader、广告牌朝向相机等）
    super.updateActiveEffect()
  }
}
