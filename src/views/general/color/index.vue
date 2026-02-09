<template>
  <ToolLayout title="颜色转换工具" icon="🎨" :content-padding="false">
    <!-- 右侧工具栏 -->
    <template #header-right>
      <ToolButton icon="trash" text="重置" @click="resetColor" />
    </template>

    <!-- Tab 切换 (吸顶) -->
    <div class="sticky top-0 z-10">
      <TabBar v-model="activeTab" :tabs="mainTabs" />
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 p-4">
      <div class="max-w-7xl mx-auto space-y-4">
        <!-- ========== 颜色转换 Tab ========== -->
        <template v-if="activeTab === 'color'">
          <ColorPanel
            ref="colorPanelRef"
            v-model:color="pickerColor"
            v-model:alpha="alpha"
          />
        </template>

        <!-- ========== 渐变色 Tab ========== -->
        <template v-if="activeTab === 'gradient'">
          <GradientPanel ref="gradientPanelRef" :current-color="pickerColor" />
        </template>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import TabBar from "@/components/TabBar/TabBar.vue";
import ColorPanel from "./components/ColorPanel.vue";
import GradientPanel from "./components/GradientPanel.vue";
import { DEFAULT_COLOR, DEFAULT_ALPHA } from "./constants";
import type { MessageType } from "@/composables/useMessage";

// 从布局组件注入 showMessage
const showMessage =
  inject<(text: string, type?: MessageType) => void>("showMessage")!;

// Tab 切换
const activeTab = ref("color");
const mainTabs = [
  { key: "color", label: "🎨 颜色转换" },
  { key: "gradient", label: "🌈 渐变色" },
];

// 颜色选择器 (共享状态)
const pickerColor = ref(DEFAULT_COLOR.hex);
const alpha = ref(DEFAULT_ALPHA);

// 组件引用
const colorPanelRef = ref<InstanceType<typeof ColorPanel> | null>(null);
const gradientPanelRef = ref<InstanceType<typeof GradientPanel> | null>(null);

/**
 * 重置颜色
 */
function resetColor() {
  pickerColor.value = DEFAULT_COLOR.hex;
  alpha.value = DEFAULT_ALPHA;

  // 调用子组件的重置方法
  colorPanelRef.value?.reset();
  gradientPanelRef.value?.reset();

  showMessage("已重置");
}
</script>
