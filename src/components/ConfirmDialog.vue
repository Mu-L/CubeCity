<script setup>
defineProps({
  show: Boolean,
  title: {
    type: String,
    default: '确认操作',
  },
  message: {
    type: String,
    default: '',
  },
  confirmText: {
    type: String,
    default: '确认',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
})
const emits = defineEmits(['confirm', 'cancel'])

function onConfirm() {
  emits('confirm')
}
function onCancel() {
  emits('cancel')
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="relative bg-[#181c24] rounded-sm shadow-lg px-6 py-8 min-w-[320px] max-w-[90vw] w-[580px] border border-[#23272f]">
      <!-- 标题 -->
      <h2 class="text-center text-[2rem] font-bold  tracking-widest uppercase mb-1 text-glow-orange select-none">
        {{ title }}
      </h2>
      <!-- 分割线 -->
      <div class="h-[2px] w-full bg-[#27333e] mb-4" />
      <!-- 警告图标 -->
      <div class="flex justify-center mb-4">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <polygon points="32,8 60,56 4,56" stroke="#fff" stroke-width="3.5" fill="none" />
          <rect x="29.5" y="26" width="5" height="16" rx="2.5" fill="#fff" />
          <rect x="29.5" y="46" width="5" height="5" rx="2.5" fill="#fff" />
        </svg>
      </div>
      <!-- 提示语 -->
      <p class="text-center text-gray-200  text-xl mb-4 whitespace-pre-line">
        <slot v-if="$slots.default" />
        <span v-else v-html="message" />
      </p>
      <!-- 按钮区 -->
      <div class="flex justify-center gap-4">
        <button
          class="w-36 py-2  text-lg font-bold rounded bg-[#2c3440] text-gray-200 border-2 border-[#23272f] hover:bg-[#23272f] hover:text-white transition uppercase tracking-wider shadow-md"
          @click="onConfirm"
        >
          {{ confirmText }}
        </button>
        <button
          class="w-36 py-2  text-lg font-bold rounded bg-[#ff4402] text-white border-2 border-[#ff4402] hover:bg-white hover:text-[#ff4402] transition uppercase tracking-wider shadow-md"
          @click="onCancel"
        >
          {{ cancelText }}
        </button>
      </div>
      <!-- 发光边框 -->
      <div class="pointer-events-none absolute inset-0 rounded-lg border-2 border-[#ff4402] animate-glow" />
    </div>
  </div>
</template>

<style scoped>
/* 标题橙红色发光 */
.text-glow-orange {
  color: #ff4402;
  text-shadow: 0 0 8px #ff4402, 0 0 24px #ff4402, 0 0 40px #ff4402;
}
/* 边框发光动画 */
.animate-glow {
  box-shadow: 0 0 12px #ff4402, 0 0 32px #ff4402;
  animation: glow 1.5s infinite alternate;
}
@keyframes glow {
  from { box-shadow: 0 0 8px #ff4402, 0 0 16px #ff4402; }
  to   { box-shadow: 0 0 24px #ff4402, 0 0 48px #ff4402; }
}
</style>
