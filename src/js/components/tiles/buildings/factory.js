import Experience from '@/js/experience.js'
import smokeFragmentShader from '@/shaders/smoke/fragment.glsl'
import smokeVertexShader from '@/shaders/smoke/vertex.glsl'
import * as THREE from 'three'
import Building from '../building.js'

// 工厂类建筑
export default class Factory extends Building {
  constructor(type = 'factory', level = 1, direction = 0, options = {}) {
    super(type, level, direction, options)

    this.experience = new Experience()
    this.resources = this.experience.resources
    this.perlinNoise = this.resources.items.perlinNoise
    this.perlinNoise.wrapS = THREE.RepeatWrapping
    this.perlinNoise.wrapT = THREE.RepeatWrapping
    this.time = this.experience.time
    this.camera = this.experience.camera.instance
    this.smoke()

    // --- 新的轮循状态系统配置 ---
    this.statusConfig = [
      // 继承基础的 debuff 状态（如缺少道路）
      ...super.getDefaultStatusConfig(),

      // === DEBUFF 状态（问题状态，优先轮循显示） ===

      // 电力过载（工厂消耗太多电力）
      {
        statusType: 'MISSING_POWER',
        condition: (building, gs) => gs.power > gs.maxPower,
        effect: { type: 'missPower', offsetY: 0.6 },
      },

      // 环境污染（需要垃圾站）
      {
        statusType: 'MISSING_POLLUTION',
        condition: (building, gs) => {
          // 周围没有垃圾站时激活污染警告
          building.buffConfig = { targets: ['garbage_station'], range: 4 }
          return !building.checkForBuffTargets(gs)
        },
        effect: { type: 'missPollution', offsetY: 0.6 },
      },

      // === BUFF 状态（增益状态，无问题时轮循显示） ===

      // 为化工厂提供增益
      {
        statusType: 'POWER_BOOST',
        condition: (building, gs) => {
          // 周围有化工厂时提供工业增益
          building.buffConfig = { targets: ['chemistry_factory'], range: 2 }
          return building.checkForBuffTargets(gs)
        },
        effect: { type: 'powerup', offsetY: 0.6 },
      },
    ]
  }

  // 辅助方法：检查指定范围内的目标
  checkTargetsInRange(targets, range, gameState) {
    this.buffConfig = { targets, range }
    return this.checkForBuffTargets(gameState)
  }

  // 不可升级
  upgrade() { return null }

  getCost() {
    return this.options.buildingData?.cost || 0
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
    // 更新烟雾动画
    if (this.smokeMaterial) {
      this.smokeMaterial.uniforms.uTime.value = this.time.elapsed * 0.008
    }

    // 调用父类的新轮循逻辑
    super.update()

    // 调用需要持续更新的效果（如shader、广告牌朝向相机等）
    super.updateActiveEffect()
  }
}
