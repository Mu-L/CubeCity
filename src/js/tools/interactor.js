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
    // 城市资产集合
    this.cityGroup = cityGroup

    // 绑定事件
    this._onMouseMove = this._onMouseMove.bind(this)
    this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this))
    this.canvas.addEventListener('click', this._onClick.bind(this))
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
      this.focused && this.focused.setFocused(false)
      this.focused = null
    }

    // 切换高亮
    if (newFocused && this.focused !== newFocused) {
      if (this.focused)
        this.focused.setFocused(false)
      if (newFocused)
        newFocused.setFocused(true)
      this.focused = newFocused
    }
  }

  _onClick(_event) {
    // 拆除建筑
    if (this.focused) {
      const mode = this.experience.currentMode
      const selectedBuilding = this.experience.selectedBuilding
      const eventBus = this.experience.eventBus

      if (mode === 'build' && selectedBuilding) {
        // 放置建筑
        if (typeof this.focused.setBuilding === 'function') {
          this.focused.setBuilding(selectedBuilding)
          eventBus.emit('building:placed', {
            tile: this.focused,
            type: selectedBuilding,
            buildingInstance: this.focused.buildingInstance, // 假设 tile 有 buildingInstance
          })
        }
      }
      else if (mode === 'demolish') {
        if (typeof this.focused.removeBuilding === 'function') {
          if (this.focused.buildingInstance) {
            this.focused.removeBuilding()
            eventBus.emit('building:removed', {
              tile: this.focused,
              type: this.focused.buildingType, // 假设 tile 有 buildingType
            })
          }
          else {
            this.focused.setType('grass')
          }
        }
      }
      else {
        // 显示信息面板
        eventBus.emit('ui:panel:show', {
          panel: 'building',
          data: this.focused,
        })
      }
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

  // 清理事件
  dispose() {
    this.canvas.removeEventListener('mousemove', this._onMouseMove)
  }
}
