// 建筑分类（RCI & ESG）
export const BUILDING_CATEGORIES = [
  { key: 'residential', label: {
    zh: '住宅',
    en: 'Residential',
  }, color: 'bg-blue-400' },
  { key: 'commercial', label: {
    zh: '商业',
    en: 'Commercial',
  }, color: 'bg-yellow-400' },
  { key: 'industrial', label: {
    zh: '工业',
    en: 'Industrial',
  }, color: 'bg-red-400' },
  { key: 'infrastructure', label: {
    zh: '基础设施',
    en: 'Infrastructure',
  }, color: 'bg-purple-400' },
  { key: 'environment', label: {
    zh: '环境',
    en: 'Environment',
  }, color: 'bg-green-400' },
  { key: 'social', label: {
    zh: '社会',
    en: 'Social',
  }, color: 'bg-pink-400' },
  { key: 'governance', label: {
    zh: '治理',
    en: 'Governance',
  }, color: 'bg-gray-400' },
]

export const BUILDING_DATA = [
  // ===================== 住宅建筑 =====================
  {
    type: 'house_level1',
    name: { zh: '住宅', en: 'Residential' },
    icon: '🏠',
    buildingType: { zh: '住宅建筑', en: 'Residential Building' },
    cost: 300,
    category: 'residential',
    maxPopulation: 50, // 人口容量
    powerUsage: 10,
    pollution: 2,
    visible: true,
  },
  {
    type: 'house_level2',
    name: { zh: '二级住宅', en: 'Secondary Residential' },
    icon: '🏠',
    buildingType: { zh: '住宅建筑', en: 'Residential Building' },
    cost: 600,
    category: 'residential',
    maxPopulation: 100,
    powerUsage: 15,
    pollution: 3,
    visible: false,
  },
  {
    type: 'house_level3',
    name: { zh: '三级住宅', en: 'Tertiary Residential' },
    icon: '🏠',
    buildingType: { zh: '住宅建筑', en: 'Residential Building' },
    cost: 1200,
    category: 'residential',
    maxPopulation: 200,
    powerUsage: 20,
    pollution: 5,
    visible: false,
  },
  {
    type: 'house2_level1',
    name: { zh: '民宅', en: 'House' },
    icon: '🏡',
    buildingType: { zh: '住宅建筑', en: 'Residential Building' },
    cost: 400,
    category: 'residential',
    maxPopulation: 40,
    powerUsage: 8,
    pollution: 1,
    visible: true,
  },
  {
    type: 'house2_level2',
    name: { zh: '二级民宅', en: 'Secondary House' },
    icon: '🏡',
    buildingType: { zh: '住宅建筑', en: 'Residential Building' },
    cost: 800,
    category: 'residential',
    maxPopulation: 80,
    powerUsage: 12,
    pollution: 2,
    visible: false,
  },
  {
    type: 'house2_level3',
    name: { zh: '三级民宅', en: 'Tertiary House' },
    icon: '🏡',
    buildingType: { zh: '住宅建筑', en: 'Residential Building' },
    cost: 1600,
    category: 'residential',
    maxPopulation: 160,
    powerUsage: 18,
    pollution: 3,
    visible: false,
  },

  // ===================== 工业建筑 =====================
  {
    type: 'factory',
    name: { zh: '工厂', en: 'Factory' },
    icon: '🏭',
    buildingType: { zh: '工业建筑', en: 'Industrial Building' },
    cost: 500,
    category: 'industrial',
    powerUsage: 25,
    pollution: 15,
    coinOutput: 20,
    population: 20, // 提供20个工作岗位
    visible: true,
  },
  {
    type: 'chemistry_level1',
    name: { zh: '化学工厂', en: 'Chemistry Factory' },
    icon: '🧪',
    buildingType: { zh: '化学工厂', en: 'Chemistry Factory' },
    cost: 1000,
    category: 'industrial',
    powerUsage: 35,
    pollution: 25,
    coinOutput: 30,
    visible: true,
    population: 25,
  },
  {
    type: 'chemistry_level2',
    name: { zh: '化学工厂', en: 'Chemistry Factory' },
    icon: '🧪',
    buildingType: { zh: '化学工厂', en: 'Chemistry Factory' },
    cost: 1500,
    category: 'industrial',
    powerUsage: 45,
    pollution: 35,
    coinOutput: 45,
    visible: false,
    population: 35,
  },
  {
    type: 'chemistry_level3',
    name: { zh: '化学工厂', en: 'Chemistry Factory' },
    icon: '🧪',
    buildingType: { zh: '化学工厂', en: 'Chemistry Factory' },
    cost: 2000,
    category: 'industrial',
    powerUsage: 60,
    pollution: 50,
    coinOutput: 60,
    visible: false,
    population: 50,
  },
  {
    type: 'nuke_factory',
    name: { zh: '核电站', en: 'Nuclear Power Plant' },
    icon: '☢️',
    buildingType: { zh: '核电站', en: 'Nuclear Power Plant' },
    cost: 5000,
    category: 'industrial',
    powerOutput: 300, // 主要电力来源
    pollution: 40,
    coinOutput: 50,
    population: 50, // 提供50个工作岗位
    visible: true,
  },

  // ===================== 商业建筑 =====================
  {
    type: 'shop_level1',
    name: { zh: '商店', en: 'Shop' },
    icon: '🏬',
    buildingType: { zh: '商业建筑', en: 'Commercial Building' },
    cost: 400,
    category: 'commercial',
    powerUsage: 15,
    pollution: 5,
    coinOutput: 25,
    population: 15,
    visible: true,
  },
  {
    type: 'shop_level2',
    name: { zh: '二级商店', en: 'Secondary Shop' },
    icon: '🏬',
    buildingType: { zh: '商业建筑', en: 'Commercial Building' },
    cost: 800,
    category: 'commercial',
    powerUsage: 25,
    pollution: 8,
    coinOutput: 40,
    visible: false,
    population: 25,
  },
  {
    type: 'shop_level3',
    name: { zh: '三级商店', en: 'Tertiary Shop' },
    icon: '🏬',
    buildingType: { zh: '商业建筑', en: 'Commercial Building' },
    cost: 1600,
    category: 'commercial',
    powerUsage: 40,
    pollution: 12,
    coinOutput: 60,
    visible: false,
    population: 40,
  },
  {
    type: 'office_level1',
    name: { zh: '办公室', en: 'Office' },
    icon: '🏢',
    buildingType: { zh: '办公建筑', en: 'Office Building' },
    cost: 500,
    category: 'commercial',
    powerUsage: 30,
    pollution: 8,
    coinOutput: 35,
    population: 30,
    visible: true,
  },
  {
    type: 'office_level2',
    name: { zh: '二级办公室', en: 'Secondary Office' },
    icon: '🏢',
    buildingType: { zh: '办公建筑', en: 'Office Building' },
    cost: 1000,
    category: 'commercial',
    powerUsage: 45,
    pollution: 12,
    coinOutput: 55,
    visible: false,
    population: 45,
  },
  {
    type: 'office_level3',
    name: { zh: '三级办公室', en: 'Tertiary Office' },
    icon: '🏢',
    buildingType: { zh: '办公建筑', en: 'Office Building' },
    cost: 2000,
    category: 'commercial',
    powerUsage: 65,
    pollution: 18,
    coinOutput: 80,
    visible: false,
    population: 60,
  },

  // ===================== 环境设施 =====================
  {
    type: 'park_level1',
    name: { zh: '公园', en: 'Park' },
    icon: '🌳',
    buildingType: { zh: '环境设施', en: 'Environmental Facility' },
    cost: 200,
    category: 'social',
    powerUsage: 5,
    pollution: -10, // 显著降低污染
    population: 0,
    visible: true,
  },
  {
    type: 'park_level2',
    name: { zh: '二级公园', en: 'Secondary Park' },
    icon: '🌳',
    buildingType: { zh: '环境设施', en: 'Environmental Facility' },
    cost: 400,
    category: 'social',
    powerUsage: 8,
    pollution: -20,
    visible: false,
    population: 0,
  },
  {
    type: 'park_level3',
    name: { zh: '三级公园', en: 'Tertiary Park' },
    icon: '🌳',
    buildingType: { zh: '环境设施', en: 'Environmental Facility' },
    cost: 800,
    category: 'social',
    powerUsage: 12,
    pollution: -30,
    visible: false,
    population: 0,
  },
  {
    type: 'garbage_station',
    name: { zh: '垃圾站', en: 'Garbage Station' },
    icon: '🗑️',
    buildingType: { zh: '环境设施', en: 'Environmental Facility' },
    cost: 500,
    category: 'environment',
    powerUsage: 20,
    pollution: 15,
    population: 10, // 提供10个工作岗位
    visible: true,
  },
  {
    type: 'sun_power',
    name: { zh: '太阳能电板', en: 'Solar Panel' },
    icon: '☀️',
    buildingType: { zh: '环境设施', en: 'Environmental Facility' },
    cost: 800,
    category: 'environment',
    powerOutput: 50,
    pollution: -2, // 轻微降低污染
    population: 5,
    visible: true,
  },
  {
    type: 'water_tower',
    name: { zh: '水塔', en: 'Water Tower' },
    icon: '🚰',
    buildingType: { zh: '环境设施', en: 'Environmental Facility' },
    cost: 700,
    category: 'environment',
    powerUsage: 15,
    pollution: 0,
    population: 3,
    visible: true,
  },
  {
    type: 'wind_power',
    name: { zh: '风力发电塔', en: 'Wind Power' },
    icon: '🌬️',
    buildingType: { zh: '环境设施', en: 'Environmental Facility' },
    cost: 900,
    category: 'environment',
    powerOutput: 70,
    pollution: -3, // 轻微降低污染
    population: 5,
    visible: true,
  },
  {
    type: 'hero_park',
    name: { zh: '英雄纪念碑', en: 'Hero Monument' },
    icon: '🗽',
    buildingType: { zh: '社会设施', en: 'Social Facility' },
    cost: 1200,
    category: 'social',
    powerUsage: 10,
    pollution: -5, // 降低污染
    population: 0,
    visible: true,
  },

  // ===================== 基础设施 =====================
  {
    type: 'road',
    name: { zh: '道路', en: 'Road' },
    icon: '🛣️',
    buildingType: { zh: '道路', en: 'Road' },
    cost: 0,
    category: 'infrastructure',
    powerUsage: 0,
    pollution: 0,
    population: 0,
    visible: true,
  },

  // ===================== 治理设施 =====================
  {
    type: 'hospital',
    name: { zh: '医院', en: 'Hospital' },
    icon: '🏥',
    buildingType: { zh: '社会设施', en: 'Social Facility' },
    cost: 350,
    category: 'governance',
    powerUsage: 40,
    pollution: 0,
    population: 40, // 提供40个医疗岗位
    visible: true,
  },
  {
    type: 'police',
    name: { zh: '警察局', en: 'Police Station' },
    icon: '👮',
    buildingType: { zh: '治理设施', en: 'Governance Facility' },
    cost: 800,
    category: 'governance',
    powerUsage: 30,
    pollution: 0,
    population: 25, // 提供25个治安岗位
    visible: true,
  },
  {
    type: 'fire_station',
    name: { zh: '消防站', en: 'Fire Station' },
    icon: '🚒',
    buildingType: { zh: '社会设施', en: 'Social Facility' },
    cost: 600,
    category: 'governance',
    powerUsage: 35,
    pollution: 0,
    population: 20, // 提供20个消防岗位
    visible: true,
  },
]
// 操作模式常量
export const BUILDING_MODES = [
  { key: 'select', label: {
    zh: '选择',
    en: 'Select',
  }, icon: '🔍' },
  { key: 'build', label: {
    zh: '建造',
    en: 'Build',
  }, icon: '🏗️' },
  { key: 'relocate', label: {
    zh: '搬迁',
    en: 'Relocate',
  }, icon: '🚧' },
  { key: 'demolish', label: {
    zh: '拆除',
    en: 'Demolish',
  }, icon: '💥' },
]

// 其它全局常量
export const SIZE = 17
export const SIMOBJECT_SELECTED_OPACITY = 0.5 // 选中/高亮时透明度
export const SIMOBJECT_DEFAULT_OPACITY = 1.0 // 默认透明度
export const SELECTED_COLOR = 0xFFBB00
export const SELECTED_COLOR_OPACITY = 0.75
export const BUILD_COLOR = 0x00FF00
export const BUILD_COLOR_OPACITY = 0.7
export const DEMOLISH_COLOR = 0xFF3000
export const DEMOLISH_COLOR_OPACITY = 0.7
export const HIGHLIGHTED_COLOR = 0x555555
export const HIGHLIGHTED_COLOR_OPACITY = 0.7
export const RELOCATE_COLOR = 0x0303FF
export const RELOCATE_COLOR_OPACITY = 0.7
// 新增：建造无效时的橙色高亮
export const BUILD_INVALID_COLOR = 0x555555 // 橙色
export const BUILD_INVALID_COLOR_OPACITY = 0.7
