import { BUILDING_DATA } from '@/constants/constants.js'
import { eventBus } from '@/js/utils/event-bus.js'
import { useGameState } from '@/stores/useGameState.js'
import * as THREE from 'three'
import Experience from '../experience.js'

// 交互系统：负责射线检测与对象高亮
export default class Interactor {
  constructor(cityGroup) {
    // 获取 Experience 单例
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera.instance
    this.iMouse = this.experience.iMouse
    this.canvas = this.experience.canvas

    // Three.js 射线器
    this.raycaster = new THREE.Raycaster()
    // 当前聚焦对象
    this.focused = null
    // 当前选择对象
    this.selected = null

    this.relocateFirst = null // 重新定位的第一个对象
    this.relocateSecond = null // 重新定位的第二个对象

    // 城市资产集合
    this.cityGroup = cityGroup

    this.gameState = useGameState() // 获取 pinia 实例

    this.specialMode = ['select', 'relocate'] // 特殊模式，高光不用取消
    // 绑定事件
    this._onMouseMove = this._onMouseMove.bind(this)
    this._onClick = this._onClick.bind(this)
    this._onRightClick = this._onRightClick.bind(this)
    this._onActionConfirmed = this._onActionConfirmed.bind(this)
    this._onKeyDown = this._onKeyDown.bind(this)

    this.canvas.addEventListener('mousemove', this._onMouseMove)
    this.canvas.addEventListener('click', this._onClick)
    // 右键取消选择
    this.canvas.addEventListener('contextmenu', this._onRightClick)

    eventBus.on('ui:action-confirmed', this._onActionConfirmed)
  }

  // 鼠标移动事件处理
  _onMouseMove(_event) {
    const mouse = this.iMouse.normalizedMouse
    this.raycaster.setFromCamera(mouse, this.camera)
    const intersections = this.raycaster.intersectObjects(this.cityGroup.children, true)

    // 没有交互对象，处理高亮取消
    if (intersections.length === 0) {
      if (this.focused && (!this.selected || !this.specialMode.includes(this.gameState.currentMode) || this.focused !== this.selected)) {
        // 只在非 select 模式，或 focused 不是 selected 时取消高亮
        this.focused.setFocused(false, this.gameState.currentMode)
      }
      this.focused = null
      return
    }

    // 有交互对象，找到 Tile 实例
    const newFocused = this._findTileInstance(intersections[0].object)

    // 切换高亮
    if (newFocused && this.focused !== newFocused) {
      // 先取消旧 focused 的高亮（select 模式下 selected 不取消）
      if (this.focused && (!this.selected || !this.specialMode.includes(this.gameState.currentMode) || this.focused !== this.selected)) {
        this.focused.setFocused(false, this.gameState.currentMode)
      }
      // 设置新 focused 的高亮（select 模式下 selected 不重复设置）
      if (!this.selected || !this.specialMode.includes(this.gameState.currentMode) || newFocused !== this.selected) {
        newFocused.setFocused(true, this.gameState.currentMode)
      }
      this.focused = newFocused
    }
  }

  _onClick(_event) {
    if (!this.focused)
      return

    const mode = this.gameState.currentMode

    // 只要是 select/relocate/demolish 模式，点击 tile 时立即将 selected = focused
    if (['select', 'relocate', 'demolish'].includes(mode)) {
      // 取消之前选中对象的状态
      if (this.selected && this.selected !== this.focused) {
        this.selected.setFocused(false, mode)
      }
      this.selected = this.focused
    }

    // 根据当前模式执行相应的点击逻辑
    switch (mode) {
      case 'select':
        this._handleSelectMode()
        break
      case 'build':
        this._handleBuildMode()
        break
      case 'demolish':
        this._handleDemolishMode()
        break
      case 'relocate':
        this._handleRelocateMode()
        break
      default:
        this._handleDefaultMode()
        break
    }
  }

  // SELECT 模式：选择建筑
  _handleSelectMode() {
    if (!this.focused.buildingInstance)
      return

    // 取消之前选中对象的状态
    if (this.selected && this.selected !== this.focused) {
      this.selected.setFocused(false, 'select')
    }

    // 设置新的选中对象
    this.selected = this.focused

    const buildingInstance = {
      type: this.selected.buildingInstance.type,
      position: this.selected.position,
    }
    this.gameState.selectBuilding(buildingInstance.type)
    this.gameState.selectPosition(buildingInstance.position)
  }

  // BUILD 模式：放置建筑
  _handleBuildMode() {
    const selectedBuilding = this.gameState.selectedBuilding
    if (!selectedBuilding || typeof this.focused.setBuilding !== 'function')
      return

    this.focused.setBuilding(selectedBuilding)
    this.focused.setType('road')
    // 显示成功提示
    this._showBuildingPlacedToast(selectedBuilding)
  }

  // DEMOLISH 模式：拆除建筑
  _handleDemolishMode() {
    if (typeof this.selected.removeBuilding !== 'function')
      return

    if (this.selected.buildingInstance) {
      // 发送 mitt 事件，等待 UI 层确认
      eventBus.emit('ui:confirm-action', {
        action: 'demolish',
        tileId: this.selected.id, // 假设有 id，没有可用 name
        tileName: this.selected.name || '',
        buildingType: this.selected.buildingInstance.type,
      })
      // 暂停后续逻辑，等 UI 层反馈
    }
    else {
      // 如果没有建筑，将地皮设置为草地
      this.selected.setType('grass')
    }
  }

  // RELOCATE 模式：重新定位建筑
  _handleRelocateMode() {
    // 已经选了第一个 tile，尝试选第二个
    if (this.relocateFirst && this.relocateFirst !== this.selected) {
      if (this.selected.buildingInstance) {
        const toastMsg = 'You cannot relocate to a tile with a building'
        eventBus.emit('toast:add', {
          message: toastMsg,
          type: 'error',
        })
        return
      }
      this.relocateSecond = this.selected
      // 成功选中第二个对象
      this.relocateSecond.setFocused(true, 'relocate')
      eventBus.emit('ui:confirm-action', {
        action: 'relocate',
        tileId: this.relocateFirst.id,
        tileName: this.relocateFirst.name || '',
        buildingType: this.relocateFirst.buildingInstance.type,
      })
      return
    }
    // 选第一个 tile，必须有建筑
    if (!this.selected.buildingInstance) {
      const toastMsg = 'You cannot relocate to a tile without a building'
      eventBus.emit('toast:add', {
        message: toastMsg,
        type: 'error',
      })
      return
    }
    this.relocateFirst = this.selected
    this.relocateFirst.setFocused(true, 'relocate')
  }

  // 默认模式：显示信息面板
  _handleDefaultMode() {
    eventBus.emit('ui:panel:show', {
      panel: 'building',
      data: this.focused,
    })
  }

  // 显示建筑放置成功提示
  _showBuildingPlacedToast(buildingType) {
    const tileName = this.focused.name || ''
    const tilePos = tileName.replace('Tile-', '')
    const lang = this.gameState.language
    const building = BUILDING_DATA.find(b => b.type === buildingType)
    const buildingName = building?.name?.[lang] || building?.name?.zh || '建筑'
    const toastMsg = lang === 'zh'
      ? `建筑 ${buildingName} 成功放置在地皮 ${tilePos} 位置`
      : `Building ${buildingName} placed successfully on tile ${tilePos}`

    eventBus.emit('toast:add', {
      message: toastMsg,
      type: 'success',
    })
  }

  // 显示建筑拆除提示
  _showBuildingRemovedToast(buildingType) {
    const tileName = this.selected.name || ''
    const tilePos = tileName.replace('Tile-', '')
    const lang = this.gameState.language
    const building = BUILDING_DATA.find(b => b.type === buildingType)
    const buildingName = building?.name?.[lang] || building?.name?.zh || '建筑'
    const toastMsg = lang === 'zh'
      ? `地皮 ${tilePos} 位置上的 ${buildingName} 已被移除`
      : `Building ${buildingName} removed from tile ${tilePos}`

    eventBus.emit('toast:add', {
      message: toastMsg,
      type: 'error',
    })
  }

  _onRightClick(_event) {
    _event.preventDefault() // 阻止右键菜单

    // 取消之前选中对象的状态
    if (this.selected) {
      this.selected.setFocused(false, this.gameState.currentMode)
      this.selected = null
      this.relocateFirst = null
      this.relocateSecond = null
    }
  }

  _onActionConfirmed(action) {
    if (!action)
      return

    switch (action) {
      case 'upgrade':
        // 升级建筑
        if (this.selected && this.selected.buildingInstance && typeof this.selected.buildingInstance.upgrade === 'function') {
          const newBuilding = this.selected.buildingInstance.upgrade()
          if (newBuilding) {
            this.selected.setBuilding(newBuilding.type, newBuilding.direction, newBuilding.options)
            this.selected.setFocused(false, 'select')
            this.selected = null
          }
          else {
            eventBus.emit('toast:add', {
              message: 'Building is already at the highest level, cannot be upgraded',
              type: 'error',
            })
          }
        }
        break
      case 'demolish':
        // 拆除建筑
        if (this.selected && typeof this.selected.removeBuilding === 'function' && this.selected.buildingInstance) {
          const buildingType = this.selected.buildingInstance.type
          this.selected.removeBuilding()
          this._showBuildingRemovedToast(buildingType)
        }
        break
      case 'relocate':
        // 重新定位建筑（示例：这里只做提示，具体逻辑可扩展）
        if (this.relocateFirst && this.relocateFirst.buildingInstance) {
          this._swapBuilding(this.relocateFirst, this.relocateSecond)
          this.relocateFirst.setFocused(false, 'relocate')
          this.relocateSecond.setFocused(false, 'relocate')
          this.relocateFirst = null
          this.relocateSecond = null
          this.selected = null
          // TODO: 实现具体的 relocate 逻辑
          eventBus.emit('toast:add', {
            message: 'Relocate confirmed!（请实现具体逻辑）',
            type: 'info',
          })
        }
        break
      // 可扩展更多 action
      default:
        break
    }
  }

  // 交换建筑
  _swapBuilding(first, second) {
    // 记录建筑数据
    const firstBuilding = first.buildingInstance
    if (firstBuilding) {
      second.setBuilding(firstBuilding.type, firstBuilding.direction, firstBuilding.options)
    }
    first.removeBuilding()
  }

  _findTileInstance(obj) {
    if (!obj)
      return null

    if (obj.userData && typeof obj.userData.setBuilding === 'function') {
      return obj.userData
    }
    // 递归查找父对象
    if (obj.parent)
      return this._findTileInstance(obj.parent)
    return null
  }

  _onKeyDown(event) {
    if (event.key === 'Escape') {
      this._onRightClick()
    }
  }

  // 清理事件
  dispose() {
    this.canvas.removeEventListener('mousemove', this._onMouseMove)
    this.canvas.removeEventListener('click', this._onClick)
    this.canvas.removeEventListener('contextmenu', this._onRightClick)
    eventBus.off('ui:action-confirmed', this._onActionConfirmed.bind(this))
  }
}
