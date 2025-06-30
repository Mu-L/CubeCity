import Experience from '@/js/experience.js'
import smokeFragmentShader from '@/shaders/smoke/fragment.glsl'
import smokeVertexShader from '@/shaders/smoke/vertex.glsl'
import * as THREE from 'three'
import Building from '../building.js'

// 核工厂类建筑
export default class NukeFactory extends Building {
  constructor(type = 'nuke_factory', direction = 0, options = {}) {
    super(type, direction, options)

    // 获取全局依赖
    this.experience = new Experience()
    this.resources = this.experience.resources
    this.perlinNoise = this.resources.items.perlinNoise
    this.perlinNoise.wrapS = THREE.RepeatWrapping
    this.perlinNoise.wrapT = THREE.RepeatWrapping
    this.time = this.experience.time
    this.camera = this.experience.camera.instance
    this.smoke()
  }

  // 可扩展升级逻辑
  upgrade() { return null }

  getCost() {
    return this.options.buildingData?.cost || 0
  }

  // 核工厂可提供特殊产出
  getNukeOutput() {
    return 100 // 示例：每个核工厂产出100单位核能
  }

  // 仿造工厂烟雾效果
  smoke() {
    // 创建烟雾平面几何体
    const smokeGeometry = new THREE.PlaneGeometry(0.3, 0.4, 16, 64)
    smokeGeometry.translate(0, 0.45, 0.0)
    smokeGeometry.scale(1.5, 6, 1.5)
    this.smokeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPerlinNoise: { value: this.perlinNoise },
        uWindStrength: { value: 5.0 }, // 可自定义核工厂烟雾参数
        uWindPower: { value: 2.5 },
        uTwistStrength: { value: 2.0 },
        uNoiseFreq: { value: 0.25 },
        uNoiseSpeed: { value: 0.008 },
        uWindSpeed: { value: 0.002 },
      },
      vertexShader: smokeVertexShader,
      fragmentShader: smokeFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    })
    this.smokeMesh = new THREE.Mesh(smokeGeometry, this.smokeMaterial)
    this.smokeMesh.raycast = () => {}
    this.add(this.smokeMesh)
  }

  update() {
    if (this.smokeMaterial) {
      this.smokeMaterial.uniforms.uTime.value = this.time.elapsed * 0.008
    }
  }

  // 可扩展更多核工厂特有方法
} 