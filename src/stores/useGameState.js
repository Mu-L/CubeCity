import { defineStore } from 'pinia'

export const useGameState = defineStore('gameState', {
  state: () => ({
    currentMode: 'build', // 当前操作模式
    selectedBuilding: null, // 当前选中建筑类型
    selectedBuildingInstance: null, // 当前选中的建筑实例（包含位置、等级等详细信息）
    toastQueue: [], // Toast 消息队列
    // 其他全局状态可在此扩展
    credits: 12345, // 金币
    population: 200, // 人口
    maxPopulation: 300, // 最大人口
    territory: 16, // 地皮
    cityLevel: 5, // 城市等级
    cityName: 'HeXian City', // 城市名称
    citySize: 16, // 城市大小
    language: 'en', // 默认英文
  }),
  actions: {
    setMode(mode) {
      this.currentMode = mode
    },
    selectBuilding(type) {
      this.selectedBuilding = type
    },
    // 选中建筑实例（用于 SELECT 模式）
    selectBuildingInstance(buildingInstance) {
      this.selectedBuildingInstance = buildingInstance
      // 同时更新 selectedBuilding 以保持兼容性
      if (buildingInstance) {
        this.selectedBuilding = buildingInstance.type
      }
    },
    // 清除选中的建筑实例
    clearSelectedBuildingInstance() {
      this.selectedBuildingInstance = null
      this.selectedBuilding = null
    },
    setCredits(credits) {
      this.credits = credits
    },
    setPopulation(population) {
      this.population = population
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
  },
})
