import { defineStore } from 'pinia'

export const useGameState = defineStore('gameState', {
  state: () => ({
    currentMode: 'build', // 当前操作模式
    selectedBuilding: null, // 当前选中建筑类型
    toastQueue: [], // Toast 消息队列
    // 其他全局状态可在此扩展
    credits: 12345, // 金币
    population: 200, // 人口
    maxPopulation: 300, // 最大人口
    territory: 16, // 地皮
    cityLevel: 5, // 城市等级
    cityName: 'HeXian City', // 城市名称
    citySize: 16, // 城市大小
    language: 'zh', // 默认中文
  }),
  actions: {
    setMode(mode) {
      this.currentMode = mode
    },
    selectBuilding(type) {
      this.selectedBuilding = type
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
