<template>
  <div
    class="coming-soon-card relative bg-white rounded-xl p-6 shadow-md border-2 border-dashed border-gray-300 opacity-75 hover:opacity-100 transition-all duration-300"
  >
    <!-- 工具图标 -->
    <div class="icon-wrapper mb-4 w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl font-bold text-gray-400">
      {{ icon }}
    </div>

    <!-- 工具信息 -->
    <div>
      <div class="flex items-center gap-2 mb-2">
        <h3 class="text-xl font-bold text-gray-700">
          {{ title }}
        </h3>
        <span class="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
          敬请期待
        </span>
      </div>
      <p class="text-sm text-gray-500 leading-relaxed">
        {{ description }}
      </p>
    </div>

    <!-- 建设中图标 -->
    <div class="absolute bottom-6 right-6 text-gray-300">
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
      </svg>
    </div>

    <!-- 装饰元素 -->
    <div class="absolute top-0 right-0 w-20 h-20 bg-gray-200 rounded-bl-full opacity-10"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  title: string;
  description: string;
}

defineProps<Props>();
</script>

<style scoped>
.coming-soon-card {
  min-height: 200px;
  cursor: not-allowed;
}
</style>
