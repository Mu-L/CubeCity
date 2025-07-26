import { defineStore } from 'pinia'
import { getEffectiveBuildingValue } from '../js/utils/building-interaction-utils.js'

export const useGameState = defineStore('gameState', {
  state: () => ({
    currentMode: 'build', // 当前操作模式
    selectedBuilding: null, // 当前选中建筑 {type, level}
    selectedPosition: null, // 当前选中位置
    toastQueue: [], // Toast 消息队列
    gameDay: 1, // 新增：游戏天数
    // 其他全局状态可在此扩展
    credits: 3000, // 金币
    territory: 16, // 地皮
    cityLevel: 1, // 城市等级
    cityName: 'HeXian City', // 城市名称
    citySize: 16, // 城市大小
    language: 'en', // 默认英文
    // 新增：地图元数据
    metadata: Array.from({ length: 17 }, _ =>
      Array.from({ length: 17 }, _ => ({
        type: 'grass',
        building: null,
        direction: 0,
        level: 0, // 建筑等级
      }))),
    // 新增：地图总览显隐
    showMapOverview: false,
    // 新增：稳定度
    stability: 100,
    // 新增：稳定度每秒变化率
    stabilityChangeRate: 0,
  }),
  getters: {
    /**
     * 计算每日总收入（直接使用metadata中的detail，大幅提升性能）
     * @param {object} state - 游戏状态
     * @returns {number} 总收入
     */
    dailyIncome: (state) => {
      let totalIncome = 0

      state.metadata.forEach((row, x) => {
        row.forEach((tile, y) => {
          if (tile.building && tile.detail) {
            // 使用高效函数：自动判断是否需要相互作用计算
            const income = getEffectiveBuildingValue(state, x, y, 'coinOutput')
            totalIncome += income
          }
        })
      })

      return totalIncome
    },
    /**
     * 计算总人口容量（优化：直接使用detail，仅对有相互作用的建筑计算修正）
     * @param {object} state - 游戏状态
     * @returns {number} 总人口容量
     */
    maxPopulation: (state) => {
      let totalCapacity = 0

      state.metadata.forEach((row, x) => {
        row.forEach((tile, y) => {
          if (tile.building && tile.detail && tile.detail.category === 'residential') {
            // 使用高效函数：自动判断是否需要相互作用计算
            const capacity = getEffectiveBuildingValue(state, x, y, 'maxPopulation')
            totalCapacity += capacity
          }
        })
      })

      return totalCapacity
    },
    /**
     * 计算总就业岗位
     * @param {object} state - a
     * @returns {number} - b
     */
    totalJobs: (state) => {
      let totalJobs = 0
      state.metadata.forEach((row) => {
        row.forEach((tile) => {
          if (tile.building && tile.detail) {
            totalJobs += tile.detail.population || 0
          }
        })
      })
      return totalJobs
    },
    population() {
      return Math.min(this.maxPopulation * 1.5, this.totalJobs)
    },
    /**
     * 计算最大发电量（优化：直接使用detail，仅对有相互作用的建筑计算修正）
     * @param {object} state - 游戏状态
     * @returns {number} 最大发电量
     */
    maxPower: (state) => {
      let totalPower = 0

      state.metadata.forEach((row, x) => {
        row.forEach((tile, y) => {
          if (tile.building && tile.detail) {
            // 使用高效函数：自动判断是否需要相互作用计算
            const power = getEffectiveBuildingValue(state, x, y, 'powerOutput')
            totalPower += power
          }
        })
      })

      return totalPower
    },
    /**
     * 计算总耗电量
     * @param {object} state - a
     * @returns {number} - b
     */
    power: (state) => {
      let totalUsage = 0
      state.metadata.forEach((row) => {
        row.forEach((tile) => {
          if (tile.building && tile.detail) {
            totalUsage += tile.detail.powerUsage || 0
          }
        })
      })
      return totalUsage
    },

    buildingCount: (state) => {
      let count = 0
      state.metadata.forEach((row) => {
        row.forEach((tile) => {
          if (tile.building && tile.building !== 'road') {
            count++
          }
        })
      })
      return count
    },
    /**
     * 计算总污染值（优化：直接使用detail，仅对有相互作用的建筑计算修正）
     * @param {object} state - 游戏状态
     * @returns {number} 总污染值
     */
    pollution: (state) => {
      let totalPollution = 0

      state.metadata.forEach((row, x) => {
        row.forEach((tile, y) => {
          if (tile.building && tile.detail) {
            // 使用高效函数：自动判断是否需要相互作用计算
            const pollution = getEffectiveBuildingValue(state, x, y, 'pollution')
            totalPollution += pollution
          }
        })
      })

      return totalPollution
    },
    hospitalCount: state =>
      state.metadata.flat().filter(tile => tile.building === 'hospital').length,
    policeStationCount: state =>
      state.metadata.flat().filter(tile => tile.building === 'police').length,
    fireStationCount: state =>
      state.metadata.flat().filter(tile => tile.building === 'fire_station').length,
  },
  actions: {
    updateStability() {
      // 每秒变化率
      let changeRate = 0

      // 1. 公共服务建筑带来的稳定度提升
      const servicesCount = this.hospitalCount + this.policeStationCount + this.fireStationCount
      changeRate += servicesCount * 0.05 // 每个服务建筑每秒提升 0.05

      // 2. 就业不足导致的稳定度下降
      const jobDeficit = this.totalJobs - this.maxPopulation
      if (jobDeficit > 0 && this.maxPopulation > 0) {
        const unemploymentRatio = Number((jobDeficit / this.maxPopulation).toFixed(2))
        changeRate -= unemploymentRatio * 0.5 // 失业率越高，下降越快
      }

      // 3. 污染导致的稳定度下降
      if (this.pollution > 50) {
        // 污染越高，下降越快，呈指数增长
        changeRate -= Number((this.pollution / 50) ** 2 * 0.2).toFixed(2)
      }

      // 4. 电力短缺导致的稳定度下降
      const powerDeficit = this.power - this.maxPower
      if (powerDeficit > 0) {
        const powerDeficitRatio = Number((powerDeficit / this.maxPower).toFixed(2))
        changeRate -= powerDeficitRatio * 1.0 // 电力缺口越大，下降越快
      }
      this.stabilityChangeRate = changeRate
    },

    applyStabilityChange() {
      const newStability = this.stability + this.stabilityChangeRate
      this.stability = Math.max(0, Math.min(100, newStability))
    },

    setMode(mode) {
      this.currentMode = mode
    },
    setSelectedBuilding(payload) {
      this.selectedBuilding = payload
    },
    setSelectedPosition(position) {
      this.selectedPosition = position
    },
    // 金币
    setCredits(credits) {
      this.credits = credits
    },
    updateCredits(credits) {
      this.credits += credits
    },
    setTerritory(territory) {
      this.territory = territory
    },
    setCityLevel(cityLevel) {
      this.cityLevel = cityLevel
    },
    setCityName(cityName) {
      this.cityName = cityName
    },
    setCitySize(citySize) {
      this.citySize = citySize
    },
    addToast(message, type = 'info') {
      const id = Date.now() + Math.random()
      this.toastQueue.push({ message, type, id })
      // 最多只保留 3 条 toast
      if (this.toastQueue.length > 2) {
        this.toastQueue.shift()
      }
    },
    setLanguage(lang) {
      this.language = lang
    },
    removeToast(id) {
      this.toastQueue = this.toastQueue.filter(t => t.id !== id)
    },
    clearSelection() {
      this.selectedBuilding = null
      this.selectedPosition = null
    },
    setTile(x, y, patch) {
      // 合并 patch 到指定 tile
      Object.assign(this.metadata[x][y], patch)
    },
    updateTile(x, y, patch) {
      // 语义同 setTile，便于扩展
      Object.assign(this.metadata[x][y], patch)
    },
    getTile(x, y) {
      return this.metadata?.[x]?.[y] || null
    },
    setShowMapOverview(val) {
      this.showMapOverview = val
    },
    /**
     * 进入下一天，更新金币
     */
    nextDay() {
      this.credits += this.dailyIncome
      this.gameDay++
    },
    resetAll() {
      this.metadata = Array.from({ length: 17 }, _ =>
        Array.from({ length: 17 }, _ => ({
          type: 'grass',
          building: null,
          direction: 0,
        })))
      this.currentMode = 'build'
      this.selectedBuilding = null
      this.selectedPosition = null
      this.toastQueue = []
      this.gameDay = 1
      this.credits = 3000
      this.territory = 16
      this.cityLevel = 1
      this.cityName = 'HeXian City'
      this.citySize = 16
      this.language = 'en'
      this.showMapOverview = false
      this.stability = 100
      this.stabilityChangeRate = 0
    },
  },
  persist: true, // 启用持久化
})
