<script setup>
import { useGameState } from '@/stores/useGameState.js'
import { storeToRefs } from 'pinia'
import { ref, defineEmits } from 'vue'

const gameState = useGameState()
const { credits, population, maxPopulation, territory, citySize, cityLevel, cityName, language, showMapOverview } = storeToRefs(gameState)

function toggleLang() {
  gameState.setLanguage(language.value === 'zh' ? 'en' : 'zh')
}

function toggleMapOverview() {
  gameState.setShowMapOverview(!showMapOverview.value)
}
</script>

<template>
  <header class="industrial-panel p-4 m-2 shadow-industrial z-[10] relative ">
    <div class="flex justify-between items-center">
      <!-- 左侧资源信息 -->
      <div class="flex items-center space-x-6">
        <!-- 金币 -->
        <div class="resource-display rounded-lg px-4 py-2 flex items-center space-x-3">
          <div class="status-indicator status-online" />
          <div class="flex items-center space-x-2">
            <span class="text-industrial-yellow text-xl">⚡</span>
            <div>
              <div class="text-sm text-gray-400 uppercase " :class="language === 'zh' ? 'tracking-[0.3rem]' : 'tracking-wide'">
                {{ $t('topbar.credits') }}
              </div>
              <div class="text-lg font-bold text-industrial-yellow neon-text">
                {{ credits.toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
        <!-- 人口 -->
        <div class="resource-display rounded-lg px-4 py-2 flex items-center space-x-3">
          <div class="status-indicator status-online" />
          <div class="flex items-center space-x-2">
            <span class="text-industrial-blue text-xl">👥</span>
            <div>
              <div class="text-sm text-gray-400 uppercase" :class="language === 'zh' ? 'tracking-[0.3rem]' : 'tracking-wide'">
                {{ $t('topbar.population') }}
              </div>
              <div class="text-lg font-bold text-industrial-blue neon-text">
                {{ population }}/{{ maxPopulation }}
              </div>
            </div>
          </div>
        </div>
        <!-- 地皮 -->
        <div class="resource-display rounded-lg px-4 py-2 flex items-center space-x-3">
          <div class="status-indicator status-warning" />
          <div class="flex items-center space-x-2">
            <span class="text-industrial-green text-xl">🏭</span>
            <div>
              <div class="text-sm text-gray-400 uppercase" :class="language === 'zh' ? 'tracking-[0.3rem]' : 'tracking-wide'">
                {{ $t('topbar.territory') }}
              </div>
              <div class="text-lg font-bold text-industrial-green neon-text">
                {{ territory }}×{{ citySize }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧城市信息 -->
      <div class="text-right flex items-center space-x-2">
        <div>
          <h1 class="text-2xl font-black text-industrial-accent neon-text uppercase tracking-wider">
            {{ cityName }}
          </h1>
          <div class="flex items-center justify-end space-x-2 mt-1">
            <div class="status-indicator status-online" />
            <span class="text-sm text-gray-400 uppercase tracking-wide">{{ $t('topbar.level') }} {{ cityLevel }} • {{ $t('topbar.online') }}</span>
          </div>
        </div>
        <button class="ml-4 px-2 py-1 rounded bg-gray-700 text-white" @click="toggleLang">
          {{ language === 'zh' ? 'EN' : '中' }}
        </button>
        <!-- 新增：显示地图按钮 -->
        <button
          class="ml-2 px-3 py-1 rounded bg-industrial-accent text-white font-bold shadow hover:bg-industrial-accent/80 transition"
          @click="toggleMapOverview"
        >
          {{ showMapOverview ? '隐藏地图' : '显示地图' }}
        </button>
      </div>
    </div>
  </header>
</template>
