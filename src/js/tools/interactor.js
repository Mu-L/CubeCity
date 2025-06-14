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
    // 城市资产集合
    this.cityGroup = cityGroup

    this.gameState = useGameState() // 获取 pinia 实例

    // 绑定事件
    this._onMouseMove = this._onMouseMove.bind(this)
    this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this))
    this.canvas.addEventListener('click', this._onClick.bind(this))
    // 右键取消选择
    this._onRightClick = this._onRightClick.bind(this)
    this.canvas.addEventListener('contextmenu', this._onRightClick.bind(this))

    eventBus.on('ui:demolish-confirmed', this._onDemolishConfirmed.bind(this))
  }

  // 鼠标移动事件处理
  _onMouseMove(_event) {
    // 获取 NDC 坐标（已由 iMouse 处理）
    const mouse = this.iMouse.normalizedMouse
    // 设置射线
    this.raycaster.setFromCamera(mouse, this.camera)

    // 射线检测
    const intersections = this.raycaster.intersectObjects(this.cityGroup.children, true)

    let newFocused = null
    if (intersections.length > 0) {
      // 确保 newFocused 是 Tile 实例
      newFocused = this._findTileInstance(intersections[0].object)
    }
    else {
      // 在 SELECT 模式下，不要取消已选中对象的高亮
      if (this.gameState.currentMode === 'select' && this.selected) {
        // 只取消 focused 对象的高亮，但保持 selected 对象的高亮
        if (this.focused && this.focused !== this.selected) {
          this.focused.setFocused(false, this.gameState.currentMode)
        }
      }
      else {
        this.focused && this.focused.setFocused(false, this.gameState.currentMode)
      }
      this.focused = null
      return
    }

    // 切换高亮
    if (newFocused && this.focused !== newFocused) {
      // 在 SELECT 模式下，不要取消已选中对象的高亮
      if (this.gameState.currentMode === 'select' && this.selected) {
        // 只有当前 focused 不是 selected 时才取消其高亮
        if (this.focused && this.focused !== this.selected) {
          this.focused.setFocused(false, this.gameState.currentMode)
        }
        // 只有当新 focused 不是 selected 时才设置其高亮
        if (newFocused && newFocused !== this.selected) {
          newFocused.setFocused(true, this.gameState.currentMode)
        }
      }
      else {
        // 非 SELECT 模式下的正常高亮切换
        if (this.focused)
          this.focused.setFocused(false, this.gameState.currentMode)
        if (newFocused)
          newFocused.setFocused(true, this.gameState.currentMode)
      }
      this.focused = newFocused
    }
  }

  _onClick(_event) {
    if (!this.focused)
      return

    const mode = this.gameState.currentMode

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
    // 当前选中建筑类型
    console.log('selected', this.selected.buildingInstance.type)
    // 当前地皮所在位置
    console.log('selected', this.selected.name)

    const buildingInstance = {
      type: this.selected.buildingInstance.type,
      name: this.selected.name,
      position: this.selected.position,
      rotation: this.selected.rotation,
    }
    this.gameState.selectBuildingInstance(buildingInstance)
    // 确保选中对象保持高亮
    this.selected.setFocused(true, 'select')
  }

  // BUILD 模式：放置建筑
  _handleBuildMode() {
    const selectedBuilding = this.gameState.selectedBuilding
    if (!selectedBuilding || typeof this.focused.setBuilding !== 'function')
      return

    this.focused.setBuilding(selectedBuilding)

    // 显示成功提示
    this._showBuildingPlacedToast(selectedBuilding)
  }

  // DEMOLISH 模式：拆除建筑
  _handleDemolishMode() {
    if (typeof this.focused.removeBuilding !== 'function')
      return

    if (this.focused.buildingInstance) {
      // 发送 mitt 事件，等待 UI 层确认
      eventBus.emit('ui:confirm-demolish', {
        tileId: this.focused.id, // 假设有 id，没有可用 name
        tileName: this.focused.name || '',
        buildingType: this.focused.buildingInstance.type,
      })
      // 暂停后续逻辑，等 UI 层反馈
    }
    else {
      // 如果没有建筑，将地皮设置为草地
      this.focused.setType('grass')
    }
  }

  // RELOCATE 模式：重新定位建筑（如果有这个功能的话）
  _handleRelocateMode() {
    // TODO: 实现重新定位逻辑
    console.warn('重新定位模式尚未实现')
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
    const tileName = this.focused.name || ''
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
    }
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

  _onDemolishConfirmed(_data) {
    // data 里应包含 tileId 或 tileName
    // 这里假设 this.focused 就是要操作的 tile（如需更严谨可通过 id 查找）
    if (this.focused && this.focused.buildingInstance) {
      const buildingType = this.focused.buildingInstance.type
      this.focused.removeBuilding()
      this._showBuildingRemovedToast(buildingType)
    }
  }

  // 清理事件
  dispose() {
    this.canvas.removeEventListener('mousemove', this._onMouseMove)
  }
}
