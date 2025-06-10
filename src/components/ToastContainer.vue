<script setup>
import { computed } from 'vue'
import { useGameState } from '../stores/useGameState'

const gameState = useGameState()
const toastQueue = computed(() => gameState.toastQueue)
function toastClass(type) {
  switch (type) {
    case 'success': return 'bg-industrial-green text-white'
    case 'error': return 'bg-industrial-red text-white'
    case 'warning': return 'bg-industrial-yellow text-black'
    case 'info': return 'bg-industrial-blue text-white'
    default: return 'bg-industrial-blue text-white'
  }
}
function removeToast(id) {
  gameState.removeToast(id)
}
</script>

<template>
  <div class="fixed top-20 right-4 space-y-2 z-50">
    <transition-group name="toast-fade" tag="div">
      <div
        v-for="toast in toastQueue" :key="toast.id"
        :class="`${toastClass(toast.type)} px-4 py-2 rounded shadow-industrial transform transition-all duration-300 font-bold text-xs uppercase tracking-wide`"
        @click="removeToast(toast.id)"
      >
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.toast-fade-enter-to, .toast-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
