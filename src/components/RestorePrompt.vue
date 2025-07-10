<script setup>
import { useGameState } from '@/stores/useGameState.js'
import { onMounted, ref } from 'vue'

const show = ref(false)
const STORAGE_KEY = 'gameState' // pinia 默认以 store.$id 作为 key
const RECENTLY_REJECTED_KEY = 'recentlyRejected'
const REJECTED_DURATION = 3000 // ms

onMounted(() => {
  const rejectedAt = localStorage.getItem(RECENTLY_REJECTED_KEY)
  const now = Date.now()
  if (rejectedAt && now - Number(rejectedAt) < REJECTED_DURATION) {
    show.value = false
    return
  }
  // 检查 localStorage 是否有存档
  if (localStorage.getItem(STORAGE_KEY)) {
    show.value = true
  }
})

function onAccept() {
  // 什么都不用做，pinia 会自动恢复
  show.value = false
}

function onReject() {
  // 清空存档并重置
  localStorage.removeItem(STORAGE_KEY)
  useGameState().resetAll()
  localStorage.setItem(RECENTLY_REJECTED_KEY, Date.now().toString())
  window.location.reload()
  show.value = false
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-industrial-panel bg-black bg-opacity-70 rounded-xl shadow-industrial p-6 w-[90vw] max-w-sm mx-auto text-center">
      <h3 class="text-xl font-bold text-industrial-accent uppercase tracking-wide mb-2">
        Continue Last Game?
      </h3>
      <p class="text-lg text-gray-400 mb-6">
        Previous game save detected. Would you like to continue?
      </p>
      <div class="flex flex-col gap-3">
        <button class="industrial-button w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide" @click="onAccept">
          Yes, Continue Last Game
        </button>
        <button class="industrial-button w-full text-white font-bold py-3 px-4 text-sm uppercase tracking-wide bg-industrial-red hover:bg-red-700" @click="onReject">
          No, Start New Game
        </button>
      </div>
    </div>
  </div>
</template>

<!-- tailwindcss 风格，无需 scoped -->
