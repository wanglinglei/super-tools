<template>
  <section>
    <!-- 分类标题 -->
    <div class="flex items-center mb-6">
      <div 
        class="w-1 h-8 rounded mr-3"
        :class="accentColorClass"
      ></div>
      <h2 class="text-2xl font-bold text-gray-800">{{ title }}</h2>
    </div>

    <!-- 工具卡片网格 -->
    <div class="tool-grid grid gap-6">
      <slot></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  /** 分类标题，如 "📝 编辑器工具" */
  title: string;
  /** 左侧装饰条颜色，如 "blue" | "green" | "yellow" | "purple" */
  accentColor?: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'pink' | 'indigo';
}

const props = withDefaults(defineProps<Props>(), {
  accentColor: 'blue',
});

// 根据颜色生成对应的 Tailwind CSS 类
const accentColorClass = computed(() => {
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500',
  };
  return colorMap[props.accentColor] || 'bg-blue-500';
});
</script>

<style scoped>
.tool-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (min-width: 1651px) {
  .tool-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
