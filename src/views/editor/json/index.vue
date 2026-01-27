<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- 顶部工具栏 -->
    <div class="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
      <!-- 左侧按钮组 -->
      <div class="flex gap-2">
        <button
          class="tool-btn"
          @click="repairJson"
        >
          <SvgIcon name="repair" size="16px" class-name="mr-1.5" />
          修复 JSON
        </button>
        <button
          class="tool-btn"
          @click="validateJson"
        >
          <SvgIcon name="check" size="16px" class-name="mr-1.5" />
          校验 JSON
        </button>
      </div>

      <!-- 右侧按钮组 -->
      <div class="flex gap-2">
        <button
          class="tool-btn-icon"
          title="上传 JSON 文件"
          @click="uploadFile"
        >
          <SvgIcon name="upload" size="20px" />
        </button>
        <button
          class="tool-btn-icon"
          title="保存 JSON 文件"
          @click="saveFile"
        >
          <SvgIcon name="download" size="20px" />
        </button>
        <button
          class="tool-btn-icon"
          title="复制数据"
          @click="copyContent"
        >
          <SvgIcon name="copy" size="20px" />
        </button>
        <button
          class="tool-btn-icon"
          title="清空内容"
          @click="clearContent"
        >
          <SvgIcon name="trash" size="20px" />
        </button>
      </div>
    </div>

    <!-- 消息提示 -->
    <Transition name="fade">
      <div
        v-if="message.show"
        class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
        :class="message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
      >
        {{ message.text }}
      </div>
    </Transition>

    <!-- 编辑器容器 -->
    <div class="flex-1 overflow-hidden">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import SvgIcon from '@/components/svgIcon/SvgIcon.vue';

// 编辑器引用
const editorRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
let editor: ace.Ace.Editor | null = null;

// 消息提示
const message = reactive({
  show: false,
  text: '',
  type: 'success' as 'success' | 'error',
});

let messageTimer: ReturnType<typeof setTimeout> | null = null;

// 显示消息
const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
  if (messageTimer) {
    clearTimeout(messageTimer);
  }
  message.text = text;
  message.type = type;
  message.show = true;
  messageTimer = setTimeout(() => {
    message.show = false;
  }, 2000);
};

// 初始化编辑器
const initEditor = () => {
  if (!editorRef.value) return;

  editor = ace.edit(editorRef.value, {
    mode: 'ace/mode/json',
    theme: 'ace/theme/github',
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
        a: 'b',
        c: 'd',
      },
      time: Date.now(),
      string: 'Hello World',
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
    showMessage('内容为空', 'error');
    return;
  }

  try {
    // 尝试修复常见的 JSON 错误
    let fixed = content;

    // 1. 移除尾部逗号
    fixed = fixed.replace(/,\s*([}\]])/g, '$1');

    // 2. 给没有引号的键添加引号
    fixed = fixed.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

    // 3. 将单引号替换为双引号
    fixed = fixed.replace(/'/g, '"');

    // 4. 修复 undefined 为 null
    fixed = fixed.replace(/:\s*undefined/g, ': null');

    // 5. 尝试解析验证
    const parsed = JSON.parse(fixed);
    const formatted = JSON.stringify(parsed, null, 2);
    editor.setValue(formatted, -1);
    showMessage('JSON 修复并格式化成功', 'success');
  } catch (e) {
    showMessage(`修复失败: ${(e as Error).message}`, 'error');
  }
};

// 校验 JSON
const validateJson = () => {
  if (!editor) return;

  const content = editor.getValue().trim();
  if (!content) {
    showMessage('内容为空', 'error');
    return;
  }

  try {
    JSON.parse(content);
    showMessage('JSON 格式正确', 'success');
  } catch (e) {
    const error = e as SyntaxError;
    showMessage(`JSON 格式错误: ${error.message}`, 'error');
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
        showMessage('文件上传成功', 'success');
      } catch {
        // 如果解析失败，直接设置内容
        editor.setValue(content, -1);
        showMessage('文件已加载（JSON 格式可能有误）', 'error');
      }
    }
  };
  reader.onerror = () => {
    showMessage('文件读取失败', 'error');
  };
  reader.readAsText(file);

  // 重置 input 以便可以再次选择同一文件
  target.value = '';
};

// 保存文件
const saveFile = () => {
  if (!editor) return;

  const content = editor.getValue();
  if (!content.trim()) {
    showMessage('内容为空，无法保存', 'error');
    return;
  }

  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `data-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showMessage('文件已保存', 'success');
};

// 复制内容
const copyContent = async () => {
  if (!editor) return;

  const content = editor.getValue();
  if (!content.trim()) {
    showMessage('内容为空', 'error');
    return;
  }

  try {
    await navigator.clipboard.writeText(content);
    showMessage('已复制到剪贴板', 'success');
  } catch {
    showMessage('复制失败', 'error');
  }
};

// 清空内容
const clearContent = () => {
  if (!editor) return;
  editor.setValue('', -1);
  showMessage('内容已清空', 'success');
};

onMounted(() => {
  initEditor();
});

onUnmounted(() => {
  if (editor) {
    editor.destroy();
    editor = null;
  }
  if (messageTimer) {
    clearTimeout(messageTimer);
  }
});
</script>

<style scoped>
.tool-btn {
  @apply flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 font-medium;
  @apply hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer;
  @apply active:bg-gray-100;
}

.tool-btn-icon {
  @apply flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-md text-gray-600;
  @apply hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 transition-all cursor-pointer;
  @apply active:bg-gray-100;
}

.tool-btn-icon:hover {
  color: #1f2937;
}

/* Ace 编辑器样式覆盖 */
:deep(.ace_editor) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace !important;
}

:deep(.ace_gutter) {
  background: #f5f5f5 !important;
  color: #999 !important;
}

:deep(.ace_gutter-active-line) {
  background: #e8e8e8 !important;
}

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
