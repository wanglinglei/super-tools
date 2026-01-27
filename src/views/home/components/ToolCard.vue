<template>
  <div
    class="tool-card group relative bg-white rounded-xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-current"
    :class="cardColorClass"
    @click="navigateTo"
  >
    <!-- 工具图标 -->
    <div
      class="icon-wrapper mb-4 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold transition-transform duration-300 group-hover:scale-110"
      :class="iconBgClass"
    >
      {{ icon }}
    </div>

    <!-- 工具信息 -->
    <div>
      <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-current transition-colors">
        {{ title }}
      </h3>
      <p class="text-sm text-gray-600 leading-relaxed">
        {{ description }}
      </p>
    </div>

    <!-- 进入箭头 -->
    <div
      class="absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
      :class="arrowBgClass"
    >
      <svg
        class="w-4 h-4"
        :class="arrowColorClass"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </div>

    <!-- 装饰元素 -->
    <div
      class="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10 transition-opacity duration-300 group-hover:opacity-20"
      :class="decorBgClass"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

interface Props {
  icon: string;
  title: string;
  description: string;
  route: string;
  color?: 'blue' | 'indigo' | 'green' | 'purple' | 'pink' | 'yellow';
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
});

const router = useRouter();

const navigateTo = () => {
  router.push(props.route);
};

// 根据颜色生成不同的样式类
const cardColorClass = computed(() => {
  const colorMap = {
    blue: 'hover:text-blue-500',
    indigo: 'hover:text-indigo-500',
    green: 'hover:text-green-500',
    purple: 'hover:text-purple-500',
    pink: 'hover:text-pink-500',
    yellow: 'hover:text-yellow-500',
  };
  return colorMap[props.color];
});

const iconBgClass = computed(() => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    pink: 'bg-pink-50 text-pink-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };
  return colorMap[props.color];
});

const arrowBgClass = computed(() => {
  const colorMap = {
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    yellow: 'bg-yellow-500',
  };
  return colorMap[props.color];
});

const arrowColorClass = computed(() => {
  return 'text-white';
});

const decorBgClass = computed(() => {
  const colorMap = {
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    yellow: 'bg-yellow-500',
  };
  return colorMap[props.color];
});
</script>

<style scoped>
.tool-card {
  min-height: 200px;
}

.tool-card:hover {
  transform: translateY(-4px);
}
</style>
