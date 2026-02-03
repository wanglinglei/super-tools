<template>
  <ToolLayout
    title="JSON 编辑器"
    icon="{ }"
    :content-padding="false"
    :content-scroll="false"
  >
    <!-- 左侧工具栏 -->
    <template #header-left>
      <ToolButton icon="repair" text="修复 JSON" @click="repairJson" />
      <ToolButton icon="check" text="校验 JSON" @click="validateJson" />
    </template>

    <!-- 右侧工具栏 -->
    <template #header-right>
      <ToolButton
        type="icon"
        icon="upload"
        title="上传 JSON 文件"
        @click="uploadFile"
      />
      <ToolButton
        type="icon"
        icon="download"
        title="保存 JSON 文件"
        @click="saveFile"
      />
      <ToolButton
        type="icon"
        icon="copy"
        title="复制数据"
        @click="copyContent"
      />
      <ToolButton
        type="icon"
        icon="trash"
        title="清空内容"
        @click="clearContent"
      />
    </template>

    <!-- 编辑器容器 -->
    <div class="w-full h-full">
      <div ref="editorRef" class="w-full h-full"></div>
    </div>

    <!-- 隐藏的文件上传 input -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".json,application/json"
      class="hidden"
      @change="handleFileUpload"
    />
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from "vue";
import * as ace from "ace-builds";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import { downloadFile, copyToClipboard } from "@/utils";
import type { MessageType } from "@/composables/useMessage";

// 编辑器引用
const editorRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
let editor: ace.Ace.Editor | null = null;

// 从布局组件注入 showMessage
const showMessage =
  inject<(text: string, type?: MessageType) => void>("showMessage")!;

// 初始化编辑器
const initEditor = () => {
  if (!editorRef.value) return;

  editor = ace.edit(editorRef.value, {
    mode: "ace/mode/json",
    theme: "ace/theme/github",
    fontSize: 14,
    tabSize: 2,
    useSoftTabs: true,
    showPrintMargin: false,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    wrap: true,
  });

  // 设置初始内容
  const initialContent = JSON.stringify(
    {
      array: [1, 2, 3],
      boolean: true,
      null: null,
      number: 123,
      object: {
        a: "b",
        c: "d",
      },
      time: Date.now(),
      string: "Hello World",
    },
    null,
    2
  );
  editor.setValue(initialContent, -1);
};

// 修复 JSON
const repairJson = () => {
  if (!editor) return;

  const content = editor.getValue().trim();
  if (!content) {
    showMessage("内容为空", "error");
    return;
  }

  try {
    // 尝试修复常见的 JSON 错误
    let fixed = content;

    // 1. 移除尾部逗号
    fixed = fixed.replace(/,\s*([}\]])/g, "$1");

    // 2. 给没有引号的键添加引号
    fixed = fixed.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

    // 3. 将单引号替换为双引号
    fixed = fixed.replace(/'/g, '"');

    // 4. 修复 undefined 为 null
    fixed = fixed.replace(/:\s*undefined/g, ": null");

    // 5. 尝试解析验证
    const parsed = JSON.parse(fixed);
    const formatted = JSON.stringify(parsed, null, 2);
    editor.setValue(formatted, -1);
    showMessage("JSON 修复并格式化成功", "success");
  } catch (e) {
    showMessage(`修复失败: ${(e as Error).message}`, "error");
  }
};

// 校验 JSON
const validateJson = () => {
  if (!editor) return;

  const content = editor.getValue().trim();
  if (!content) {
    showMessage("内容为空", "error");
    return;
  }

  try {
    JSON.parse(content);
    showMessage("JSON 格式正确", "success");
  } catch (e) {
    const error = e as SyntaxError;
    showMessage(`JSON 格式错误: ${error.message}`, "error");
  }
};

// 上传文件
const uploadFile = () => {
  fileInputRef.value?.click();
};

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    if (editor) {
      try {
        // 尝试格式化
        const parsed = JSON.parse(content);
        editor.setValue(JSON.stringify(parsed, null, 2), -1);
        showMessage("文件上传成功", "success");
      } catch {
        // 如果解析失败，直接设置内容
        editor.setValue(content, -1);
        showMessage("文件已加载（JSON 格式可能有误）", "error");
      }
    }
  };
  reader.onerror = () => {
    showMessage("文件读取失败", "error");
  };
  reader.readAsText(file);

  // 重置 input 以便可以再次选择同一文件
  target.value = "";
};

// 保存文件
const saveFile = () => {
  if (!editor) return;

  const content = editor.getValue();
  if (!content.trim()) {
    showMessage("内容为空，无法保存", "error");
    return;
  }

  try {
    // 使用统一的 downloadFile 方法，自动识别文本类型
    downloadFile(content, {
      filename: "data.json",
      addTimestamp: true,
    });
    showMessage("文件已保存", "success");
  } catch (error) {
    showMessage((error as Error).message, "error");
  }
};

// 复制内容
const copyContent = async () => {
  if (!editor) return;

  const content = editor.getValue();
  if (!content.trim()) {
    showMessage("内容为空", "error");
    return;
  }

  const success = await copyToClipboard(content);
  if (success) {
    showMessage("已复制到剪贴板", "success");
  } else {
    showMessage("复制失败", "error");
  }
};

// 清空内容
const clearContent = () => {
  if (!editor) return;
  editor.setValue("", -1);
  showMessage("内容已清空", "success");
};

onMounted(() => {
  initEditor();
});

onUnmounted(() => {
  if (editor) {
    editor.destroy();
    editor = null;
  }
});
</script>

<style scoped>
/* Ace 编辑器样式覆盖 */
:deep(.ace_editor) {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas", monospace !important;
}

:deep(.ace_gutter) {
  background: #f5f5f5 !important;
  color: #999 !important;
}

:deep(.ace_gutter-active-line) {
  background: #e8e8e8 !important;
}
</style>
