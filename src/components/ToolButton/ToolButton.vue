<script setup lang="ts">
import SvgIcon from "@/components/svgIcon/SvgIcon.vue";

/**
 * 工具栏按钮组件
 * 提供统一的按钮样式
 */

interface Props {
  /** 按钮类型 */
  type?: "default" | "primary" | "danger" | "icon";
  /** 图标名称（使用 SvgIcon） */
  icon?: string;
  /** 按钮文本 */
  text?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 按钮提示文字 */
  title?: string;
}

withDefaults(defineProps<Props>(), {
  type: "default",
  icon: "",
  text: "",
  disabled: false,
  title: "",
});

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <button
    class="tool-btn"
    :class="[`tool-btn--${type}`, { 'tool-btn--disabled': disabled }]"
    :disabled="disabled"
    :title="title"
    @click="$emit('click', $event)"
  >
    <SvgIcon
      v-if="icon"
      :name="icon"
      size="16px"
      :class-name="text ? 'mr-1.5' : ''"
    />
    <span v-if="text">{{ text }}</span>
    <slot />
  </button>
</template>

<style scoped>
.tool-btn {
  @apply flex items-center justify-center rounded-md text-sm font-medium transition-all cursor-pointer;
}

/* 默认样式 */
.tool-btn--default {
  @apply px-3 py-2 bg-white border border-gray-300 text-gray-700;
  @apply hover:bg-gray-50 hover:border-gray-400;
  @apply active:bg-gray-100;
}

/* 主要按钮 */
.tool-btn--primary {
  @apply px-3 py-2 bg-blue-500 border border-blue-500 text-white;
  @apply hover:bg-blue-600 hover:border-blue-600;
  @apply active:bg-blue-700;
}

/* 危险按钮 */
.tool-btn--danger {
  @apply px-3 py-2 bg-red-500 border border-red-500 text-white;
  @apply hover:bg-red-600 hover:border-red-600;
  @apply active:bg-red-700;
}

/* 图标按钮 */
.tool-btn--icon {
  @apply w-10 h-10 bg-white border border-gray-300 text-gray-600;
  @apply hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800;
  @apply active:bg-gray-100;
}

/* 禁用状态 */
.tool-btn--disabled {
  @apply opacity-50 cursor-not-allowed;
}

.tool-btn--disabled:hover {
  @apply bg-white border-gray-300;
}
</style>
