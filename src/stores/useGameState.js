import { BUILDING_DATA } from '@/constants/constants.js'
import { defineStore } from 'pinia'

export const useGameState = defineStore('gameState', {
  state: () => ({
    currentMode: 'build', // 当前操作模式
    selectedBuilding: null, // 当前选中建筑 {type, level}
    selectedPosition: null, // 当前选中位置
    toastQueue: [], // Toast 消息队列
    gameDay: 1, // 新增：游戏天数
    // 其他全局状态可在此扩展
    credits: 10000, // 金币
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
  }),
  getters: {
    /**
     * 计算每日总收入
     * @param {object} state - a
     * @returns {number} - b
     */
    dailyIncome: (state) => {
      let totalIncome = 0
      state.metadata.forEach((row) => {
        row.forEach((tile) => {
          if (tile.building && tile.level > 0) {
            const buildingData = BUILDING_DATA[tile.building]
            if (buildingData && buildingData.levels[tile.level]) {
              totalIncome += buildingData.levels[tile.level].coinOutput || 0
            }
          }
        })
      })
      return totalIncome
    },
    /**
     * 计算总人口容量
     * @param {object} state - a
     * @returns {number} - b
     */
    maxPopulation: (state) => {
      let totalCapacity = 0
      state.metadata.forEach((row) => {
        row.forEach((tile) => {
          if (tile.building && tile.level > 0) {
            const buildingData = BUILDING_DATA[tile.building]
            if (buildingData?.category === 'residential' && buildingData.levels[tile.level]) {
              totalCapacity += buildingData.levels[tile.level].maxPopulation || 0
            }
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
          if (tile.building && tile.level > 0) {
            const buildingData = BUILDING_DATA[tile.building]
            if (
              (buildingData?.category === 'commercial' || buildingData?.category === 'industrial')
              && buildingData.levels[tile.level]
            ) {
              totalJobs += buildingData.levels[tile.level].population || 0
            }
          }
        })
      })
      return totalJobs
    },
    population() {
      return Math.min(this.maxPopulation * 1.5, this.totalJobs)
    },
  },
  actions: {
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
      this.credits = 10000
      this.territory = 16
      this.cityLevel = 1
      this.cityName = 'HeXian City'
      this.citySize = 16
      this.language = 'en'
      this.showMapOverview = false
    },
  },
  persist: true, // 启用持久化
})
