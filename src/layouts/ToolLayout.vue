<script setup lang="ts">
import { provide } from "vue";
import { useRouter } from "vue-router";
import MessageToast from "@/components/Message/MessageToast.vue";
import SvgIcon from "@/components/svgIcon/SvgIcon.vue";
import { useMessage } from "@/composables/useMessage";

/**
 * 工具页面布局组件
 * 提供统一的页面结构：顶部工具栏 + 消息提示 + 主内容区
 */

interface Props {
  /** 页面标题 */
  title?: string;
  /** 标题图标 (emoji) */
  icon?: string;
  /** 是否显示返回首页按钮 */
  showBack?: boolean;
  /** 主内容区是否需要 padding */
  contentPadding?: boolean;
  /** 主内容区是否允许滚动 */
  contentScroll?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  icon: "",
  showBack: true,
  contentPadding: true,
  contentScroll: true,
});

const router = useRouter();

// 消息提示 - 通过 provide 暴露给子组件
const { message, showMessage } = useMessage();

// 提供给子组件使用
provide("showMessage", showMessage);

// 返回首页
const goHome = () => {
  router.push("/");
};

// 暴露 showMessage 方法供外部调用
defineExpose({
  showMessage,
});
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- 顶部工具栏 -->
    <div
      class="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200 shadow-sm"
    >
      <!-- 左侧区域 -->
      <div class="flex items-center gap-3">
        <!-- 返回首页按钮 -->
        <button
          v-if="showBack"
          class="tool-btn-icon"
          title="返回首页"
          @click="goHome"
        >
          <SvgIcon name="home" size="20px" />
        </button>

        <!-- 标题 -->
        <div v-if="title || icon" class="flex items-center gap-2">
          <span v-if="icon" class="text-xl">{{ icon }}</span>
          <h1 v-if="title" class="text-base font-bold text-gray-800">
            {{ title }}
          </h1>
        </div>

        <!-- 左侧自定义内容 -->
        <slot name="header-left" />
      </div>

      <!-- 右侧区域 -->
      <div class="flex items-center gap-2">
        <slot name="header-right" />
      </div>
    </div>

    <!-- 消息提示 -->
    <MessageToast
      :visible="message.show"
      :text="message.text"
      :type="message.type"
    />

    <!-- 主内容区 -->
    <div
      class="flex-1"
      :class="{
        'overflow-auto': contentScroll,
        'overflow-hidden': !contentScroll,
        'p-4': contentPadding,
      }"
    >
      <slot />
    </div>

    <!-- 底部区域（可选） -->
    <slot name="footer" />
  </div>
</template>

<style scoped>
.tool-btn-icon {
  @apply flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-md text-gray-600;
  @apply hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 transition-all cursor-pointer;
  @apply active:bg-gray-100;
}
</style>
