// 建筑分类（RCI & ESG）
export const BUILDING_CATEGORIES = [
  { key: 'residential', label: '住宅', color: 'bg-blue-400' },
  { key: 'commercial', label: '商业', color: 'bg-yellow-400' },
  { key: 'industrial', label: '工业', color: 'bg-red-400' },
  { key: 'environment', label: '环境', color: 'bg-green-400' },
  { key: 'social', label: '社会', color: 'bg-pink-400' },
  { key: 'governance', label: '治理', color: 'bg-gray-400' },
]

// 建筑数据（数组结构，type为唯一标识）
export const BUILDING_DATA = [
  { type: 'factory', name: '工厂', icon: '🏭', buildingType: '工业建筑', cost: 500, category: 'industrial' },
  { type: 'house_level1', name: '住宅', icon: '🏠', buildingType: '住宅建筑', cost: 300, category: 'residential' },
  { type: 'house_level2', name: '二级住宅', icon: '🏠', buildingType: '住宅建筑', cost: 300, category: 'residential', visible: false },
  { type: 'house_level3', name: '三级住宅', icon: '🏠', buildingType: '住宅建筑', cost: 300, category: 'residential', visible: false },
  { type: 'shop_level1', name: '商店', icon: '🏬', buildingType: '商业建筑', cost: 400, category: 'commercial' },
  { type: 'shop_level2', name: '二级商店', icon: '🏬', buildingType: '商业建筑', cost: 400, category: 'commercial', visible: false },
  { type: 'shop_level3', name: '三级商店', icon: '🏬', buildingType: '商业建筑', cost: 400, category: 'commercial', visible: false },
  { type: 'office_level1', name: '办公室', icon: '🏢', buildingType: '办公建筑', cost: 500, category: 'commercial' },
  { type: 'office_level2', name: '二级办公室', icon: '🏢', buildingType: '办公建筑', cost: 500, category: 'commercial', visible: false },
  { type: 'office_level3', name: '三级办公室', icon: '🏢', buildingType: '办公建筑', cost: 500, category: 'commercial', visible: false },
  { type: 'park_level1', name: '公园', icon: '🌳', buildingType: '环境设施', cost: 200, category: 'environment' },
  { type: 'park_level2', name: '二级公园', icon: '🌳', buildingType: '环境设施', cost: 200, category: 'environment', visible: false },
  { type: 'park_level3', name: '三级公园', icon: '🌳', buildingType: '环境设施', cost: 200, category: 'environment', visible: false },
  { type: 'hospital', name: '医院', icon: '🏥', buildingType: '社会设施', cost: 350, category: 'social' },
  { type: 'police', name: '警察局', icon: '👮', buildingType: '治理设施', cost: 800, category: 'governance' },
  // ... 可继续扩展
]

// 操作模式常量
export const BUILDING_MODES = [
  { key: 'select', label: 'SELECT', icon: '🔍' },
  { key: 'build', label: 'BUILD', icon: '🔧' },
  { key: 'relocate', label: 'RELOCATE', icon: '📦' },
  { key: 'demolish', label: 'DEMOLISH', icon: '💥' },
]

// 其它全局常量
export const SIZE = 17
export const SIMOBJECT_SELECTED_OPACITY = 0.5 // 选中/高亮时透明度
export const SIMOBJECT_DEFAULT_OPACITY = 1.0 // 默认透明度
export const SELECTED_COLOR = 0xAAAA55
export const HIGHLIGHTED_COLOR = 0x555555
