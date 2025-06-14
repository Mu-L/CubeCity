<script setup>
import { eventBus } from '@/js/utils/event-bus.js'
import { ref } from 'vue'
import BuildingDetails from './components/BuildingDetails.vue'
import BuildingSidebar from './components/BuildingSidebar.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import DashboardFooter from './components/DashboardFooter.vue'
import GameCanvas from './components/GameCanvas.vue'
import ModeIndicator from './components/ModeIndicator.vue'
import SelectedIndicator from './components/SelectedIndicator.vue'
import ToastContainer from './components/ToastContainer.vue'
import TopBar from './components/TopBar.vue'

const showDialog = ref(false)
const dialogData = ref({})

// 监听 mitt 事件
// 只监听一次即可
if (!window.__confirmDialogListenerAdded) {
  eventBus.on('ui:confirm-demolish', (data) => {
    dialogData.value = {
      ...data,
      title: 'Confirm Demolish',
      message: `Are you sure you want to demolish <span class=\"text-[#ff4402] font-bold\"> ${data.buildingType || 'building'} </span>? This action cannot be undone!`,
      confirmText: 'CONFIRM',
      cancelText: 'CANCEL',
    }
    showDialog.value = true
  })
  window.__confirmDialogListenerAdded = true
}

function handleConfirm() {
  eventBus.emit('ui:demolish-confirmed', dialogData.value)
  showDialog.value = false
}
function handleCancel() {
  showDialog.value = false
}
</script>

<template>
  <div>
    <TopBar />
    <div class="flex gap-2 px-2 h-[calc(100vh-200px)]">
      <BuildingSidebar />
      <main class="flex-1 industrial-panel shadow-industrial relative overflow-hidden industrial-grid">
        <ModeIndicator />
        <SelectedIndicator />
        <BuildingDetails />
      </main>
    </div>
    <DashboardFooter />
    <ToastContainer />
    <ConfirmDialog
      :show="showDialog"
      :title="dialogData.title"
      :message="dialogData.message"
      :confirm-text="dialogData.confirmText"
      :cancel-text="dialogData.cancelText"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
  <GameCanvas />
</template>
