<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { BUILDING_DATA } from '../constants/constants'
import { useGameState } from '../stores/useGameState'

const { t, locale } = useI18n()
const gameState = useGameState()
const selectedBuilding = computed(() => gameState.selectedBuilding)
const currentMode = computed(() => gameState.currentMode)
const selectedBuildingInstance = computed(() => gameState.selectedBuildingInstance)
const building = computed(() => BUILDING_DATA.find(b => b.type === selectedBuilding.value) || {})
function upgradeBuilding() {
  gameState.addToast(t('buildingDetails.upgradeUnit'), 'success')
}
function repairBuilding() {
  gameState.addToast(t('buildingDetails.maintenanceBtn'), 'info')
}
function demolishBuilding() {
  gameState.addToast(t('buildingDetails.demolish'), 'warning')
}
</script>

<template>
  <aside class="w-80 industrial-panel shadow-industrial z-40 absolute right-2 top-2 bottom-2">
    <div class="p-4 h-full flex flex-col">
      <h2 class="text-lg font-bold text-industrial-accent uppercase tracking-wide mb-4 border-b border-gray-600 pb-2">
        <span class="neon-text">{{ t('buildingDetails.unitDetails') }}</span>
      </h2>
      <div class="flex-1">
        <div v-if="!selectedBuilding" class="h-full flex items-center justify-center">
          <div class="text-center text-gray-500">
            <div class="text-4xl mb-4">
              📋
            </div>
            <p class="text-sm uppercase tracking-wide">
              {{ t('buildingDetails.selectABuilding') }}
            </p>
            <p class="text-xs mt-2">
              {{ t('buildingDetails.clickToView') }}
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
              {{ building.name && building.name[locale] ? building.name[locale] : building.name }}
            </h3>
            <p class="text-sm text-gray-400 uppercase tracking-wide">
              {{ building.buildingType && building.buildingType[locale] ? building.buildingType[locale] : building.buildingType }}
            </p>
          </div>
          <div class="space-y-4">
            <div class="resource-display rounded p-3">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-400 uppercase tracking-wide">{{ t('buildingDetails.status') }}</span>
                <div class="flex items-center space-x-2">
                  <div class="status-indicator status-online" />
                  <span class="text-sm text-industrial-green uppercase">{{ t('buildingDetails.operational') }}</span>
                </div>
              </div>
              <div class="text-lg font-bold text-white uppercase flex items-center">
                <span class="text-xl mr-4 text-industrial-green">98%</span>
                <span class="text-lg text-gray-400 uppercase tracking-wide">{{ t('dashboardFooter.efficiency') }}</span>
              </div>
            </div>
            <div class="resource-display rounded p-3">
              <div class="text-sm text-gray-400 uppercase tracking-wide mb-1">
                {{ t('buildingDetails.production') }}
              </div>
              <div class="flex justify-between my-1">
                <span class="text-sm text-gray-300">{{ t('buildingDetails.outputPerHour') }}:</span>
                <span class="text-sm font-bold text-industrial-yellow">+150 ⚡</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-300">{{ t('buildingDetails.workers') }}:</span>
                <span class="text-sm font-bold text-industrial-blue">25/30</span>
              </div>
            </div>
            <div class="resource-display rounded p-3">
              <div class="text-sm text-gray-400 uppercase tracking-wide mb-2">
                {{ t('buildingDetails.maintenance') }}
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-300">{{ t('buildingDetails.condition') }}:</span>
                <span class="text-sm font-bold text-industrial-yellow">85%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-300">{{ t('buildingDetails.nextService') }}:</span>
                <span class="text-sm font-bold text-gray-300">12h</span>
              </div>
            </div>
            <!-- 显示建筑实例信息 -->
            <!-- 建筑所在 Tile 位置 -->
            <div class="resource-display rounded p-3">
              <div class="text-sm text-gray-400 uppercase tracking-wide mb-2">
                {{ t('buildingDetails.tile') }}
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-bold text-industrial-blue">
                  {{ selectedBuildingInstance.position.x }}, {{ selectedBuildingInstance.position.z }}
                </span>
                <span class="text-sm font-bold text-industrial-blue">
                  {{ selectedBuildingInstance.name }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="currentMode === 'select'" class="mt-6 space-y-2">
            <button class="industrial-button w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide" @click="upgradeBuilding">
              ⬆️ {{ t('buildingDetails.upgradeUnit') }}
            </button>
            <button class="industrial-button w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide" @click="repairBuilding">
              🔧 {{ t('buildingDetails.maintenanceBtn') }}
            </button>
            <button class="industrial-button w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide" @click="demolishBuilding">
              💥 {{ t('buildingDetails.demolish') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
