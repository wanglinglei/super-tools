<template>
  <ToolLayout title="Base64 编解码" icon="🔐" :content-padding="false">
    <!-- 左侧工具栏 -->
    <template #header-left>
      <ToolButton icon="check" text="编码" @click="handleEncode" />
      <ToolButton icon="format" text="解码" @click="handleDecode" />
      <ToolButton icon="copy" text="复制结果" @click="copyOutput" />
    </template>

    <!-- 右侧工具栏 -->
    <template #header-right>
      <ToolButton
        v-if="activeMode === 'image'"
        icon="upload"
        text="上传图片"
        @click="selectImage"
      />
      <ToolButton type="icon" icon="trash" title="清空所有" @click="clearAll" />
    </template>

    <!-- Tab 切换 -->
    <div class="sticky top-0 z-10">
      <TabBar v-model="activeMode" :tabs="modeTabs" />
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 p-4">
      <div class="max-w-7xl mx-auto space-y-3">
        <!-- 文本模式 -->
        <TextBase64 v-if="activeMode === 'text'" ref="textRef" />

        <!-- 图片模式 -->
        <ImageBase64 v-else-if="activeMode === 'image'" ref="imageRef" />

        <!-- Base64 知识卡片 -->
        <div class="card-p">
          <h2 class="text-title mb-3">💡 关于 Base64</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="(info, index) in BASE64_INFO"
              :key="index"
              class="bg-gray-50 rounded-lg p-3"
            >
              <div class="text-sm font-medium text-gray-800 mb-1">
                {{ info.title }}
              </div>
              <div class="text-xs text-gray-600">{{ info.content }}</div>
            </div>
          </div>
        </div>

        <!-- Base64 字符表 -->
        <div class="card-p">
          <h2 class="text-title mb-3">🔤 Base64 字符表</h2>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="(char, index) in BASE64_CHARS"
              :key="index"
              class="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded text-sm font-mono hover:bg-blue-100 hover:text-blue-700 transition-colors"
              :title="`索引: ${index}`"
            >
              {{ char }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import TabBar from "@/components/TabBar/TabBar.vue";
import TextBase64 from "./components/TextBase64.vue";
import ImageBase64 from "./components/ImageBase64.vue";
import { BASE64_INFO, BASE64_CHARS } from "./constants";

// 模式切换
const activeMode = ref<"text" | "image">("text");
const modeTabs = [
  { key: "text", label: "文本编解码" },
  { key: "image", label: "图片编解码" },
];

// 组件引用
const textRef = ref<InstanceType<typeof TextBase64> | null>(null);
const imageRef = ref<InstanceType<typeof ImageBase64> | null>(null);

/**
 * 处理编码
 */
const handleEncode = () => {
  if (activeMode.value === "text") {
    textRef.value?.handleEncode();
  } else {
    imageRef.value?.handleEncode();
  }
};

/**
 * 处理解码
 */
const handleDecode = () => {
  if (activeMode.value === "text") {
    textRef.value?.handleDecode();
  } else {
    imageRef.value?.handleDecode();
  }
};

/**
 * 复制输出结果
 */
const copyOutput = () => {
  if (activeMode.value === "text") {
    textRef.value?.copyOutput();
  } else {
    imageRef.value?.copyOutput();
  }
};

/**
 * 选择图片
 */
const selectImage = () => {
  imageRef.value?.selectImage();
};

/**
 * 清空所有
 */
const clearAll = () => {
  if (activeMode.value === "text") {
    textRef.value?.clearAll();
  } else {
    imageRef.value?.clearAll();
  }
};
</script>
