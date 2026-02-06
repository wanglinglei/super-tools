<template>
  <ToolLayout title="文本 Diff" icon="📄">
    <!-- 左侧工具栏 -->
    <template #header-left>
      <ToolButton icon="check" text="对比" @click="runDiff" />
      <ToolButton icon="copy" text="复制结果" @click="copyDiffResult" />
      <ToolButton icon="split" text="交换" @click="swapTexts" />
    </template>

    <!-- 右侧工具栏 -->
    <template #header-right>
      <ToolButton type="icon" icon="trash" title="清空所有" @click="clearAll" />
    </template>

    <!-- 主内容区 -->
    <div class="flex-1 overflow-auto p-4">
      <div class="max-w-7xl mx-auto space-y-3">
        <!-- 输入区 - 左右布局 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <!-- 原始文本 -->
          <div class="card-p">
            <div class="flex-between mb-3">
              <h2 class="text-title">📄 原始文本</h2>
              <span class="text-hint">{{ lineCount(oldText) }} 行</span>
            </div>
            <textarea
              v-model="oldText"
              placeholder="输入原始文本..."
              class="textarea-base font-mono"
              rows="10"
            ></textarea>
          </div>

          <!-- 修改文本 -->
          <div class="card-p">
            <div class="flex-between mb-3">
              <h2 class="text-title">📝 修改文本</h2>
              <span class="text-hint">{{ lineCount(newText) }} 行</span>
            </div>
            <textarea
              v-model="newText"
              placeholder="输入修改后的文本..."
              class="textarea-base font-mono"
              rows="10"
            ></textarea>
          </div>
        </div>

        <!-- 对比选项 -->
        <div class="card-p">
          <div class="flex items-center gap-6 flex-wrap">
            <h2 class="text-title">⚙️ 对比选项</h2>
            <label class="inline-flex items-center cursor-pointer">
              <input
                v-model="ignoreWhitespace"
                type="checkbox"
                class="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700">忽略首尾空白</span>
            </label>
            <label class="inline-flex items-center cursor-pointer">
              <input
                v-model="ignoreCase"
                type="checkbox"
                class="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700">忽略大小写</span>
            </label>
          </div>
        </div>

        <!-- 统计信息 -->
        <div v-if="diffResult.length > 0" class="card-p">
          <div class="flex items-center gap-6 flex-wrap">
            <h2 class="text-title">📊 对比统计</h2>
            <div class="flex gap-4">
              <span class="inline-flex items-center gap-1.5 text-sm">
                <span
                  class="w-3 h-3 rounded-sm bg-green-400 inline-block"
                ></span>
                <span class="text-green-700 font-medium"
                  >新增 {{ stats.added }} 行</span
                >
              </span>
              <span class="inline-flex items-center gap-1.5 text-sm">
                <span class="w-3 h-3 rounded-sm bg-red-400 inline-block"></span>
                <span class="text-red-700 font-medium"
                  >删除 {{ stats.removed }} 行</span
                >
              </span>
              <span class="inline-flex items-center gap-1.5 text-sm">
                <span
                  class="w-3 h-3 rounded-sm bg-gray-300 inline-block"
                ></span>
                <span class="text-gray-600">相同 {{ stats.unchanged }} 行</span>
              </span>
            </div>
          </div>
        </div>

        <!-- 文本相同提示 -->
        <div v-if="isIdentical" class="status-success">
          <span class="font-bold">✅ 两段文本完全相同</span>，没有差异。
        </div>

        <!-- 视图模式切换 -->
        <TabBar
          v-if="diffResult.length > 0"
          v-model="viewMode"
          :tabs="VIEW_MODES"
        />

        <!-- 统一视图 -->
        <div
          v-if="diffResult.length > 0 && viewMode === 'unified'"
          class="card overflow-hidden"
        >
          <div class="diff-container overflow-auto max-h-[500px]">
            <table class="w-full text-sm font-mono border-collapse">
              <tbody>
                <tr
                  v-for="(line, index) in diffResult"
                  :key="index"
                  :class="diffLineClass(line.type)"
                >
                  <td
                    class="diff-gutter text-right select-none w-12 border-r border-gray-200"
                  >
                    {{ line.oldLineNo ?? "" }}
                  </td>
                  <td
                    class="diff-gutter text-right select-none w-12 border-r border-gray-200"
                  >
                    {{ line.newLineNo ?? "" }}
                  </td>
                  <td
                    class="diff-indicator select-none w-6 text-center font-bold"
                  >
                    {{
                      line.type === "added"
                        ? "+"
                        : line.type === "removed"
                        ? "-"
                        : ""
                    }}
                  </td>
                  <td class="px-3 py-0.5 whitespace-pre">
                    {{ line.content || " " }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 并排视图 -->
        <div
          v-if="diffResult.length > 0 && viewMode === 'side-by-side'"
          class="card overflow-hidden"
        >
          <div class="diff-container overflow-auto max-h-[500px]">
            <table class="w-full text-sm font-mono border-collapse">
              <tbody>
                <tr v-for="(pair, index) in sideBySideLines" :key="index">
                  <!-- 左侧 (原始) -->
                  <td
                    class="diff-gutter text-right select-none w-10 border-r border-gray-200"
                    :class="
                      pair.left ? diffLineClass(pair.left.type) : 'bg-gray-50'
                    "
                  >
                    {{ pair.left?.lineNo ?? "" }}
                  </td>
                  <td
                    class="px-3 py-0.5 whitespace-pre w-1/2 border-r border-gray-300"
                    :class="
                      pair.left ? diffLineClass(pair.left.type) : 'bg-gray-50'
                    "
                  >
                    {{ pair.left?.content || " " }}
                  </td>
                  <!-- 右侧 (修改) -->
                  <td
                    class="diff-gutter text-right select-none w-10 border-r border-gray-200"
                    :class="
                      pair.right ? diffLineClass(pair.right.type) : 'bg-gray-50'
                    "
                  >
                    {{ pair.right?.lineNo ?? "" }}
                  </td>
                  <td
                    class="px-3 py-0.5 whitespace-pre w-1/2"
                    :class="
                      pair.right ? diffLineClass(pair.right.type) : 'bg-gray-50'
                    "
                  >
                    {{ pair.right?.content || " " }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 常用示例 -->
        <div class="card-p">
          <h2 class="text-title mb-3">📚 常用示例</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              v-for="example in DIFF_EXAMPLES"
              :key="example.name"
              class="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
              @click="useExample(example)"
            >
              <div class="text-sm font-medium text-gray-800 mb-1">
                {{ example.name }}
              </div>
              <div class="text-xs text-gray-500">
                {{ example.description }}
              </div>
            </div>
          </div>
        </div>

        <!-- 使用说明 -->
        <div class="status-info">
          <span class="font-bold">💡 使用提示：</span>
          在左右两侧分别输入原始文本和修改后的文本，点击「对比」按钮查看差异。支持统一视图和并排视图两种展示方式。
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from "vue";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import TabBar from "@/components/TabBar/TabBar.vue";
import { copyToClipboard } from "@/utils";
import type { MessageType } from "@/composables/useMessage";
import {
  VIEW_MODES,
  DIFF_EXAMPLES,
  computeDiff,
  computeStats,
  toSideBySide,
  formatDiffText,
  type ViewMode,
  type DiffLine,
  type DiffExample,
} from "./constants";

// 从布局组件注入 showMessage
const showMessage =
  inject<(text: string, type?: MessageType) => void>("showMessage")!;

// 输入文本
const oldText = ref("");
const newText = ref("");

// 对比选项
const ignoreWhitespace = ref(false);
const ignoreCase = ref(false);

// 视图模式
const viewMode = ref<ViewMode>("unified");

// Diff 结果
const diffResult = ref<DiffLine[]>([]);

// 是否完全相同（两侧都有内容但无差异）
const isIdentical = computed(() => {
  return (
    oldText.value.length > 0 &&
    newText.value.length > 0 &&
    diffResult.value.length > 0 &&
    diffResult.value.every((line) => line.type === "equal")
  );
});

// 统计信息
const stats = computed(() => computeStats(diffResult.value));

// 并排视图数据
const sideBySideLines = computed(() => toSideBySide(diffResult.value));

/**
 * 执行 diff 对比
 */
function runDiff() {
  if (!oldText.value && !newText.value) {
    diffResult.value = [];
    return;
  }

  diffResult.value = computeDiff(oldText.value, newText.value, {
    ignoreWhitespace: ignoreWhitespace.value,
    ignoreCase: ignoreCase.value,
  });

  if (diffResult.value.length > 0 && !isIdentical.value) {
    showMessage("对比完成");
  }
}

// 输入变化时自动对比
watch(
  [oldText, newText, ignoreWhitespace, ignoreCase],
  () => {
    if (oldText.value || newText.value) {
      diffResult.value = computeDiff(oldText.value, newText.value, {
        ignoreWhitespace: ignoreWhitespace.value,
        ignoreCase: ignoreCase.value,
      });
    } else {
      diffResult.value = [];
    }
  },
  { immediate: false }
);

/**
 * 行数统计
 */
function lineCount(text: string): number {
  return text ? text.split("\n").length : 0;
}

/**
 * Diff 行样式
 */
function diffLineClass(type: string): string {
  switch (type) {
    case "added":
      return "diff-line-added";
    case "removed":
      return "diff-line-removed";
    default:
      return "";
  }
}

/**
 * 复制 diff 结果
 */
async function copyDiffResult() {
  if (diffResult.value.length === 0) {
    showMessage("请先执行对比", "warning");
    return;
  }

  const text = formatDiffText(diffResult.value);
  const success = await copyToClipboard(text);
  if (success) {
    showMessage("已复制到剪贴板");
  } else {
    showMessage("复制失败", "error");
  }
}

/**
 * 交换左右文本
 */
function swapTexts() {
  const temp = oldText.value;
  oldText.value = newText.value;
  newText.value = temp;
  showMessage("已交换");
}

/**
 * 使用示例
 */
function useExample(example: DiffExample) {
  oldText.value = example.original;
  newText.value = example.modified;
  showMessage(`已加载示例: ${example.name}`);
}

/**
 * 清空所有
 */
function clearAll() {
  oldText.value = "";
  newText.value = "";
  diffResult.value = [];
  showMessage("已清空");
}
</script>

<style scoped>
.diff-gutter {
  @apply px-2 py-0.5 text-xs text-gray-400;
}

.diff-indicator {
  @apply px-1 py-0.5 text-xs;
}

.diff-line-added {
  @apply bg-green-50;
}

.diff-line-added .diff-gutter {
  @apply bg-green-100 text-green-600;
}

.diff-line-added .diff-indicator {
  @apply text-green-600;
}

.diff-line-removed {
  @apply bg-red-50;
}

.diff-line-removed .diff-gutter {
  @apply bg-red-100 text-red-600;
}

.diff-line-removed .diff-indicator {
  @apply text-red-600;
}

.diff-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.diff-container::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

.diff-container::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded;
}

.diff-container::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>
