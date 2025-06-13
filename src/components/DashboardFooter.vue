<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameState } from '../stores/useGameState'

const gameState = useGameState()
const { t } = useI18n()
function showAchievements() {
  gameState.addToast(t('dashboardFooter.achievementLoading'), 'info')
}

// 系统状态数据抽离
const systemStatusList = computed(() => [
  {
    key: 'powerGrid',
    status: 'online',
    colorClass: 'text-industrial-green',
    statusClass: 'status-online',
    label: t('dashboardFooter.online'),
  },
  {
    key: 'transport',
    status: 'limited',
    colorClass: 'text-industrial-yellow',
    statusClass: 'status-warning',
    label: t('dashboardFooter.limited'),
  },
  {
    key: 'security',
    status: 'secure',
    colorClass: 'text-industrial-green',
    statusClass: 'status-online',
    label: t('dashboardFooter.secure'),
  },
  {
    key: 'environment',
    status: 'moderate',
    colorClass: 'text-industrial-yellow',
    statusClass: 'status-warning',
    label: t('dashboardFooter.moderate'),
  },
])
</script>

<template>
  <footer class="p-2">
    <div class="grid grid-cols-3 gap-2">
      <!-- 左侧统计 -->
      <div class="dashboard-card rounded-lg p-4 z-10">
        <h3 class="text-sm font-bold text-industrial-accent uppercase tracking-wide mb-3 neon-text">
          {{ t('dashboardFooter.cityMetrics') }}
        </h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-industrial-green neon-text">
              25
            </div>
            <div class="text-sm text-gray-400 uppercase" :class="gameState.language === 'zh' ? 'tracking-[0.3rem]' : 'tracking-wide'">
              {{ t('dashboardFooter.buildings') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-industrial-blue neon-text">
              +1.2K
            </div>
            <div class="text-sm text-gray-400 uppercase" :class="gameState.language === 'zh' ? 'tracking-[0.3rem]' : 'tracking-wide'">
              {{ t('dashboardFooter.dailyIncome') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-industrial-yellow neon-text">
              85%
            </div>
            <div class="text-sm text-gray-400 uppercase" :class="gameState.language === 'zh' ? 'tracking-[0.3rem]' : 'tracking-wide'">
              {{ t('dashboardFooter.efficiency') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-industrial-green neon-text">
              92%
            </div>
            <div class="text-sm text-gray-400 uppercase" :class="gameState.language === 'zh' ? 'tracking-[0.3rem]' : 'tracking-wide'">
              {{ t('dashboardFooter.stability') }}
            </div>
          </div>
        </div>
      </div>
      <!-- 中间成就系统 -->
      <div class="dashboard-card rounded-lg p-4 z-10">
        <h3 class="text-sm font-bold text-industrial-accent uppercase tracking-wide mb-3 text-center neon-text">
          {{ t('dashboardFooter.achievements') }}
        </h3>
        <div class="space-y-2">
          <div class="flex items-center justify-between bg-industrial-gray rounded p-2">
            <div class="flex items-center space-x-2">
              <span class="text-industrial-yellow">🏆</span>
              <span class="text-xs text-gray-300 uppercase">{{ t('dashboardFooter.firstFactory') }}</span>
            </div>
            <div class="status-indicator status-online" />
          </div>
          <div class="flex items-center justify-between bg-industrial-gray rounded p-2">
            <div class="flex items-center space-x-2">
              <span class="text-gray-500">🏆</span>
              <span class="text-xs text-gray-500 uppercase">{{ t('dashboardFooter.industrialTycoon') }}</span>
            </div>
            <div class="text-xs text-gray-500">
              75%
            </div>
          </div>
          <button
            class="industrial-button w-full text-white font-bold py-2 px-4 text-xs uppercase tracking-wide"
            @click="showAchievements"
          >
            {{ t('dashboardFooter.viewAllAchievements') }}
          </button>
        </div>
      </div>
      <!-- 右侧系统状态 -->
      <div class="dashboard-card rounded-lg p-4 z-10">
        <h3 class="text-sm font-bold text-industrial-accent uppercase tracking-wide mb-3 neon-text">
          {{ t('dashboardFooter.systemStatus') }}
        </h3>
        <div class="space-y-3">
          <div
            v-for="item in systemStatusList"
            :key="item.key"
            class="flex justify-between items-center"
          >
            <span class="text-xs text-gray-400 uppercase">{{ t(`dashboardFooter.${item.key}`) }}</span>
            <div class="flex items-center space-x-2">
              <div class="status-indicator" :class="item.statusClass" />
              <span class="text-xs uppercase" :class="item.colorClass">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
