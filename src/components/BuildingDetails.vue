<script setup>
import { eventBus } from '@/js/utils/event-bus.js'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { BUILDING_DATA } from '../constants/constants'
import { useGameState } from '../stores/useGameState'
import BuildingDetail from './BuildingDetail.vue'
import EmptyState from './EmptyState.vue'

const { t } = useI18n()
const gameState = useGameState()
const selectedBuilding = computed(() => gameState.selectedBuilding)
const currentMode = computed(() => gameState.currentMode)
const selectedPosition = computed(() => gameState.selectedPosition)
const building = computed(() => BUILDING_DATA.find(b => b.type === selectedBuilding.value) || {})

// 升级建筑
function upgradeBuilding() {
  const data = {
    action: 'upgrade',
    buildingType: building.value.type,
  }
  eventBus.emit('ui:confirm-action', data)
}

// 维修建筑
function repairBuilding() {
  const data = {
    action: 'repair',
    buildingType: building.value.type,
  }
  eventBus.emit('ui:confirm-action', data)
}

// 拆除建筑
function demolishBuilding() {
  const data = {
    action: 'demolish',
    buildingType: building.value.type,
  }
  eventBus.emit('ui:confirm-action', data)
}
</script>

<template>
  <aside class="w-80 industrial-panel shadow-industrial z-40 absolute right-2 top-2 bottom-2">
    <div class="p-4 h-full flex flex-col">
      <h2 class="text-lg font-bold text-industrial-accent uppercase tracking-wide mb-4 border-b border-gray-600 pb-2">
        <span class="neon-text">{{ t('buildingDetails.unitDetails') }}</span>
      </h2>
      <div class="flex-1">
        <EmptyState v-if="!selectedBuilding" :current-mode="currentMode" />
        <BuildingDetail
          v-else
          :building="building"
          :selected-position="selectedPosition"
          :current-mode="currentMode"
          @upgrade="upgradeBuilding"
          @repair="repairBuilding"
          @demolish="demolishBuilding"
        />
      </div>
    </div>
  </aside>
</template>
