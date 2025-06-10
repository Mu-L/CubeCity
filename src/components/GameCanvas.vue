<script setup>
import { onMounted, ref } from 'vue'
// 这里假设 Experience 类已支持单例模式
import Experience from '../js/experience.js'

const canvasRef = ref(null)

onMounted(() => {
  if (canvasRef.value) {
    // 初始化 Three.js Experience 实例
    window.experience = new Experience(canvasRef.value)
  }
})
</script>

<template>
  <div class="flex h-full text-color" style="background: radial-gradient(ellipse at center, #6990b8 0%, #3b5279 100%);">
    <canvas ref="canvasRef" class="z-[0] h-full w-full fixed top-0 left-0 right-0 bottom-0" />
    <div id="info-panel" class="absolute z-40 top-4 right-4 p-4 bg-white rounded-lg shadow-lg" />
  </div>
</template>
