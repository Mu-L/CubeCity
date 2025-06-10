<script setup>
import { computed, ref } from 'vue'
import { useGameState } from '../stores/useGameState'
// 假数据，后续可从 constants.js 动态导入
const buildingCategories = ref([
  { key: 'industry', label: 'Industry', color: 'bg-industrial-yellow' },
  { key: 'residence', label: 'Residence', color: 'bg-industrial-blue' },
  { key: 'service', label: 'Service', color: 'bg-industrial-green' },
])
const buildingData = ref([
  { type: 'factory', name: 'Factory Unit', icon: '🏭', cost: 100, category: 'industry' },
  { type: 'warehouse', name: 'Warehouse', icon: '🏬', cost: 80, category: 'industry' },
  { type: 'apartment', name: 'Apartment', icon: '🏢', cost: 120, category: 'residence' },
  { type: 'house', name: 'House', icon: '🏠', cost: 60, category: 'residence' },
  { type: 'clinic', name: 'Clinic', icon: '🏥', cost: 90, category: 'service' },
  { type: 'shop', name: 'Shop', icon: '🏪', cost: 70, category: 'service' },
])
const modes = ref([
  { key: 'build', label: 'BUILD', icon: '🔧' },
  { key: 'relocate', label: 'RELOCATE', icon: '📦' },
  { key: 'demolish', label: 'DEMOLISH', icon: '💥' },
])
const gameState = useGameState()
const selectedBuilding = computed(() => gameState.selectedBuilding)
const currentMode = computed(() => gameState.currentMode)
function buildingsByCategory(catKey) {
  return buildingData.value.filter(b => b.category === catKey)
}
function selectBuilding(type) {
  gameState.selectBuilding(type)
  gameState.addToast(`选中建筑: ${type}`, 'success')
}
function setMode(mode) {
  gameState.setMode(mode)
  gameState.addToast(`切换模式: ${mode.toUpperCase()}`, 'info')
}
</script>

<template>
  <aside class="w-72 industrial-panel shadow-industrial overflow-y-auto relative z-[10]">
    <div class="p-4">
      <h2 class="text-lg font-bold text-industrial-accent uppercase tracking-wide mb-4 border-b border-gray-600 pb-2">
        <span class="neon-text">CONSTRUCTION UNITS</span>
      </h2>
      <!-- 建筑分类与卡片 -->
      <div v-for="cat in buildingCategories" :key="cat.key" class="mb-6">
        <h3 class="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide flex items-center">
          <span class="w-2 h-2 rounded-full mr-2" :class="[cat.color]" />
          {{ cat.label }}
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="b in buildingsByCategory(cat.key)" :key="b.type"
            class="building-card-industrial rounded-lg p-3 cursor-pointer" :class="[selectedBuilding === b.type ? 'ring-2 ring-industrial-accent' : '']"
            @click="selectBuilding(b.type)"
          >
            <div class="text-2xl text-center mb-1">
              {{ b.icon }}
            </div>
            <div class="text-xs text-center font-bold text-gray-300">
              {{ b.name.split(' ')[0] }}
            </div>
            <div class="text-xs text-center text-industrial-yellow">
              ⚡{{ b.cost }}
            </div>
          </div>
        </div>
      </div>
      <!-- 操作模式 -->
      <div class="mt-6 pt-4 border-t border-gray-600">
        <h3 class="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
          OPERATION MODE
        </h3>
        <div class="space-y-2">
          <button
            v-for="mode in modes" :key="mode.key"
            class="industrial-button w-full text-white font-bold py-2 px-3 text-sm uppercase tracking-wide"
            :class="currentMode === mode.key ? 'bg-industrial-accent' : ''"
            @click="setMode(mode.key)"
          >
            <span v-html="mode.icon" /> {{ mode.label }}
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>
