import * as THREE from 'three'
import { HIGHLIGHTED_COLOR, SELECTED_COLOR, SIMOBJECT_DEFAULT_OPACITY, SIMOBJECT_SELECTED_OPACITY } from '../../constants.js'

// SimObject 互动基类，所有可交互对象继承自此类
export default class SimObject extends THREE.Object3D {
  /** @type {THREE.Mesh?} */
  #mesh = null
  /** @type {THREE.Vector3} */
  #worldPos = new THREE.Vector3()

  /**
   * @param {number} x 对象的 x 坐标
   * @param {number} y 对象的 y 坐标
   * @param {object} resource 可选，threejs 资源对象（如 gltf 加载结果）
   */
  constructor(x = 0, y = 0, resource = null) {
    super()
    this.name = 'SimObject'
    this.position.x = x
    this.position.z = y
    // 如果传入资源，自动初始化 mesh
    if (resource) {
      const mesh = this.initMeshFromResource(resource)
      if (mesh) {
        this.setMesh(mesh)
      }
    }
  }

  /**
   * 从 threejs 资源对象（如 gltf 加载结果）初始化 mesh，并克隆材质
   * @param {object} resource - threejs 资源对象，需包含 scene 属性
   * @returns {THREE.Object3D|null}
   */
  initMeshFromResource(resource) {
    if (!resource || !resource.scene)
      return null
    // 克隆模型
    const mesh = resource.scene.clone()
    // 遍历所有子节点，克隆材质并设置透明，userData 指向自身
    mesh.traverse((child) => {
      child.userData = this
      if (child instanceof THREE.Mesh && child.material) {
        child.receiveShadow = true
        child.castShadow = true
        child.material = child.material.clone()
        child.material.transparent = true
      }
    })
    return mesh
  }

  // 获取世界坐标 x
  get x() {
    this.getWorldPosition(this.#worldPos)
    return Math.floor(this.#worldPos.x)
  }

  // 获取世界坐标 y (实际为 z 轴)
  get y() {
    this.getWorldPosition(this.#worldPos)
    return Math.floor(this.#worldPos.z)
  }

  /** @type {THREE.Mesh?} */
  get mesh() {
    return this.#mesh
  }

  /** 设置 mesh 并自动加入场景图 */
  setMesh(value) {
    // 移除旧 mesh
    if (this.#mesh) {
      this.dispose()
      this.remove(this.#mesh)
    }
    this.#mesh = value
    if (this.#mesh) {
      this.add(this.#mesh)
    }
  }

  // 可重写：模拟行为
  simulate(_city) {}

  // 设置选中高亮
  setSelected(value) {
    if (value) {
      this.#setMeshEmission(SELECTED_COLOR)
      this.#setMeshOpacity(SIMOBJECT_SELECTED_OPACITY)
    }
    else {
      this.#setMeshEmission(0)
      this.#setMeshOpacity(SIMOBJECT_DEFAULT_OPACITY)
    }
  }

  setFocused(value) {
    if (value) {
      this.#setMeshEmission(HIGHLIGHTED_COLOR)
      this.#setMeshOpacity(SIMOBJECT_SELECTED_OPACITY)
    }
    else {
      this.#setMeshEmission(0)
      this.#setMeshOpacity(SIMOBJECT_DEFAULT_OPACITY)
    }
  }

  // 设置 mesh 的发光色
  #setMeshEmission(color) {
    if (!this.mesh)
      return
    this.mesh.traverse(obj => obj.material?.emissive?.setHex(color))
  }

  // 设置 mesh 的透明度
  #setMeshOpacity(opacity) {
    if (!this.mesh)
      return
    this.mesh.traverse(obj => obj.material && (obj.material.opacity = opacity))
  }

  /**
   * 返回该地皮的 HTML 信息（TailwindCSS 美化）
   * @returns {string} HTML representation of this tile
   */
  toHTML() {
    let html = `
      <div class="info-heading text-lg font-bold mb-2 text-blue-700">地块信息</div>
      <div class="flex flex-col gap-1">
        <div><span class="info-label text-gray-500">坐标：</span>
        <span class="info-value text-gray-800">X: ${this.x}, Y: ${this.y}</span></div>
        <div><span class="info-label text-gray-500">地形：</span>
        <span class="info-value text-gray-800">${this.type}</span></div>
    `
    if (this.building) {
      // 方向文本映射
      const dirMap = ['右', '下', '左', '上']
      const dirText = dirMap[this.direction % 4] || this.direction
      html += `<div><span class="info-label text-gray-500">建筑：</span><span class="info-value text-gray-800">${this.building}（朝向：${dirText}）</span></div>`
    }
    html += '</div>'
    return html
  }

  // 清理资源
  dispose() {
    if (!this.#mesh)
      return
    this.#mesh.traverse((obj) => {
      if (obj.material) {
        obj.material?.dispose()
      }
    })
  }
}
