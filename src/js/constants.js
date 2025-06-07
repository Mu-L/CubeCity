// 建筑分类（RCI & ESG）
export const BUILDING_CATEGORIES = [
  { key: 'residential', label: '住宅', color: 'bg-blue-400' },
  { key: 'commercial', label: '商业', color: 'bg-yellow-400' },
  { key: 'industrial', label: '工业', color: 'bg-red-400' },
  { key: 'environment', label: '环境', color: 'bg-green-400' },
  { key: 'social', label: '社会', color: 'bg-pink-400' },
  { key: 'governance', label: '治理', color: 'bg-gray-400' },
]

// 建筑数据
export const BUILDING_DATA = {
  factory: { name: '工厂', icon: '🏭', type: '工业建筑', cost: 500, category: 'industrial' },
  house: { name: '住宅', icon: '🏠', type: '住宅建筑', cost: 300, category: 'residential' },
  shop: { name: '商店', icon: '🏬', type: '商业建筑', cost: 400, category: 'commercial' },
  park: { name: '公园', icon: '🌳', type: '环境设施', cost: 200, category: 'environment' },
  school: { name: '学校', icon: '🏫', type: '社会设施', cost: 350, category: 'social' },
  cityhall: { name: '市政厅', icon: '🏢', type: '治理设施', cost: 800, category: 'governance' },
  // ... 可继续扩展
}

// 其它全局常量
export const SIZE = 17
export const SIMOBJECT_SELECTED_OPACITY = 0.5 // 选中/高亮时透明度
export const SIMOBJECT_DEFAULT_OPACITY = 1.0 // 默认透明度
export const SELECTED_COLOR = 0xAAAA55
export const HIGHLIGHTED_COLOR = 0x555555
