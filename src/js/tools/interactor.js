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
      newFocused = intersections[0].object.userData
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
    if (this.focused) {
      const html = this.focused.toHTML()
      const infoPanel = document.getElementById('info-panel')
      infoPanel.innerHTML = html
    }
  }

  // 清理事件
  dispose() {
    this.canvas.removeEventListener('mousemove', this._onMouseMove)
  }
}
