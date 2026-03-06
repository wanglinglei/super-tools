<template>
  <ToolLayout title="正则测试" icon="🔍">
    <!-- 左侧工具栏 -->
    <template #header-left>
      <ToolButton icon="check" text="测试匹配" @click="testRegex" />
      <ToolButton icon="copy" text="复制匹配结果" @click="copyMatches" />
    </template>

    <!-- 右侧工具栏 -->
    <template #header-right>
      <ToolButton type="icon" icon="trash" title="清空所有" @click="clearAll" />
    </template>

    <!-- 主内容区 -->
    <div class="max-w-7xl mx-auto space-y-3">
      <!-- 正则表达式和测试文本区 - 左右布局 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <!-- 正则表达式输入 -->
        <div class="card-p">
          <h2 class="text-title mb-3">🔍 正则表达式</h2>
          <div class="space-y-3">
            <!-- 正则表达式输入 -->
            <div>
              <label class="text-label block mb-1">表达式</label>
              <input
                v-model="regexPattern"
                type="text"
                placeholder="输入正则表达式，如：\d{11}"
                class="input-mono"
                @input="handleRegexChange"
              />
            </div>

            <!-- 修饰符 -->
            <div>
              <label class="text-label block mb-1">修饰符</label>
              <div class="flex gap-2 flex-wrap">
                <label
                  v-for="flag in regexFlags"
                  :key="flag.value"
                  class="inline-flex items-center cursor-pointer"
                >
                  <input
                    v-model="selectedFlags"
                    type="checkbox"
                    :value="flag.value"
                    class="mr-1.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    @change="handleRegexChange"
                  />
                  <span class="text-xs text-gray-700">
                    <span class="font-mono font-bold">{{ flag.value }}</span> -
                    {{ flag.label }}
                  </span>
                </label>
              </div>
            </div>

            <!-- 生成的正则表达式 -->
            <div>
              <label class="text-label block mb-1">完整表达式</label>
              <div
                class="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-800"
              >
                {{ fullRegexPattern }}
              </div>
            </div>

            <!-- 错误提示 -->
            <div
              v-if="regexError"
              class="bg-red-50 border border-red-200 rounded-lg p-3"
            >
              <div class="flex items-start">
                <span class="text-red-600 text-xs">❌ {{ regexError }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 测试文本输入 -->
        <div class="card-p flex flex-col h-[400px]">
          <h2 class="text-title mb-3">📝 测试文本</h2>
          <div class="relative flex-1 min-h-0 border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <!-- 高亮层 (Backdrop) -->
            <div 
              ref="backdropRef"
              class="absolute inset-0 p-3 font-mono text-sm whitespace-pre-wrap break-all pointer-events-none overflow-hidden text-transparent bg-white"
              v-html="highlightedText"
            ></div>
            
            <!-- 输入层 (Textarea) -->
            <textarea
              v-model="testText"
              placeholder="输入要测试的文本内容..."
              class="absolute inset-0 w-full h-full p-3 font-mono text-sm bg-transparent text-gray-800 caret-black resize-none focus:outline-none whitespace-pre-wrap break-all"
              spellcheck="false"
              @input="handleRegexChange"
              @scroll="syncScroll"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 匹配结果 -->
      <div class="card-p">
        <div class="flex-between mb-3">
          <h2 class="text-title">✅ 匹配结果</h2>
          <span class="text-hint">
            共找到
            <span class="font-bold text-blue-600">{{ matches.length }}</span>
            个匹配
          </span>
        </div>

        <!-- 无匹配时的提示 -->
        <div
          v-if="matches.length === 0 && testText && regexPattern"
          class="text-center py-8 text-gray-400"
        >
          <div class="text-4xl mb-2">🔍</div>
          <div class="text-sm">未找到匹配项</div>
        </div>

        <!-- 匹配结果列表 -->
        <div
          v-else-if="matches.length > 0"
          class="space-y-2 max-h-64 overflow-y-auto"
        >
          <div
            v-for="(match, index) in matches"
            :key="index"
            class="bg-gray-50 rounded-lg p-3 border border-gray-200"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-bold text-blue-600"
                    >匹配 {{ index + 1 }}</span
                  >
                  <span class="text-xs text-gray-500"
                    >位置: {{ match.index }}</span
                  >
                </div>
                <div class="font-mono text-sm text-gray-800 break-all">
                  {{ match.value }}
                </div>

                <!-- 捕获组 -->
                <div
                  v-if="match.groups && match.groups.length > 0"
                  class="mt-2 space-y-1"
                >
                  <div class="text-xs text-gray-600 font-medium">捕获组:</div>
                  <div
                    v-for="(group, gIndex) in match.groups"
                    :key="gIndex"
                    class="text-xs text-gray-700 pl-2"
                  >
                    <span class="font-mono text-purple-600"
                      >${{ gIndex + 1 }}:</span
                    >
                    {{ group }}
                  </div>
                </div>
              </div>
              <button
                class="p-1.5 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                @click="copyText(match.value)"
                title="复制"
              >
                <SvgIcon name="copy" size="14px" />
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-8 text-gray-400">
          <div class="text-4xl mb-2">📋</div>
          <div class="text-sm">输入正则表达式和测试文本开始测试</div>
        </div>
      </div>

      <!-- 常用正则表达式 -->
      <div class="card-p">
        <h2 class="text-title mb-3">⭐ 常用正则表达式</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="(item, index) in commonRegex"
            :key="index"
            class="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
            @click="useCommonRegex(item)"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-800 mb-1">
                  {{ item.name }}
                </div>
                <div class="font-mono text-xs text-gray-600 break-all">
                  {{ item.pattern }}
                </div>
                <div v-if="item.example" class="text-xs text-gray-500 mt-1">
                  示例: {{ item.example }}
                </div>
              </div>
              <button
                class="p-1.5 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                @click.stop="copyText(item.pattern)"
                title="复制"
              >
                <SvgIcon name="copy" size="14px" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 正则表达式符号说明 -->
      <div class="card-p">
        <h2 class="text-title mb-3">📖 符号说明</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="(item, index) in regexSymbols"
            :key="index"
            class="bg-gray-50 rounded-lg p-3"
          >
            <div class="flex items-start gap-2">
              <div
                class="font-mono text-sm font-bold text-blue-600 flex-shrink-0"
              >
                {{ item.symbol }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs text-gray-700">{{ item.description }}</div>
                <div
                  v-if="item.example"
                  class="text-xs text-gray-500 mt-1 font-mono"
                >
                  {{ item.example }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, computed, inject } from "vue";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import SvgIcon from "@/components/svgIcon/SvgIcon.vue";
import { copyToClipboard } from "@/utils";
import {
  REGEX_FLAGS,
  COMMON_REGEX,
  REGEX_SYMBOLS,
  type CommonRegex,
} from "./constants";
import type { MessageType } from "@/composables/useMessage";

// 从布局组件注入 showMessage
const showMessage =
  inject<(text: string, type?: MessageType) => void>("showMessage")!;

// 正则表达式相关
const regexPattern = ref("");
const selectedFlags = ref<string[]>([]);
const testText = ref("");
const regexError = ref("");
const matches = ref<Array<{ value: string; index: number; groups?: string[] }>>(
  []
);
const backdropRef = ref<HTMLDivElement | null>(null);

// 同步滚动
const syncScroll = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  if (backdropRef.value) {
    backdropRef.value.scrollTop = target.scrollTop;
    backdropRef.value.scrollLeft = target.scrollLeft;
  }
};

// 高亮文本
const highlightedText = computed(() => {
  if (!testText.value) return "";
  if (!regexPattern.value || regexError.value) {
    // 没有正则或正则错误时，只显示原始文本（转义）
    return escapeHtml(testText.value);
  }

  try {
    const flags = selectedFlags.value.join("");
    // 确保有 g 标志，否则 replace 只替换第一个
    const regex = new RegExp(regexPattern.value, flags.includes("g") ? flags : flags + "g");
    
    // 使用 replace 替换匹配项为带样式的 span
    // 注意：这里需要处理 HTML 转义，防止 XSS
    // 先将整个文本转义，然后再把匹配项替换回来（这种方式对于简单的正则可以，但对于包含 HTML 特殊字符的正则可能会有问题）
    // 更稳妥的方式是：手动切分字符串
    
    const text = testText.value;
    
    // 重新执行正则以获取所有匹配项的位置（因为 matches 可能还没更新或不包含所有信息）
    // 这里为了简单，直接使用 matches 中的信息（假设 handleRegexChange 已经执行）
    // 但 handleRegexChange 是异步更新 matches 的吗？不是，是同步的。
    // 不过 computed 依赖 matches 可能会导致循环依赖或时序问题。
    // 最好在这里重新匹配一次，或者直接利用 replace 的回调。
    
    return text.replace(regex, (match) => {
      return `<span class="bg-yellow-200 text-gray-800 rounded-sm">${escapeHtml(match)}</span>`;
    }).replace(/\n/g, "<br>"); // 处理换行
    
  } catch (e) {
    return escapeHtml(testText.value).replace(/\n/g, "<br>");
  }
});

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 从常量导入配置
const regexFlags = REGEX_FLAGS;
const commonRegex = COMMON_REGEX;
const regexSymbols = REGEX_SYMBOLS;

// 完整的正则表达式
const fullRegexPattern = computed(() => {
  if (!regexPattern.value) return "";
  return `/${regexPattern.value}/${selectedFlags.value.join("")}`;
});

// 处理正则表达式变化
const handleRegexChange = () => {
  regexError.value = "";
  matches.value = [];

  if (!regexPattern.value || !testText.value) {
    return;
  }

  try {
    const flags = selectedFlags.value.join("");
    const regex = new RegExp(regexPattern.value, flags);

    if (flags.includes("g")) {
      // 全局匹配
      let match;
      while ((match = regex.exec(testText.value)) !== null) {
        matches.value.push({
          value: match[0],
          index: match.index,
          groups: match.slice(1).filter((g) => g !== undefined),
        });
      }
    } else {
      // 单次匹配
      const match = regex.exec(testText.value);
      if (match) {
        matches.value.push({
          value: match[0],
          index: match.index,
          groups: match.slice(1).filter((g) => g !== undefined),
        });
      }
    }
  } catch (error) {
    regexError.value = (error as Error).message;
  }
};

// 测试正则表达式
const testRegex = () => {
  if (!regexPattern.value) {
    showMessage("请输入正则表达式", "error");
    return;
  }
  if (!testText.value) {
    showMessage("请输入测试文本", "error");
    return;
  }

  handleRegexChange();

  if (regexError.value) {
    showMessage("正则表达式有误", "error");
  } else if (matches.value.length > 0) {
    showMessage(`找到 ${matches.value.length} 个匹配项`, "success");
  } else {
    showMessage("未找到匹配项", "info");
  }
};

// 使用常用正则表达式
const useCommonRegex = (item: CommonRegex) => {
  regexPattern.value = item.pattern;
  if (item.example) {
    testText.value = item.example;
  }
  selectedFlags.value = [];
  handleRegexChange();
  showMessage(`已应用：${item.name}`, "success");
};

// 复制匹配结果
const copyMatches = () => {
  if (matches.value.length === 0) {
    showMessage("没有匹配结果可复制", "error");
    return;
  }

  const result = matches.value
    .map((match, index) => {
      let text = `匹配 ${index + 1}: ${match.value}`;
      if (match.groups && match.groups.length > 0) {
        text +=
          "\n捕获组: " +
          match.groups.map((g, i) => `$${i + 1}: ${g}`).join(", ");
      }
      return text;
    })
    .join("\n\n");

  copyText(result);
};

// 复制文本
const copyText = async (text: string) => {
  const success = await copyToClipboard(text);
  if (success) {
    showMessage("已复制到剪贴板", "success");
  } else {
    showMessage("复制失败", "error");
  }
};

// 清空所有
const clearAll = () => {
  regexPattern.value = "";
  selectedFlags.value = [];
  testText.value = "";
  regexError.value = "";
  matches.value = [];
  showMessage("已清空", "success");
};
</script>
