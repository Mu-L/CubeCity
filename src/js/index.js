import Three from './experience'
import '../css/global.css'

import '../scss/global.scss'
import '../scss/index.scss'

document.addEventListener('DOMContentLoaded', () => {})

window.addEventListener('load', () => {
  const canvas = document.querySelector('#canvas')

  if (canvas) {
    new Three(document.querySelector('#canvas'))
  }
})

// 以下为 01.html 迁移的交互脚本
// =============================
let currentMode = 'build'
let selectedBuilding = null
let selectedCard = null

// 建筑数据
const buildingData = {
  factory: { name: 'FACTORY UNIT', icon: '🏭', type: 'INDUSTRIAL BUILDING', cost: 500 },
  warehouse: { name: 'WAREHOUSE', icon: '🏢', type: 'STORAGE FACILITY', cost: 300 },
  apartment: { name: 'HOUSING UNIT', icon: '🏠', type: 'RESIDENTIAL BUILDING', cost: 200 },
  complex: { name: 'RESIDENTIAL COMPLEX', icon: '🏘️', type: 'HOUSING COMPLEX', cost: 800 },
  power: { name: 'POWER STATION', icon: '⚡', type: 'INFRASTRUCTURE', cost: 400 },
  road: { name: 'TRANSPORT ROUTE', icon: '🛤️', type: 'INFRASTRUCTURE', cost: 100 },
}

// 选择建筑
window.selectBuilding = function (type, cardElement) {
  selectedBuilding = type
  const building = buildingData[type]
  // 更新选中状态
  if (selectedCard) {
    selectedCard.classList.remove('selected')
  }
  selectedCard = cardElement
  cardElement.classList.add('selected')
  // 显示选中指示器
  document.getElementById('selected-building-name').textContent = building.name
  document.getElementById('selected-indicator').classList.remove('hidden')
  // 更新右侧详情面板
  showBuildingDetails(type)
  showToast(`Selected: ${building.name}`, 'success')
}

// 显示建筑详情
function showBuildingDetails(type) {
  const building = buildingData[type]
  document.getElementById('no-selection').classList.add('hidden')
  document.getElementById('building-info').classList.remove('hidden')
  document.getElementById('detail-icon').textContent = building.icon
  document.getElementById('detail-name').textContent = building.name
  document.getElementById('detail-type').textContent = building.type
}

// 设置操作模式
window.setMode = function (mode) {
  currentMode = mode
  document.getElementById('current-mode').textContent = mode.toUpperCase()
  const modeNames = {
    build: 'BUILD MODE',
    move: 'RELOCATE MODE',
    demolish: 'DEMOLISH MODE',
  }
  showToast(modeNames[mode], 'info')
}

// 建筑操作函数
window.upgradeBuilding = function () {
  showToast('UPGRADE INITIATED', 'success')
}
window.repairBuilding = function () {
  showToast('MAINTENANCE SCHEDULED', 'info')
}
window.demolishBuilding = function () {
  showToast('DEMOLITION CONFIRMED', 'warning')
}
window.showAchievements = function () {
  showToast('ACHIEVEMENT SYSTEM LOADING...', 'info')
}

// 显示提示消息
function showToast(message, type = 'info') {
  const toast = document.createElement('div')
  const colors = {
    success: 'bg-industrial-green',
    error: 'bg-industrial-red',
    warning: 'bg-industrial-yellow text-black',
    info: 'bg-industrial-blue',
  }
  toast.className = `${colors[type]} text-white px-4 py-2 rounded shadow-industrial transform transition-all duration-300 translate-x-full font-bold text-xs uppercase tracking-wide`
  toast.textContent = message
  document.getElementById('toast-container').appendChild(toast)
  setTimeout(() => {
    toast.classList.remove('translate-x-full')
  }, 100)
  setTimeout(() => {
    toast.classList.add('translate-x-full')
    setTimeout(() => {
      toast.remove()
    }, 300)
  }, 3000)
}

// 游戏画布交互
const gameCanvas = document.getElementById('canvas')
if (gameCanvas) {
  gameCanvas.addEventListener('click', (_e) => {
    if (selectedBuilding && currentMode === 'build') {
      const building = buildingData[selectedBuilding]
      showToast(`${building.name} PLACED`, 'success')
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  showToast('INDUSTRIAL CITY SYSTEM ONLINE', 'success')
})
