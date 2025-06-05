import * as THREE from 'three'
import smokeFragmentShader from '../../../../shaders/smoke/fragment.glsl'
import smokeVertexShader from '../../../../shaders/smoke/vertex.glsl'
import Experience from '../../../Experience.js'
import Building from '../building.js'
// 工厂类建筑
export default class Factory extends Building {
  constructor(direction = 0, options = {}) {
    super('factory', direction, options)

    this.experience = new Experience()
    this.resources = this.experience.resources
    this.perlinNoise = this.resources.items.perlinNoise
    this.perlinNoise.wrapS = THREE.RepeatWrapping
    this.perlinNoise.wrapT = THREE.RepeatWrapping
    this.time = this.experience.time
    this.camera = this.experience.camera.instance
    this.smoke()
  }

  // 工厂提供电力
  getPower() {
    return 50 // 示例：每个工厂提供50电力
  }

  smoke() {
    const smokeGeometry = new THREE.PlaneGeometry(0.2, 0.4, 16, 64)
    smokeGeometry.translate(0, 0.45, 0.0)
    smokeGeometry.scale(1.5, 6, 1.5)
    this.smokeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPerlinNoise: { value: this.perlinNoise },
        uWindStrength: { value: 7.0 }, // 风强度
        uWindPower: { value: 2.0 }, // 风影响的y指数
        uTwistStrength: { value: 1.0 }, // 扭曲强度
        uNoiseFreq: { value: 0.2 }, // 噪声采样频率
        uNoiseSpeed: { value: 0.005 }, // 噪声速度
        uWindSpeed: { value: 0.001 }, // 风噪声速度
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
  // 可扩展更多工厂特有方法
}
