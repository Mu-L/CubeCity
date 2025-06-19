<script setup>
import { useI18n } from 'vue-i18n'
// 只定义 props，不赋值变量

const _props = defineProps({
  building: { type: Object, required: true },
  selectedPosition: { type: Object, required: true },
  currentMode: { type: String, required: true },
})

const _emit = defineEmits(['upgrade', 'repair', 'demolish'])
const { t, locale } = useI18n()
</script>

<template>
  <div>
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
      <div v-if="currentMode === 'select'" class="resource-display rounded p-3">
        <div class="text-sm text-gray-400 uppercase tracking-wide mb-2">
          {{ t('buildingDetails.tile') }}
        </div>
        <div class="flex justify-between">
          <span class="text-sm font-bold text-industrial-blue">
            {{ selectedPosition.x }}, {{ selectedPosition.z }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="currentMode === 'select'" class="mt-6 space-y-2">
      <button class="industrial-button w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide" @click="$emit('upgrade')">
        ⬆️ {{ t('buildingDetails.upgradeUnit') }}
      </button>
      <button class="industrial-button w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide" @click="$emit('repair')">
        🔧 {{ t('buildingDetails.maintenanceBtn') }}
      </button>
      <button class="industrial-button w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide" @click="$emit('demolish')">
        💥 {{ t('buildingDetails.demolish') }}
      </button>
    </div>
  </div>
</template>
