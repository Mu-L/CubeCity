import { BUILDING_CATEGORIES, BUILDING_DATA } from '@/constants/constants.js'
import Experience from './experience'
import { eventBus } from './utils/event-bus.js'

import '../css/global.css'
import '../scss/global.scss'
import '../scss/index.scss'

document.addEventListener('DOMContentLoaded', () => {})

window.addEventListener('load', () => {
  const canvas = document.querySelector('#canvas')

  if (canvas) {
    window.experience = new Experience(document.querySelector('#canvas'))
  }
})

// 以下为 01.html 迁移的交互脚本
// =============================
let selectedCard = null

// 选择建筑
window.selectBuilding = function (type, cardElement) {
  const experience = window.experience
  experience.selectedBuilding = type

  eventBus.emit('building:choosed', { type })
  const building = BUILDING_DATA[type]
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
  const building = BUILDING_DATA[type]
  document.getElementById('no-selection').classList.add('hidden')
  document.getElementById('building-info').classList.remove('hidden')
  document.getElementById('detail-icon').textContent = building.icon
  document.getElementById('detail-name').textContent = building.name
  document.getElementById('detail-type').textContent = building.type
}

// 设置操作模式
window.setMode = function (mode) {
  const experience = window.experience
  experience.currentMode = mode
  eventBus.emit('mode:changed', { mode })
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
    const experience = window.experience
    if (experience.selectedBuilding && experience.currentMode === 'build') {
      const building = BUILDING_DATA[experience.selectedBuilding]
      showToast(`${building.name} PLACED`, 'success')
    }
  })
}

// 渲染建筑卡片
function renderBuildingCards() {
  const container = document.getElementById('building-cards')
  if (!container)
    return
  container.innerHTML = ''
  BUILDING_CATEGORIES.forEach((cat) => {
    const section = document.createElement('div')
    section.innerHTML = `
      <h3 class="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide flex items-center">
        <span class="w-2 h-2 ${cat.color} rounded-full mr-2"></span>
        ${cat.label}
      </h3>
      <div class="grid grid-cols-2 gap-2"></div>
    `
    const grid = section.querySelector('.grid')
    Object.entries(BUILDING_DATA)
      .filter(([_, b]) => b.category === cat.key)
      .forEach(([type, b]) => {
        const card = document.createElement('div')
        card.className = 'building-card-industrial rounded-lg p-3 cursor-pointer'
        card.innerHTML = `
          <div class="text-2xl text-center mb-1">${b.icon}</div>
          <div class="text-xs text-center font-bold text-gray-300">${b.name.split(' ')[0]}</div>
          <div class="text-xs text-center text-industrial-yellow">⚡${b.cost}</div>
        `
        card.onclick = function () {
          console.log(type, card)

          window.selectBuilding(type, card)
        }
        grid.appendChild(card)
      })
    container.appendChild(section)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  renderBuildingCards()
  showToast('INDUSTRIAL CITY SYSTEM ONLINE', 'success')
})
