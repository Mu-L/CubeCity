<script setup>
import BuildingDetails from './components/BuildingDetails.vue'
import BuildingSidebar from './components/BuildingSidebar.vue'
import DashboardFooter from './components/DashboardFooter.vue'
import GameCanvas from './components/GameCanvas.vue'
import ModeIndicator from './components/ModeIndicator.vue'
import SelectedIndicator from './components/SelectedIndicator.vue'
import ToastContainer from './components/ToastContainer.vue'
import TopBar from './components/TopBar.vue'
</script>

<template>
  <div>
    <TopBar />
    <div class="flex gap-2 px-2 h-[calc(100vh-200px)]">
      <BuildingSidebar />
      <main class="flex-1 industrial-panel shadow-industrial relative overflow-hidden industrial-grid">
        <GameCanvas />
        <ModeIndicator />
        <SelectedIndicator />
        <BuildingDetails />
      </main>
    </div>
    <DashboardFooter />
    <ToastContainer />
  </div>
</template>
