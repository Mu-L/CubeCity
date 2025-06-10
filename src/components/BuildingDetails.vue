<script setup>
import { computed } from 'vue'
import { useGameState } from '../stores/useGameState'

const gameState = useGameState()
const selectedBuilding = computed(() => gameState.selectedBuilding)
// 假数据，后续可从 constants.js 动态导入
const buildingData = [
  { type: 'factory', name: 'Factory Unit', icon: '🏭', category: 'industry' },
  { type: 'warehouse', name: 'Warehouse', icon: '🏬', category: 'industry' },
  { type: 'apartment', name: 'Apartment', icon: '🏢', category: 'residence' },
  { type: 'house', name: 'House', icon: '🏠', category: 'residence' },
  { type: 'clinic', name: 'Clinic', icon: '🏥', category: 'service' },
  { type: 'shop', name: 'Shop', icon: '🏪', category: 'service' },
]
const building = computed(() => buildingData.find(b => b.type === selectedBuilding.value) || {})
function upgradeBuilding() {
  gameState.addToast('UPGRADE INITIATED', 'success')
}
function repairBuilding() {
  gameState.addToast('MAINTENANCE SCHEDULED', 'info')
}
function demolishBuilding() {
  gameState.addToast('DEMOLITION CONFIRMED', 'warning')
}
</script>

<template>
  <aside class="w-80 industrial-panel shadow-industrial z-40 absolute right-2 top-2 bottom-2">
    <div class="p-4 h-full flex flex-col">
      <h2 class="text-lg font-bold text-industrial-accent uppercase tracking-wide mb-4 border-b border-gray-600 pb-2">
        <span class="neon-text">UNIT DETAILS</span>
      </h2>
      <div class="flex-1">
        <div v-if="!selectedBuilding" class="h-full flex items-center justify-center">
          <div class="text-center text-gray-500">
            <div class="text-4xl mb-4">
              📋
            </div>
            <p class="text-sm uppercase tracking-wide">
              SELECT A BUILDING
            </p>
            <p class="text-xs mt-2">
              Click on any structure to view details
            </p>
          </div>
        </div>
        <div v-else>
          <!-- 建筑详情显示 -->
          <div class="text-center mb-6">
            <div class="text-6xl mb-3">
              {{ building.icon }}
            </div>
            <h3 class="text-xl font-bold text-industrial-accent uppercase tracking-wide neon-text">
              {{ building.name }}
            </h3>
            <p class="text-sm text-gray-400 uppercase tracking-wide">
              {{ building.type }}
            </p>
          </div>
          <div class="space-y-4">
            <div class="resource-display rounded p-3">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs text-gray-400 uppercase tracking-wide">STATUS</span>
                <div class="flex items-center space-x-2">
                  <div class="status-indicator status-online" />
                  <span class="text-xs text-industrial-green uppercase">OPERATIONAL</span>
                </div>
              </div>
              <div class="text-lg font-bold text-white">
                98% EFFICIENCY
              </div>
            </div>
            <div class="resource-display rounded p-3">
              <div class="text-xs text-gray-400 uppercase tracking-wide mb-2">
                PRODUCTION
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-300">Output/Hour:</span>
                <span class="text-sm font-bold text-industrial-green">+150 ⚡</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-300">Workers:</span>
                <span class="text-sm font-bold text-industrial-blue">25/30</span>
              </div>
            </div>
            <div class="resource-display rounded p-3">
              <div class="text-xs text-gray-400 uppercase tracking-wide mb-2">
                MAINTENANCE
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-300">Condition:</span>
                <span class="text-sm font-bold text-industrial-yellow">85%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-300">Next Service:</span>
                <span class="text-sm font-bold text-gray-300">12h</span>
              </div>
            </div>
          </div>
          <div class="mt-6 space-y-2">
            <button class="industrial-button w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide" @click="upgradeBuilding">
              ⬆️ UPGRADE UNIT
            </button>
            <button class="industrial-button w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide" @click="repairBuilding">
              🔧 MAINTENANCE
            </button>
            <button class="industrial-button w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide" @click="demolishBuilding">
              💥 DEMOLISH
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
