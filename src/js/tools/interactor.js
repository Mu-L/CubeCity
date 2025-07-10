import { BUILDING_DATA } from '@/constants/constants.js'
import { eventBus } from '@/js/utils/event-bus.js'
import { useGameState } from '@/stores/useGameState.js'
import * as THREE from 'three'
import Experience from '../experience.js'

/**
 * @file 交互系统：负责射线检测、对象高亮、点击交互等所有用户操作。
 * @author hexianWeb
 *
 * @description
 * 该类的核心职责是：
 * 1. 监听鼠标和键盘事件。
 * 2. 通过射线检测确定用户意图（聚焦、点击）。
 * 3. 管理交互状态（如 focused, selected, relocateFirst）。
 * 4. 根据当前游戏模式 (GameState.currentMode) 执行不同的业务逻辑（如建造、拆除）。
 * 5. 与 UI 层通过 eventBus 进行通信（如显示确认框、发送提示）。
 */

// --- 常量定义 ---

// 定义游戏模式，避免使用魔法字符串
const MODES = {
  SELECT: 'select',
  BUILD: 'build',
  DEMOLISH: 'demolish',
  RELOCATE: 'relocate',
}

// 在这些模式下，选中的对象会保持高亮
const PERSISTENT_HIGHLIGHT_MODES = [MODES.SELECT, MODES.RELOCATE, MODES.DEMOLISH]

// 可随意建造的建筑
const FREE_BUILDING_TYPES = ['factory', 'road', 'chemistry_level1', 'nuke_factory']
// ========== 建造合法性判断函数 (单纯判断地形) ==========
function canPlaceBuilding(x, y, buildingType, metadata) {
  if (!metadata?.[x]?.[y])
    return false
  // 工厂 & 道路可随意建造
  if (FREE_BUILDING_TYPES.includes(buildingType)) {
    return true
  }
  // 其他建筑需相邻道路
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]
  for (const [dx, dy] of dirs) {
    const nx = x + dx
    const ny = y + dy
    if (metadata[nx]?.[ny]?.type === 'ground' && metadata[nx]?.[ny]?.building === 'road') {
      return true
    }
  }
  return false
}

export default class Interactor {
  constructor(cityGroup) {
    // --- 核心依赖 ---
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.camera = this.experience.camera.instance
    this.iMouse = this.experience.iMouse
    this.canvas = this.experience.canvas
    this.gameState = useGameState() // Pinia Store

    // --- 内部工具 ---
    this.raycaster = new THREE.Raycaster()
    this.cityGroup = cityGroup // 城市中所有可交互对象的集合

    // --- 交互状态管理 ---
    this.focused = null // 当前鼠标悬停的 Tile
    this.selected = null // 当前点击选中的 Tile
    this.relocateFirst = null // 搬迁操作的第一个 Tile
    this.relocateSecond = null // 搬迁操作的第二个 Tile

    this.lastMode = null // 用于检测游戏模式是否发生变化

    // --- 初始化 ---
    this._bindEvents()
  }

  // =================================================================================
  //  事件绑定与解绑
  // =================================================================================

  /**
   * 绑定所有需要的事件监听器
   */
  _bindEvents() {
    this._onMouseMove = this._onMouseMove.bind(this)
    this._onClick = this._onClick.bind(this)
    this._onRightClick = this._onRightClick.bind(this)
    this._onActionConfirmed = this._onActionConfirmed.bind(this)
    this._onKeyDown = this._onKeyDown.bind(this)

    this.canvas.addEventListener('mousemove', this._onMouseMove)
    this.canvas.addEventListener('click', this._onClick)
    this.canvas.addEventListener('contextmenu', this._onRightClick)
    // 监听全局按键，确保'Esc'等键在任何时候都生效
    document.addEventListener('keydown', this._onKeyDown)
    eventBus.on('ui:action-confirmed', this._onActionConfirmed)
  }

  /**
   * 清理所有事件监听器，在对象销毁时调用
   */
  dispose() {
    this.canvas.removeEventListener('mousemove', this._onMouseMove)
    this.canvas.removeEventListener('click', this._onClick)
    this.canvas.removeEventListener('contextmenu', this._onRightClick)
    document.removeEventListener('keydown', this._onKeyDown)
    eventBus.off('ui:action-confirmed', this._onActionConfirmed)
  }

  // =================================================================================
  //  主要事件处理器
  // =================================================================================

  /**
   * 鼠标移动事件处理
   * 主要负责：检测模式变更、更新悬停对象、处理高亮效果
   */
  _onMouseMove() {
    this._handleModeChange()

    const newFocusedTile = this._getIntersectedTile()
    this._updateFocus(newFocusedTile)
  }

  /**
   * 鼠标点击事件处理
   * 主要负责：根据当前模式，分发点击逻辑
   */
  _onClick() {
    if (!this.focused)
      return

    const mode = this.gameState.currentMode

    // 在特定模式下，单击即选中
    if (PERSISTENT_HIGHLIGHT_MODES.includes(mode))
      this._setSelected(this.focused)

    // 根据模式执行对应操作
    switch (mode) {
      case MODES.SELECT:
        this._handleSelectMode(this.selected)
        break
      case MODES.BUILD:
        this._handleBuildMode(this.focused)
        break
      case MODES.DEMOLISH:
        this._handleDemolishMode(this.selected)
        break
      case MODES.RELOCATE:
        this._handleRelocateMode(this.selected)
        break
      default:
        this._handleDefaultMode(this.focused)
        break
    }
  }

  /**
   * 鼠标右键事件处理
   * 主要负责：取消所有选择和操作
   */
  _onRightClick(event) {
    if (event)
      event.preventDefault() // 阻止默认的右键菜单
    this._clearSelection()
  }

  /**
   * 键盘事件处理
   * 主要负责：'Esc'键取消选择，'R'键旋转建筑
   */
  _onKeyDown(event) {
    if (event.key === 'Escape')
      this._onRightClick()

    // 在建造或搬迁模式下，按 'R' 键旋转建筑
    const currentMode = this.gameState.currentMode
    if (currentMode === MODES.BUILD || currentMode === MODES.RELOCATE) {
      if (event.key.toLowerCase() === 'r') {
        const tileToRotate = currentMode === MODES.RELOCATE ? this.relocateFirst : this.selected
        this._rotateBuilding(tileToRotate)
      }
    }
  }

  /**
   * UI确认事件处理
   * 当用户在UI上点击"确认"按钮后（如确认拆除），此方法被调用
   */
  _onActionConfirmed(action) {
    if (!action)
      return

    switch (action) {
      case 'upgrade':
        this._confirmUpgrade()
        break
      case 'demolish':
        this._confirmDemolish()
        break
      case 'relocate':
        this._confirmRelocate()
        break
      // 可扩展其他确认操作
    }
    // 任何确认操作后，都清空选择状态
    this._clearSelection()
  }

  // =================================================================================
  //  各模式下的具体逻辑处理器
  // =================================================================================

  /**
   * [选择模式] 逻辑
   */
  _handleSelectMode(tile) {
    const building = tile?.buildingInstance
    if (!building)
      return

    // 选中建筑
    this.gameState.setSelectedBuilding({ type: building.type, level: building.level || 1 })
    this.gameState.setSelectedPosition(tile.position)
  }

  /**
   * [建造模式] 逻辑
   */
  _handleBuildMode(tile) {
    const buildingTypeToBuild = this.gameState.selectedBuilding?.type
    const buildingLevelToBuild = 1
    if (!tile)
      return
    const { x, y } = tile
    const metadata = this.gameState.metadata
    const canBuild = canPlaceBuilding(x, y, buildingTypeToBuild, metadata)
    if (!buildingTypeToBuild || !canBuild || tile.buildingInstance) {
      this._showToast('error', '无法在此处建造，请选择合规地块。')
      return
    }
    // 通过 Pinia 修改 metadata
    this.gameState.setTile(x, y, {
      type: 'ground',
      building: buildingTypeToBuild,
      direction: 0, // 可根据实际情况
      level: buildingLevelToBuild,
    })
    if (this.gameState.credits < BUILDING_DATA[buildingTypeToBuild]?.levels[buildingLevelToBuild]?.cost) {
      this._showToast('error', 'Insufficient funds, unable to build.')
      return
    }
    this.gameState.updateCredits(-BUILDING_DATA[buildingTypeToBuild]?.levels[buildingLevelToBuild]?.cost)
    // ...后续同步 Three.js 层刷新
    tile.setBuilding(buildingTypeToBuild, buildingLevelToBuild, 0)
    tile.setType('ground')
    this._updateAdjacentRoads(tile)
    this._showBuildingPlacedToast(buildingTypeToBuild, tile, buildingLevelToBuild)
  }

  /**
   * [拆除模式] 逻辑
   */
  _handleDemolishMode(tile) {
    if (!tile)
      return

    if (tile.buildingInstance) {
      // 有建筑，需要UI确认
      eventBus.emit('ui:confirm-action', {
        action: 'demolish',
        tileId: tile.id,
        tileName: tile.name || '',
        buildingType: tile.buildingInstance.type,
        buildingLevel: tile.buildingInstance.level,
      })
    }
    else {
      // 没建筑，直接变草地
      tile.setType('grass')
    }
  }

  /**
   * [搬迁模式] 逻辑
   */
  _handleRelocateMode(tile) {
    if (!tile)
      return

    // 步骤1: 选择要搬迁的建筑
    if (!this.relocateFirst) {
      if (!tile.buildingInstance) {
        this._showToast('error', '请选择一个有建筑的地块进行搬迁。')
        this._clearSelection() // 清空无效选择
        return
      }
      this.relocateFirst = tile
      // 高亮已由 _setSelected 处理
      return
    }

    // 步骤2: 选择目标空地
    if (this.relocateFirst !== tile) {
      if (!canPlaceBuilding(tile.x, tile.y, this.relocateFirst.buildingInstance.type, this.gameState.metadata)) {
        this._showToast('error', '无法在此处搬迁，请选择合规地块。')
        return
      }
      if (tile.buildingInstance) {
        this._showToast('error', '目标地块已被占用，无法搬迁。')
        return
      }
      this.relocateSecond = tile
      this.relocateSecond.setFocused(true, MODES.RELOCATE) // 保持目标地高亮

      // 发起UI确认
      eventBus.emit('ui:confirm-action', {
        action: 'relocate',
        tileId: this.relocateFirst.id,
        tileName: this.relocateFirst.name || '',
        buildingType: this.relocateFirst.buildingInstance.type,
        buildingLevel: this.relocateFirst.buildingInstance.level,
      })
    }
  }

  /**
   * [默认模式] 逻辑 (如查看信息)
   */
  _handleDefaultMode(tile) {
    if (!tile)
      return
    eventBus.emit('ui:panel:show', { panel: 'building', data: tile })
  }

  // =================================================================================
  //  UI确认后的具体动作
  // =================================================================================

  _confirmUpgrade() {
    const building = this.selected?.buildingInstance
    if (building && typeof building.upgrade === 'function') {
      const newBuilding = building.upgrade()
      if (newBuilding) {
        this.selected.setBuilding(newBuilding.type, newBuilding.level || 1, newBuilding.direction)
        this._showToast('success', '建筑升级成功！')
      }
      else {
        this._showToast('error', '建筑已达到最高等级。')
      }
    }
  }

  _confirmDemolish() {
    const tile = this.selected
    const building = tile.buildingInstance
    if (tile && building) {
      // 这里才修改 metadata
      this.gameState.setTile(tile.x, tile.y, {
        type: 'ground',
        building: null,
        direction: 0,
        level: 0,
      })
      tile.removeBuilding()
      this._showBuildingRemovedToast(building.type, tile, building.level)
      this._updateAdjacentRoads(tile)
    }
  }

  _confirmRelocate() {
    const sourceTile = this.relocateFirst
    const destTile = this.relocateSecond
    if (sourceTile && destTile) {
      // 交换 metadata
      const srcData = { ...this.gameState.getTile(sourceTile.x, sourceTile.y) }
      const dstData = { ...this.gameState.getTile(destTile.x, destTile.y) }
      this.gameState.setTile(destTile.x, destTile.y, srcData)
      this.gameState.setTile(sourceTile.x, sourceTile.y, { ...dstData, building: null, direction: 0, level: 0 })
      this._swapBuilding(sourceTile, destTile)
      this._showToast('info', '建筑搬迁成功！')
      this._updateAdjacentRoads(sourceTile)
      this._updateAdjacentRoads(destTile)
    }
  }

  // =================================================================================
  //  辅助函数 (Helpers)
  // =================================================================================

  /**
   * 检查当前游戏模式是否改变，如果改变则清空之前的选择状态
   */
  _handleModeChange() {
    if (this.lastMode !== this.gameState.currentMode) {
      this.lastMode = this.gameState.currentMode
      this._clearSelection()
    }
  }

  /**
   * 更新悬停对象的焦点和高亮
   */
  _updateFocus(newFocusedTile) {
    // 如果焦点没变，则不执行任何操作
    if (this.focused === newFocusedTile)
      return
    let mode = this.gameState.currentMode
    // ========== 新增：建造模式下不可建造橙色高亮 ==========
    if (mode === 'build' && newFocusedTile) {
      const { x, y } = newFocusedTile
      const buildingType = this.gameState.selectedBuilding?.type
      const buildingLevel = this.gameState.selectedBuilding?.level || 1
      const metadata = this.gameState.metadata
      const canBuild = canPlaceBuilding(x, y, buildingType, metadata)
      if (!canBuild) {
        mode = 'build-invalid'
      }
    }
    // 移除旧焦点的悬停高亮
    // 条件：旧焦点存在，且不是当前选中的对象 (或者当前模式不需要保持高亮)
    if (this.focused && (!this.selected || this.focused !== this.selected || !PERSISTENT_HIGHLIGHT_MODES.includes(this.gameState.currentMode)))
      this.focused.setFocused(false, mode)

    // 为新焦点添加悬停高亮
    // 条件：新焦点存在，且不是当前选中的对象 (或者当前模式不需要保持高亮)
    if (newFocusedTile && (!this.selected || newFocusedTile !== this.selected || !PERSISTENT_HIGHLIGHT_MODES.includes(this.gameState.currentMode)))
      newFocusedTile.setFocused(true, mode)

    this.focused = newFocusedTile
  }

  /**
   * 设置当前选中的对象，并处理高亮状态
   */
  _setSelected(tile) {
    // 如果点击的是同一个对象，则不做任何事
    if (this.selected === tile)
      return

    // 取消上一个选中对象的高亮
    if (this.selected)
      this.selected.setFocused(false, this.gameState.currentMode)

    this.selected = tile

    // 设置新选中对象的高亮
    if (this.selected)
      this.selected.setFocused(true, this.gameState.currentMode)
  }

  /**
   * 清空所有选择状态，并将相关对象恢复默认
   */
  _clearSelection() {
    if (this.selected)
      this.selected.setFocused(false, this.gameState.currentMode)
    if (this.relocateFirst)
      this.relocateFirst.setFocused(false, this.gameState.currentMode)
    if (this.relocateSecond)
      this.relocateSecond.setFocused(false, this.gameState.currentMode)

    this.selected = null
    this.relocateFirst = null
    this.relocateSecond = null

    // 通知UI层清空选择信息
    this.gameState.clearSelection()
  }

  /**
   * 旋转建筑
   */
  _rotateBuilding(tile) {
    const building = tile?.buildingInstance
    // 道路不能旋转
    if (!building || building.type === 'road')
      return

    const { type, direction, options } = building
    tile.removeBuilding()
    tile.setBuilding(type, building.level || 1, (direction + 1) % 4)
    this._updateAdjacentRoads(tile)
  }

  /**
   * 从场景中的物理对象向上查找，直到找到Tile实例
   */
  _getIntersectedTile() {
    this.raycaster.setFromCamera(this.iMouse.normalizedMouse, this.camera)
    const intersections = this.raycaster.intersectObjects(this.cityGroup.children, true)

    if (intersections.length === 0)
      return null

    const findTile = (obj) => {
      if (!obj)
        return null
      // userData 是我们在创建 Tile 时自己挂载的实例引用
      if (obj.userData && typeof obj.userData.setBuilding === 'function')
        return obj.userData

      return findTile(obj.parent)
    }

    return findTile(intersections[0].object)
  }

  /**
   * 更新一个地块四周的道路模型
   */
  _updateAdjacentRoads(tile) {
    const city = this.experience.world.city
    if (!city || !tile)
      return

    const [x, y] = tile.name.split('-').slice(1).map(Number)

    // 获取上下左右四个邻居
    const neighbors = [
      city.getTile(x, y - 1), // top
      city.getTile(x, y + 1), // bottom
      city.getTile(x - 1, y), // left
      city.getTile(x + 1, y), // right
    ]

    // 刷新邻居中的道路
    for (const neighbor of neighbors) {
      if (neighbor?.buildingInstance?.type === 'road')
        neighbor.buildingInstance.refreshView(city)
    }

    // 如果当前地块自己就是道路，也刷新自己
    if (tile.buildingInstance?.type === 'road')
      tile.buildingInstance.refreshView(city)
  }

  // --- Toast 提示封装 ---

  _getBuildingName(buildingType, level) {
    const lang = this.gameState.language
    const buildingData = BUILDING_DATA[buildingType]
    // 只返回指定 level 下的名称
    return buildingData.levels[level].displayName[lang]
  }

  _showBuildingPlacedToast(buildingType, tile, level) {
    const buildingName = this._getBuildingName(buildingType, level)
    const tilePos = tile.name.replace('Tile-', '')
    const message = this.gameState.language === 'zh'
      ? `建筑 ${buildingName} 已成功放置在 ${tilePos}。`
      : `Building ${buildingName} placed on tile ${tilePos}.`
    this._showToast('success', message)
  }

  _showBuildingRemovedToast(buildingType, tile, level) {
    const buildingName = this._getBuildingName(buildingType, level)
    const tilePos = tile.name.replace('Tile-', '')
    const message = this.gameState.language === 'zh'
      ? `位于 ${tilePos} 的 ${buildingName} 已被移除。`
      : `Building ${buildingName} on tile ${tilePos} has been removed.`
    this._showToast('error', message)
  }

  _showToast(type, message) {
    eventBus.emit('toast:add', { message, type })
  }

  // 交换建筑
  _swapBuilding(first, second) {
    first.setType('ground')
    second.setType('ground')
    // 记录建筑数据
    const firstBuilding = first.buildingInstance
    if (firstBuilding) {
      second.setBuilding(firstBuilding.type, firstBuilding.level || 1, firstBuilding.direction)
    }
    first.removeBuilding()
  }
}
