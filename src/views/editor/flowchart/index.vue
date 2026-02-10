<template>
  <ToolLayout
    title="流程图编辑器"
    icon="💠"
    :content-padding="false"
    :content-scroll="false"
  >
    <!-- 左侧工具栏：节点类型 -->
    <template #header-left>
      <div
        class="flex gap-1 items-center px-2 py-1 bg-gray-50 rounded-md border border-gray-200"
      >
        <button
          v-for="config in NODE_TYPE_LIST"
          :key="config.type"
          class="node-type-btn"
          :title="`添加${config.label}节点`"
          @click="addNode(config.type)"
        >
          <span
            class="inline-block w-4 h-4 rounded-sm mr-1 border"
            :style="{
              backgroundColor: config.fillColor,
              borderColor: config.strokeColor,
            }"
          ></span>
          <span class="text-xs">{{ config.label }}</span>
        </button>
      </div>
    </template>

    <!-- 右侧工具栏：操作按钮 -->
    <template #header-right>
      <ToolButton icon="download" text="导出 SVG" @click="handleExportSvg" />
      <ToolButton icon="download" text="导出 PNG" @click="handleExportPng" />
      <ToolButton icon="trash" text="清空" @click="handleClear" />
      <ToolButton text="重置示例" @click="handleReset" />
    </template>

    <!-- 画布 -->
    <div class="w-full h-full">
      <FlowchartCanvas ref="canvasRef" />
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import FlowchartCanvas from "./components/FlowchartCanvas.vue";
import { NODE_TYPE_LIST } from "./constants";
import type { NodeType } from "./constants";
import type { MessageType } from "@/composables/useMessage";
import { downloadFile } from "@/utils";

// 从布局组件注入 showMessage
const showMessage =
  inject<(text: string, type?: MessageType) => void>("showMessage")!;

// 画布组件引用
const canvasRef = ref<InstanceType<typeof FlowchartCanvas> | null>(null);

/**
 * 添加节点
 */
function addNode(type: NodeType) {
  canvasRef.value?.addNode(type);
}

/**
 * 导出 SVG
 */
function handleExportSvg() {
  const svgStr = canvasRef.value?.exportSvg();
  if (!svgStr) {
    showMessage("画布为空，无法导出", "error");
    return;
  }

  try {
    downloadFile(svgStr, {
      filename: "flowchart.svg",
      addTimestamp: true,
    });
    showMessage("SVG 导出成功", "success");
  } catch (error) {
    showMessage((error as Error).message, "error");
  }
}

/**
 * 导出 PNG
 */
async function handleExportPng() {
  const dataUrl = await canvasRef.value?.exportPng();
  if (!dataUrl) {
    showMessage("画布为空，无法导出", "error");
    return;
  }

  try {
    downloadFile(dataUrl, {
      filename: "flowchart.png",
      addTimestamp: true,
    });
    showMessage("PNG 导出成功", "success");
  } catch (error) {
    showMessage((error as Error).message, "error");
  }
}

/**
 * 清空画布
 */
function handleClear() {
  canvasRef.value?.clearAll();
  showMessage("画布已清空");
}

/**
 * 重置为示例
 */
function handleReset() {
  canvasRef.value?.reset();
  showMessage("已重置为示例");
}
</script>

<style scoped>
.node-type-btn {
  @apply flex items-center px-2 py-1.5 rounded-md;
  @apply bg-transparent text-gray-600;
  @apply hover:bg-gray-200 hover:text-gray-800 transition-all cursor-pointer;
  @apply active:bg-gray-300;
}
</style>
