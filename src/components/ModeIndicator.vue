<script setup>
import { computed } from 'vue'
import { useGameState } from '../stores/useGameState'

const gameState = useGameState()
const modeLabel = computed(() => {
  switch (gameState.currentMode) {
    case 'build': return 'BUILD'
    case 'relocate': return 'RELOCATE'
    case 'demolish': return 'DEMOLISH'
    default: return gameState.currentMode?.toUpperCase() || 'UNKNOWN'
  }
})
</script>

<template>
  <div class="absolute top-4 left-4 resource-display rounded px-3 py-1">
    <span class="text-xs text-gray-400 uppercase tracking-wide">MODE:</span>
    <span class="text-sm font-bold text-industrial-accent ml-2">{{ modeLabel }}</span>
  </div>
</template>
