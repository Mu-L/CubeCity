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

// 建筑数据（数组结构，type为唯一标识）
export const BUILDING_DATA = [
  { type: 'factory', name: {
    zh: '工厂',
    en: 'Factory',
  }, icon: '🏭', buildingType: {
    zh: '工业建筑',
    en: 'Industrial Building',
  }, cost: 500, category: 'industrial' },
  { type: 'house_level1', name: {
    zh: '住宅',
    en: 'Residential',
  }, icon: '🏠', buildingType: {
    zh: '住宅建筑',
    en: 'Residential Building',
  }, cost: 300, category: 'residential' },
  { type: 'house_level2', name: {
    zh: '二级住宅',
    en: 'Secondary Residential',
  }, icon: '🏠', buildingType: {
    zh: '住宅建筑',
    en: 'Residential Building',
  }, cost: 300, category: 'residential', visible: false },
  { type: 'house_level3', name: {
    zh: '三级住宅',
    en: 'Tertiary Residential',
  }, icon: '🏠', buildingType: {
    zh: '住宅建筑',
    en: 'Residential Building',
  }, cost: 300, category: 'residential', visible: false },
  { type: 'shop_level1', name: {
    zh: '商店',
    en: 'Shop',
  }, icon: '🏬', buildingType: {
    zh: '商业建筑',
    en: 'Commercial Building',
  }, cost: 400, category: 'commercial' },
  { type: 'shop_level2', name: {
    zh: '二级商店',
    en: 'Secondary Shop',
  }, icon: '🏬', buildingType: {
    zh: '商业建筑',
    en: 'Commercial Building',
  }, cost: 400, category: 'commercial', visible: false },
  { type: 'shop_level3', name: {
    zh: '三级商店',
    en: 'Tertiary Shop',
  }, icon: '🏬', buildingType: {
    zh: '商业建筑',
    en: 'Commercial Building',
  }, cost: 400, category: 'commercial', visible: false },
  { type: 'office_level1', name: {
    zh: '办公室',
    en: 'Office',
  }, icon: '🏢', buildingType: {
    zh: '办公建筑',
    en: 'Office Building',
  }, cost: 500, category: 'commercial' },
  { type: 'office_level2', name: {
    zh: '二级办公室',
    en: 'Secondary Office',
  }, icon: '🏢', buildingType: {
    zh: '办公建筑',
    en: 'Office Building',
  }, cost: 500, category: 'commercial', visible: false },
  { type: 'office_level3', name: {
    zh: '三级办公室',
    en: 'Tertiary Office',
  }, icon: '🏢', buildingType: {
    zh: '办公建筑',
    en: 'Office Building',
  }, cost: 500, category: 'commercial', visible: false },
  { type: 'park_level1', name: {
    zh: '公园',
    en: 'Park',
  }, icon: '🌳', buildingType: {
    zh: '环境设施',
    en: 'Environmental Facility',
  }, cost: 200, category: 'environment' },
  { type: 'park_level2', name: {
    zh: '二级公园',
    en: 'Secondary Park',
  }, icon: '🌳', buildingType: {
    zh: '环境设施',
    en: 'Environmental Facility',
  }, cost: 200, category: 'environment', visible: false },
  { type: 'park_level3', name: {
    zh: '三级公园',
    en: 'Tertiary Park',
  }, icon: '🌳', buildingType: {
    zh: '环境设施',
    en: 'Environmental Facility',
  }, cost: 200, category: 'environment', visible: false },
  { type: 'road', name: {
    zh: '道路',
    en: 'Road',
  }, icon: '🛣️', buildingType: {
    zh: '道路',
    en: 'Road',
  }, cost: 0, category: 'environment' },
  { type: 'hospital', name: {
    zh: '医院',
    en: 'Hospital',
  }, icon: '🏥', buildingType: {
    zh: '社会设施',
    en: 'Social Facility',
  }, cost: 350, category: 'social' },
  { type: 'police', name: {
    zh: '警察局',
    en: 'Police Station',
  }, icon: '👮', buildingType: {
    zh: '治理设施',
    en: 'Governance Facility',
  }, cost: 800, category: 'governance' },
  // ... 可继续扩展
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
export const BUILD_INVALID_COLOR = 0xBF0000 // 橙色
export const BUILD_INVALID_COLOR_OPACITY = 0.7
