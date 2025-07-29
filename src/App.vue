<script setup>
import { eventBus } from '@/js/utils/event-bus.js'
import { useGameState } from '@/stores/useGameState.js'
import { onMounted, onUnmounted, ref } from 'vue'
import BuildingDetails from './components/BuildingDetails.vue'
import BuildingSidebar from './components/BuildingSidebar.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import DashboardFooter from './components/DashboardFooter.vue'
import GameCanvas from './components/GameCanvas.vue'
import MapOverview from './components/MapOverview.vue'
import ModeIndicator from './components/ModeIndicator.vue'
import RestorePrompt from './components/RestorePrompt.vue'
import SelectedIndicator from './components/SelectedIndicator.vue'
import ToastContainer from './components/ToastContainer.vue'
import TopBar from './components/TopBar.vue'
import { useBuilding } from './hooks/useBuilding.js'

const showDialog = ref(false)
const dialogData = ref({})
const { getDialogConfig, handleBuildingTransaction } = useBuilding()
const gameState = useGameState()

// 计时器，用于每日收益
let dayInterval = null

// 监听 mitt 事件
// 只监听一次即可
if (!window.__confirmDialogListenerAdded) {
  eventBus.on('ui:confirm-action', (data) => {
    dialogData.value = getDialogConfig(data.action, data.buildingType, data.buildingLevel)
    showDialog.value = true
  })
  window.__confirmDialogListenerAdded = true
}

function handleConfirm() {
  const result = handleBuildingTransaction(dialogData.value.action, dialogData.value.buildingType, dialogData.value.buildingLevel)
  if (result) {
    eventBus.emit('ui:action-confirmed', dialogData.value.action)
  }
  showDialog.value = false
}

function handleCancel() {
  showDialog.value = false
}

// ESC关闭地图总览
function handleKeydown(e) {
  if (gameState.showMapOverview && (e.key === 'Escape' || e.key === 'Esc')) {
    gameState.setShowMapOverview(false)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  // 每 10 秒触发一次“下一天”
  dayInterval = setInterval(() => {
    gameState.nextDay()
  }, 5000)
  // 启动稳定度定时器
  gameState.startStabilityTimer()
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  // 清除计时器
  clearInterval(dayInterval)
  // 停止稳定度定时器
  gameState.stopStabilityTimer()
})
</script>

<template>
  <div>
    <RestorePrompt />
    <TopBar />
    <div class="flex gap-2 px-2 h-[calc(100vh-200px)]">
      <BuildingSidebar />
      <main class="flex-1 industrial-panel shadow-industrial relative overflow-hidden industrial-grid">
        <ModeIndicator />
        <SelectedIndicator />
        <BuildingDetails />
      </main>
      <!-- 新增：地图总览，右上角浮动显示 -->
      <transition name="fade">
        <div v-if="gameState.showMapOverview" class="absolute top-[20%] right-[50%] translate-x-[50%] w-[min(90vw,600px)] h-[min(90vh,600px)] z-50 bg-[#212121] rounded-lg shadow-lg p-2" @contextmenu.prevent="gameState.setShowMapOverview(false)">
          <button
            class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full text-xl font-bold text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150 focus:outline-none z-10"
            aria-label="关闭地图总览"
            tabindex="0"
            @click="gameState.setShowMapOverview(false)"
          >
            ❌
          </button>
          <MapOverview />
        </div>
      </transition>
    </div>
    <DashboardFooter />
    <ToastContainer />
    <ConfirmDialog
      v-if="dialogData"
      :show="showDialog"
      :title="dialogData.title"
      :message="dialogData.message"
      :confirm-text="dialogData.confirmText"
      :cancel-text="dialogData.cancelText"
      :action="dialogData.action"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
  <GameCanvas />
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
