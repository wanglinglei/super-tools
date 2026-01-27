<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- 顶部工具栏 -->
    <div class="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
      <!-- 左侧按钮组 -->
      <div class="flex gap-2 items-center">
        <!-- 格式快捷按钮 -->
        <div class="flex gap-1 items-center px-2 py-1 bg-gray-50 rounded-md border border-gray-200">
          <button
            class="format-icon-btn"
            title="加粗 (Ctrl+B)"
            @click="applyFormat('bold')"
          >
            <FormatSvg name="bold" />
          </button>
          <button
            class="format-icon-btn"
            title="斜体 (Ctrl+I)"
            @click="applyFormat('italic')"
          >
            <FormatSvg name="italic" />
          </button>
          <button
            class="format-icon-btn"
            title="标题"
            @click="applyFormat('heading')"
          >
            <FormatSvg name="heading" />
          </button>
          <div class="w-px h-4 bg-gray-300 mx-1"></div>
          <button
            class="format-icon-btn"
            title="引用"
            @click="applyFormat('quote')"
          >
            <FormatSvg name="quote" />
          </button>
          <button
            class="format-icon-btn"
            title="代码"
            @click="applyFormat('code')"
          >
            <FormatSvg name="code" />
          </button>
          <div class="w-px h-4 bg-gray-300 mx-1"></div>
          <button
            class="format-icon-btn"
            title="无序列表"
            @click="applyFormat('list')"
          >
            <FormatSvg name="list" />
          </button>
          <button
            class="format-icon-btn"
            title="有序列表"
            @click="applyFormat('orderedList')"
          >
            <FormatSvg name="orderedList" />
          </button>
          <div class="w-px h-4 bg-gray-300 mx-1"></div>
          <button
            class="format-icon-btn"
            title="链接"
            @click="applyFormat('link')"
          >
            <FormatSvg name="link" />
          </button>
          <button
            class="format-icon-btn"
            title="图片"
            @click="applyFormat('image')"
          >
            <FormatSvg name="image" />
          </button>
          <button
            class="format-icon-btn"
            title="表格"
            @click="applyFormat('table')"
          >
            <FormatSvg name="table" />
          </button>
        </div>

        <div class="w-px h-6 bg-gray-300"></div>

        <button
          class="tool-btn"
          @click="formatMarkdown"
        >
          <SvgIcon name="format" size="16px" class-name="mr-1.5" />
          格式化
        </button>
        <button
          class="tool-btn"
          :class="{ 'active': showMode === 'split' }"
          @click="toggleMode('split')"
        >
          <SvgIcon name="split" size="16px" class-name="mr-1.5" />
          分屏
        </button>
        <button
          class="tool-btn"
          :class="{ 'active': showMode === 'preview' }"
          @click="toggleMode('preview')"
        >
          <SvgIcon name="eye" size="16px" class-name="mr-1.5" />
          预览
        </button>
      </div>

      <!-- 右侧按钮组 -->
      <div class="flex gap-2">
        <button
          class="tool-btn-icon"
          title="上传 Markdown 文件"
          @click="uploadFile"
        >
          <SvgIcon name="upload" size="20px" />
        </button>
        <button
          class="tool-btn-icon"
          title="保存 Markdown 文件"
          @click="saveFile"
        >
          <SvgIcon name="download" size="20px" />
        </button>
        <button
          class="tool-btn-icon"
          title="复制内容"
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

    <!-- 编辑器和预览区域 -->
    <div class="flex-1 overflow-hidden flex">
      <!-- 编辑器区域 -->
      <div 
        v-show="showMode === 'edit' || showMode === 'split'"
        :class="showMode === 'split' ? 'w-1/2' : 'w-full'"
        class="border-r border-gray-200"
      >
        <div ref="editorRef" class="w-full h-full"></div>
      </div>

      <!-- 预览区域 -->
      <div 
        v-show="showMode === 'preview' || showMode === 'split'"
        :class="showMode === 'split' ? 'w-1/2' : 'w-full'"
        class="overflow-auto bg-white"
      >
        <div 
          class="markdown-preview p-6"
          v-html="renderedHtml"
        ></div>
      </div>
    </div>

    <!-- 隐藏的文件上传 input -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".md,.markdown,text/markdown"
      class="hidden"
      @change="handleFileUpload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, computed } from 'vue';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import { marked } from 'marked';
import SvgIcon from '@/components/svgIcon/SvgIcon.vue'; 
import FormatSvg from './components/formatSvg.vue';

// 编辑器引用
const editorRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
let editor: ace.Ace.Editor | null = null;

// 显示模式：edit（仅编辑）、preview（仅预览）、split（分屏）
const showMode = ref<'edit' | 'preview' | 'split'>('edit');

// Markdown 内容
const markdownContent = ref('');

// 消息提示
const message = reactive({
  show: false,
  text: '',
  type: 'success' as 'success' | 'error',
});

let messageTimer: ReturnType<typeof setTimeout> | null = null;

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
});

// 渲染后的 HTML
const renderedHtml = computed(() => {
  try {
    return marked(markdownContent.value) as string;
  } catch (e) {
    return `<p class="text-red-500">Markdown 解析错误: ${(e as Error).message}</p>`;
  }
});

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
    mode: 'ace/mode/markdown',
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
  const initialContent = `# Markdown 编辑器

## 欢迎使用

这是一个功能强大的 Markdown 编辑器，支持：

- **实时预览**
- *语法高亮*
- ~~删除线~~
- \`代码高亮\`

### 代码块示例

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

### 表格示例

| 功能 | 描述 |
|------|------|
| 编辑 | 实时编辑 Markdown |
| 预览 | 查看渲染效果 |
| 分屏 | 同时编辑和预览 |

### 引用

> 这是一段引用文字

### 链接和图片

[GitHub](https://github.com)

---

**开始编辑你的 Markdown 吧！**
`;

  editor.setValue(initialContent, -1);
  markdownContent.value = initialContent;

  // 监听内容变化
  if (editor) {
    editor.on('change', () => {
      markdownContent.value = editor?.getValue() || '';
    });
  }
};

// 应用 Markdown 格式
const applyFormat = (format: string) => {
  if (!editor) return;

  const selection = editor.getSelectedText();
  const range = editor.getSelectionRange();

  let replacement = '';
  let cursorOffset = 0;

  switch (format) {
    case 'bold':
      if (selection) {
        replacement = `**${selection}**`;
        cursorOffset = 2;
      } else {
        replacement = '****';
        cursorOffset = 2;
      }
      break;

    case 'italic':
      if (selection) {
        replacement = `*${selection}*`;
        cursorOffset = 1;
      } else {
        replacement = '**';
        cursorOffset = 1;
      }
      break;

    case 'heading':
      if (selection) {
        replacement = `## ${selection}`;
        cursorOffset = 3;
      } else {
        replacement = '## ';
        cursorOffset = 3;
      }
      break;

    case 'quote':
      if (selection) {
        replacement = `> ${selection}`;
        cursorOffset = 2;
      } else {
        replacement = '> ';
        cursorOffset = 2;
      }
      break;

    case 'code':
      if (selection) {
        replacement = `\`${selection}\``;
        cursorOffset = 1;
      } else {
        replacement = '``';
        cursorOffset = 1;
      }
      break;

    case 'list':
      if (selection) {
        replacement = `- ${selection}`;
        cursorOffset = 2;
      } else {
        replacement = '- ';
        cursorOffset = 2;
      }
      break;

    case 'orderedList':
      if (selection) {
        replacement = `1. ${selection}`;
        cursorOffset = 3;
      } else {
        replacement = '1. ';
        cursorOffset = 3;
      }
      break;

    case 'link':
      if (selection) {
        replacement = `[${selection}](url)`;
        // 光标移动到 url 位置
        editor.session.replace(range, replacement);
        const newPos = {
          row: range.start.row,
          column: range.start.column + selection.length + 3,
        };
        editor.selection.setRange({
          start: newPos,
          end: { row: newPos.row, column: newPos.column + 3 },
        });
        editor.focus();
        return;
      } else {
        replacement = '[](url)';
        cursorOffset = 1;
      }
      break;

    case 'image':
      if (selection) {
        replacement = `![${selection}](url)`;
        // 光标移动到 url 位置
        editor.session.replace(range, replacement);
        const newPos = {
          row: range.start.row,
          column: range.start.column + selection.length + 4,
        };
        editor.selection.setRange({
          start: newPos,
          end: { row: newPos.row, column: newPos.column + 3 },
        });
        editor.focus();
        return;
      } else {
        replacement = '![](url)';
        cursorOffset = 2;
      }
      break;

    case 'table':
      replacement = `| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容 | 内容 | 内容 |
| 内容 | 内容 | 内容 |`;
      cursorOffset = 0;
      break;

    default:
      return;
  }

  // 替换选中内容或插入格式
  editor.session.replace(range, replacement);

  // 如果没有选中内容，将光标移动到合适位置
  if (!selection && cursorOffset > 0) {
    const newPos = {
      row: range.start.row,
      column: range.start.column + cursorOffset,
    };
    editor.selection.setRange({
      start: newPos,
      end: newPos,
    });
  }

  editor.focus();
};

// 切换显示模式
const toggleMode = (mode: 'edit' | 'preview' | 'split') => {
  // 如果点击的是当前已激活的模式，则切换回编辑模式
  if (showMode.value === mode) {
    showMode.value = 'edit';
  } else {
    showMode.value = mode;
  }
};

// 格式化 Markdown（简单实现：整理空行）
const formatMarkdown = () => {
  if (!editor) return;

  const content = editor.getValue();
  if (!content.trim()) {
    showMessage('内容为空', 'error');
    return;
  }

  // 简单的格式化：移除多余空行，保持最多一个空行
  const formatted = content
    .split('\n')
    .reduce((acc: string[], line: string, index: number, arr: string[]) => {
      // 如果当前行不为空，或者前一行不为空，则保留
      if (line.trim() || (index > 0 && arr[index - 1]?.trim())) {
        acc.push(line);
      } else if (index === 0 || acc[acc.length - 1] !== '') {
        // 保留第一个空行
        acc.push('');
      }
      return acc;
    }, [])
    .join('\n')
    .trim();

  editor.setValue(formatted, -1);
  showMessage('格式化成功', 'success');
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
      editor.setValue(content, -1);
      markdownContent.value = content;
      showMessage('文件上传成功', 'success');
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

  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `document-${Date.now()}.md`;
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
  markdownContent.value = '';
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

.tool-btn.active {
  @apply bg-blue-50 border-blue-400 text-blue-700;
}

.tool-btn-icon {
  @apply flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-md text-gray-600;
  @apply hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 transition-all cursor-pointer;
  @apply active:bg-gray-100;
}

.tool-btn-icon:hover {
  color: #1f2937;
}

.format-icon-btn {
  @apply flex items-center justify-center w-7 h-7 rounded text-gray-600;
  @apply hover:bg-gray-200 hover:text-gray-900 transition-all cursor-pointer;
  @apply active:bg-gray-300;
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

/* Markdown 预览样式 */
.markdown-preview {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.markdown-preview :deep(h1) {
  font-size: 2em;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.markdown-preview :deep(h2) {
  font-size: 1.5em;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.markdown-preview :deep(h3) {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 20px;
  margin-bottom: 12px;
}

.markdown-preview :deep(h4),
.markdown-preview :deep(h5),
.markdown-preview :deep(h6) {
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 12px;
}

.markdown-preview :deep(p) {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  margin-top: 0;
  margin-bottom: 16px;
  padding-left: 2em;
}

.markdown-preview :deep(li) {
  margin-bottom: 4px;
}

.markdown-preview :deep(code) {
  background-color: #f3f4f6;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 0.9em;
}

.markdown-preview :deep(pre) {
  background-color: #f3f4f6;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.markdown-preview :deep(pre code) {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
}

.markdown-preview :deep(blockquote) {
  border-left: 4px solid #d1d5db;
  padding-left: 16px;
  margin: 16px 0;
  color: #6b7280;
}

.markdown-preview :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
}

.markdown-preview :deep(th),
.markdown-preview :deep(td) {
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  text-align: left;
}

.markdown-preview :deep(th) {
  background-color: #f3f4f6;
  font-weight: 600;
}

.markdown-preview :deep(a) {
  color: #3b82f6;
  text-decoration: none;
}

.markdown-preview :deep(a:hover) {
  text-decoration: underline;
}

.markdown-preview :deep(img) {
  max-width: 100%;
  height: auto;
}

.markdown-preview :deep(hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 24px 0;
}

.markdown-preview :deep(strong) {
  font-weight: 600;
}

.markdown-preview :deep(em) {
  font-style: italic;
}

.markdown-preview :deep(del) {
  text-decoration: line-through;
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
