/**
 * 定义项目所需的静态资源列表。
 * Resources 类会根据 'type' 属性自动选择合适的加载器。
 *
 * 支持的资源类型 (type) 及其对应的加载器/方式:
 * - gltfModel:   GLTFLoader (支持 Draco 和 KTX2 压缩)
 * - texture:     TextureLoader (普通图像纹理, 如 jpg, png)
 * - cubeTexture: CubeTextureLoader (立方体贴图, 用于环境映射等)
 * - font:        FontLoader (加载字体文件, 通常是 json 格式)
 * - fbxModel:    FBXLoader (加载 FBX 模型)
 * - audio:       AudioLoader (加载音频文件)
 * - objModel:    OBJLoader (加载 OBJ 模型)
 * - hdrTexture:  RGBELoader (加载 HDR 环境贴图)
 * - svg:         SVGLoader (加载 SVG 文件作为纹理或数据)
 * - exrTexture:  EXRLoader (加载 EXR 高动态范围图像)
 * - video:       自定义加载逻辑，创建 VideoTexture (加载视频作为纹理)
 * - ktx2Texture: KTX2Loader (加载 KTX2 压缩纹理)
 */
export default [
  {
    name: 'environmentMapTexture',
    type: 'cubeTexture',
    path: [
      'textures/environmentMap/px.jpg',
      'textures/environmentMap/nx.jpg',
      'textures/environmentMap/py.jpg',
      'textures/environmentMap/ny.jpg',
      'textures/environmentMap/pz.jpg',
      'textures/environmentMap/nz.jpg',
    ],
  },
  { name: 'grass', type: 'gltfModel', path: 'models/tile-grass.glb' },
  { name: 'ground', type: 'gltfModel', path: 'models/tile-ground.glb' },
  // 房屋
  { name: 'house_level1', type: 'gltfModel', path: 'models/house_level1.glb' },
  { name: 'house_level2', type: 'gltfModel', path: 'models/house_level2.glb' },
  { name: 'house_level3', type: 'gltfModel', path: 'models/house_level3.glb' },
  // shop
  { name: 'shop_level1', type: 'gltfModel', path: 'models/shop_level1.glb' },
  { name: 'shop_level2', type: 'gltfModel', path: 'models/shop_level2.glb' },
  { name: 'shop_level3', type: 'gltfModel', path: 'models/shop_level3.glb' },
  // office
  { name: 'office_level1', type: 'gltfModel', path: 'models/office_level1.glb' },
  { name: 'office_level2', type: 'gltfModel', path: 'models/office_level2.glb' },
  { name: 'office_level3', type: 'gltfModel', path: 'models/office_level3.glb' },
  // park
  { name: 'park_level1', type: 'gltfModel', path: 'models/tree_level1.glb' },
  { name: 'park_level2', type: 'gltfModel', path: 'models/tree_level2.glb' },
  { name: 'park_level3', type: 'gltfModel', path: 'models/tree_level3.glb' },
  // roadPass
  {
    name: 'road',
    type: 'gltfModel',
    path: 'models/road-straight.glb',
  },
  {
    name: 'roadBend',
    type: 'gltfModel',
    path: 'models/road-bend.glb',
  },
  {
    name: 'road3Way',
    type: 'gltfModel',
    path: 'models/road-3way.glb',
  },
  {
    name: 'road4Way',
    type: 'gltfModel',
    path: 'models/road-4way.glb',
  },
  // hospital
  { name: 'hospital', type: 'gltfModel', path: 'models/hospital.glb' },
  // police
  { name: 'police', type: 'gltfModel', path: 'models/police.glb' },
  // factory
  {
    name: 'factory',
    type: 'gltfModel',
    path: 'models/factory.glb',
  },
  // smoke 用 perlin 噪声
  {
    name: 'perlinNoise',
    type: 'texture',
    path: 'textures/perlin.png',
  },
]
