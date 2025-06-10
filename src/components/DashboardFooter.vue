<script setup>
import { useGameState } from '../stores/useGameState'

const gameState = useGameState()
function showAchievements() {
  gameState.addToast('ACHIEVEMENT SYSTEM LOADING...', 'info')
}
</script>

<template>
  <footer class="p-2">
    <div class="grid grid-cols-3 gap-2">
      <!-- 左侧统计 -->
      <div class="dashboard-card rounded-lg p-4">
        <h3 class="text-sm font-bold text-industrial-accent uppercase tracking-wide mb-3 neon-text">
          CITY METRICS
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-industrial-green neon-text">
              25
            </div>
            <div class="text-xs text-gray-400 uppercase">
              BUILDINGS
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-industrial-blue neon-text">
              +1.2K
            </div>
            <div class="text-xs text-gray-400 uppercase">
              DAILY INCOME
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-industrial-yellow neon-text">
              85%
            </div>
            <div class="text-xs text-gray-400 uppercase">
              EFFICIENCY
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-industrial-green neon-text">
              92%
            </div>
            <div class="text-xs text-gray-400 uppercase">
              STABILITY
            </div>
          </div>
        </div>
      </div>
      <!-- 中间成就系统 -->
      <div class="dashboard-card rounded-lg p-4">
        <h3 class="text-sm font-bold text-industrial-accent uppercase tracking-wide mb-3 text-center neon-text">
          ACHIEVEMENTS
        </h3>
        <div class="space-y-2">
          <div class="flex items-center justify-between bg-industrial-gray rounded p-2">
            <div class="flex items-center space-x-2">
              <span class="text-industrial-yellow">🏆</span>
              <span class="text-xs text-gray-300 uppercase">FIRST FACTORY</span>
            </div>
            <div class="status-indicator status-online" />
          </div>
          <div class="flex items-center justify-between bg-industrial-gray rounded p-2">
            <div class="flex items-center space-x-2">
              <span class="text-gray-500">🏆</span>
              <span class="text-xs text-gray-500 uppercase">INDUSTRIAL TYCOON</span>
            </div>
            <div class="text-xs text-gray-500">
              75%
            </div>
          </div>
          <button
            class="industrial-button w-full text-white font-bold py-2 px-4 text-xs uppercase tracking-wide"
            @click="showAchievements"
          >
            VIEW ALL ACHIEVEMENTS
          </button>
        </div>
      </div>
      <!-- 右侧系统状态 -->
      <div class="dashboard-card rounded-lg p-4">
        <h3 class="text-sm font-bold text-industrial-accent uppercase tracking-wide mb-3 neon-text">
          SYSTEM STATUS
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-400 uppercase">POWER GRID</span>
            <div class="flex items-center space-x-2">
              <div class="status-indicator status-online" />
              <span class="text-xs text-industrial-green uppercase">ONLINE</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-400 uppercase">TRANSPORT</span>
            <div class="flex items-center space-x-2">
              <div class="status-indicator status-warning" />
              <span class="text-xs text-industrial-yellow uppercase">LIMITED</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-400 uppercase">SECURITY</span>
            <div class="flex items-center space-x-2">
              <div class="status-indicator status-online" />
              <span class="text-xs text-industrial-green uppercase">SECURE</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-400 uppercase">ENVIRONMENT</span>
            <div class="flex items-center space-x-2">
              <div class="status-indicator status-warning" />
              <span class="text-xs text-industrial-yellow uppercase">MODERATE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
