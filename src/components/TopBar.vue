<script setup>
import { useGameState } from '@/stores/useGameState.js'
import { storeToRefs } from 'pinia'

const gameState = useGameState()
const { credits, population, maxPopulation, territory, citySize, cityLevel, cityName } = storeToRefs(gameState)
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
              <div class="text-xs text-gray-400 uppercase tracking-wide">
                CREDITS
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
              <div class="text-xs text-gray-400 uppercase tracking-wide">
                POPULATION
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
              <div class="text-xs text-gray-400 uppercase tracking-wide">
                TERRITORY
              </div>
              <div class="text-lg font-bold text-industrial-green neon-text">
                {{ territory }}×{{ citySize }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧城市信息 -->
      <div class="text-right">
        <h1 class="text-2xl font-black text-industrial-accent neon-text uppercase tracking-wider">
          {{ cityName }}
        </h1>
        <div class="flex items-center justify-end space-x-2 mt-1">
          <div class="status-indicator status-online" />
          <span class="text-sm text-gray-400 uppercase tracking-wide">LEVEL {{ cityLevel }} • ONLINE</span>
        </div>
      </div>
    </div>
  </header>
</template>
