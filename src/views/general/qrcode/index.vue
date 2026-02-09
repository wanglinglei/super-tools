<template>
  <ToolLayout title="二维码工具" icon="📱" :content-padding="false">
    <!-- 右侧工具栏 -->
    <template #header-right>
      <ToolButton
        v-if="activeTab === 'generate'"
        type="primary"
        icon="format"
        text="生成二维码"
        @click="handleGenerate"
      />
      <ToolButton
        v-if="activeTab === 'generate'"
        icon="download"
        text="下载"
        :disabled="!hasQrcodeData"
        @click="handleDownload"
      />
      <ToolButton icon="trash" text="清空" @click="clearAll" />
    </template>

    <!-- Tab 切换 -->
    <div class="sticky top-0 z-10">
      <TabBar v-model="activeTab" :tabs="tabs" />
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 p-4">
      <div class="max-w-6xl mx-auto">
        <!-- 生成模式 -->
        <QRCodeGenerator
          v-if="activeTab === 'generate'"
          ref="generatorRef"
          @update:dataUrl="updateDataUrl"
        />

        <!-- 解码模式 -->
        <QRCodeDecoder v-else-if="activeTab === 'decode'" ref="decoderRef" />
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import TabBar from "@/components/TabBar/TabBar.vue";
import type { Tab } from "@/components/TabBar/TabBar.vue";
import QRCodeGenerator from "./components/QRCodeGenerator.vue";
import QRCodeDecoder from "./components/QRCodeDecoder.vue";

// Tab 配置
const tabs: Tab[] = [
  { label: "生成二维码", value: "generate", icon: "📱" },
  { label: "解码二维码", value: "decode", icon: "🔍" },
];

// Tab 状态
const activeTab = ref<"generate" | "decode">("generate");

// 组件引用
const generatorRef = ref<InstanceType<typeof QRCodeGenerator> | null>(null);
const decoderRef = ref<InstanceType<typeof QRCodeDecoder> | null>(null);

// 二维码数据状态（用于控制下载按钮）
const hasQrcodeData = ref(false);

const updateDataUrl = (url: string) => {
  hasQrcodeData.value = !!url;
};

// 处理生成
const handleGenerate = () => {
  generatorRef.value?.generateQRCode();
};

// 处理下载
const handleDownload = () => {
  generatorRef.value?.downloadQRCode();
};

// 清空所有
const clearAll = () => {
  if (activeTab.value === "generate") {
    generatorRef.value?.clearAll();
    hasQrcodeData.value = false;
  } else {
    decoderRef.value?.clearDecode();
  }
};
</script>

<style scoped>
/* 自定义滑块样式 */
input[type="range"] {
  @apply h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-blue-500 rounded-full cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
  @apply w-4 h-4 bg-blue-500 rounded-full cursor-pointer border-0;
}
</style>
