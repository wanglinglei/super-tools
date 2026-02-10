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
        class="flex gap-1 items-center px-2 py-1 bg-gray-50 rounded-md border border-gray-200 mr-2"
      >
        <ToolButton
          type="icon"
          icon="undo"
          title="撤销 (Ctrl+Z)"
          :disabled="!historyStatus.canUndo"
          @click="handleUndo"
        />
        <ToolButton
          type="icon"
          icon="redo"
          title="重做 (Ctrl+Y)"
          :disabled="!historyStatus.canRedo"
          @click="handleRedo"
        />
      </div>

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
      <ToolButton
        type="icon"
        icon="upload"
        title="打开文件"
        @click="handleImportJson"
      />
      <ToolButton
        type="icon"
        icon="save"
        title="保存文件"
        @click="handleExportJson"
      />
      <div class="w-px h-6 bg-gray-300 mx-1"></div>
      <ToolButton icon="download" text="导出 SVG" @click="handleExportSvg" />
      <ToolButton icon="download" text="导出 PNG" @click="handleExportPng" />
      <ToolButton icon="trash" text="清空" @click="handleClear" />
      <ToolButton text="重置示例" @click="handleReset" />
    </template>

    <!-- 隐藏的文件上传 input -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".json"
      class="hidden"
      @change="onFileSelected"
    />

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
const fileInputRef = ref<HTMLInputElement | null>(null);

// 历史记录状态
const historyStatus = ref({ canUndo: false, canRedo: false });

// 监听历史记录状态变化
const updateHistoryStatus = () => {
  if (canvasRef.value) {
    historyStatus.value = canvasRef.value.getHistoryStatus();
  }
};

// 监听键盘事件
const onKeyDown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "z") {
    e.preventDefault();
    if (e.shiftKey) {
      handleRedo();
    } else {
      handleUndo();
    }
  } else if ((e.metaKey || e.ctrlKey) && e.key === "y") {
    e.preventDefault();
    handleRedo();
  }
};

// 在组件挂载后添加事件监听
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  document.addEventListener("keydown", onKeyDown);
  // 定期检查历史记录状态（因为 canvas 内部状态变化不会自动触发父组件更新）
  // 更好的做法是在 canvas 组件 emit 事件，这里简化处理
  const timer = setInterval(updateHistoryStatus, 100);
  onUnmounted(() => {
    clearInterval(timer);
    document.removeEventListener("keydown", onKeyDown);
  });
});

/**
 * 撤销
 */
function handleUndo() {
  canvasRef.value?.undo();
  updateHistoryStatus();
}

/**
 * 重做
 */
function handleRedo() {
  canvasRef.value?.redo();
  updateHistoryStatus();
}

/**
 * 添加节点
 */
function addNode(type: NodeType) {
  canvasRef.value?.addNode(type);
  updateHistoryStatus();
}

/**
 * 导出 JSON
 */
function handleExportJson() {
  const data = canvasRef.value?.exportJson();
  if (!data) return;

  try {
    downloadFile(data, {
      filename: "flowchart.json",
      addTimestamp: true,
    });
    showMessage("保存成功", "success");
  } catch (error) {
    showMessage((error as Error).message, "error");
  }
}

/**
 * 导入 JSON
 */
function handleImportJson() {
  fileInputRef.value?.click();
}

/**
 * 处理文件选择
 */
function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target?.result as string);
      canvasRef.value?.importJson(json);
      showMessage("打开成功", "success");
      updateHistoryStatus();
    } catch (error) {
      showMessage("文件格式错误", "error");
    }
  };
  reader.readAsText(file);
  target.value = "";
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
  updateHistoryStatus();
}

/**
 * 重置为示例
 */
function handleReset() {
  canvasRef.value?.reset();
  showMessage("已重置为示例");
  updateHistoryStatus();
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
