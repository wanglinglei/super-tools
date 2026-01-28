<template>
  <Transition name="fade">
    <div
      v-if="visible"
      class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
      :class="typeClass"
    >
      {{ text }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  visible: boolean;
  text: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success',
});

const typeClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-500 text-white';
    case 'error':
      return 'bg-red-500 text-white';
    case 'warning':
      return 'bg-yellow-500 text-white';
    case 'info':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-green-500 text-white';
  }
});
</script>

<style scoped>
/* 消息动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
