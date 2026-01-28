<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- 顶部工具栏 -->
    <div class="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
      <!-- 左侧按钮组 -->
      <div class="flex gap-2">
        <button class="tool-btn" @click="testRegex">
          <SvgIcon name="check" size="16px" class-name="mr-1.5" />
          测试匹配
        </button>
        <button class="tool-btn" @click="copyMatches">
          <SvgIcon name="copy" size="16px" class-name="mr-1.5" />
          复制匹配结果
        </button>
      </div>

      <!-- 右侧按钮组 -->
      <div class="flex gap-2">
        <button
          class="tool-btn-icon"
          title="清空所有"
          @click="clearAll"
        >
          <SvgIcon name="trash" size="20px" />
        </button>
      </div>
    </div>

    <!-- 消息提示 -->
    <MessageToast :visible="message.show" :text="message.text" :type="message.type" />

    <!-- 主内容区 -->
    <div class="flex-1 overflow-auto p-4">
      <div class="max-w-7xl mx-auto space-y-3">
        <!-- 正则表达式和测试文本区 - 左右布局 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <!-- 正则表达式输入 -->
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 class="text-base font-bold text-gray-800 mb-3">🔍 正则表达式</h2>
            <div class="space-y-3">
              <!-- 正则表达式输入 -->
              <div>
                <label class="block text-xs text-gray-600 mb-1">表达式</label>
                <input
                  v-model="regexPattern"
                  type="text"
                  placeholder="输入正则表达式，如：\d{11}"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  @input="handleRegexChange"
                />
              </div>

              <!-- 修饰符 -->
              <div>
                <label class="block text-xs text-gray-600 mb-1">修饰符</label>
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
                      <span class="font-mono font-bold">{{ flag.value }}</span> - {{ flag.label }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- 生成的正则表达式 -->
              <div>
                <label class="block text-xs text-gray-600 mb-1">完整表达式</label>
                <div class="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-800">
                  {{ fullRegexPattern }}
                </div>
              </div>

              <!-- 错误提示 -->
              <div v-if="regexError" class="bg-red-50 border border-red-200 rounded-lg p-3">
                <div class="flex items-start">
                  <span class="text-red-600 text-xs">❌ {{ regexError }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 测试文本输入 -->
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 class="text-base font-bold text-gray-800 mb-3">📝 测试文本</h2>
            <div class="space-y-3">
              <textarea
                v-model="testText"
                placeholder="输入要测试的文本内容..."
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
                rows="10"
                @input="handleRegexChange"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 匹配结果 -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-bold text-gray-800">✅ 匹配结果</h2>
            <span class="text-xs text-gray-500">
              共找到 <span class="font-bold text-blue-600">{{ matches.length }}</span> 个匹配
            </span>
          </div>

          <!-- 无匹配时的提示 -->
          <div v-if="matches.length === 0 && testText && regexPattern" class="text-center py-8 text-gray-400">
            <div class="text-4xl mb-2">🔍</div>
            <div class="text-sm">未找到匹配项</div>
          </div>

          <!-- 匹配结果列表 -->
          <div v-else-if="matches.length > 0" class="space-y-2 max-h-64 overflow-y-auto">
            <div
              v-for="(match, index) in matches"
              :key="index"
              class="bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-bold text-blue-600">匹配 {{ index + 1 }}</span>
                    <span class="text-xs text-gray-500">位置: {{ match.index }}</span>
                  </div>
                  <div class="font-mono text-sm text-gray-800 break-all">{{ match.value }}</div>
                  
                  <!-- 捕获组 -->
                  <div v-if="match.groups && match.groups.length > 0" class="mt-2 space-y-1">
                    <div class="text-xs text-gray-600 font-medium">捕获组:</div>
                    <div
                      v-for="(group, gIndex) in match.groups"
                      :key="gIndex"
                      class="text-xs text-gray-700 pl-2"
                    >
                      <span class="font-mono text-purple-600">${{ gIndex + 1 }}:</span> {{ group }}
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
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 class="text-base font-bold text-gray-800 mb-3">⭐ 常用正则表达式</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="(item, index) in commonRegex"
              :key="index"
              class="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
              @click="useCommonRegex(item)"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-800 mb-1">{{ item.name }}</div>
                  <div class="font-mono text-xs text-gray-600 break-all">{{ item.pattern }}</div>
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
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 class="text-base font-bold text-gray-800 mb-3">📖 符号说明</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="(item, index) in regexSymbols"
              :key="index"
              class="bg-gray-50 rounded-lg p-3"
            >
              <div class="flex items-start gap-2">
                <div class="font-mono text-sm font-bold text-blue-600 flex-shrink-0">{{ item.symbol }}</div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-gray-700">{{ item.description }}</div>
                  <div v-if="item.example" class="text-xs text-gray-500 mt-1 font-mono">
                    {{ item.example }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import SvgIcon from '@/components/svgIcon/SvgIcon.vue';
import MessageToast from '@/components/Message/MessageToast.vue';
import { useMessage } from '@/composables/useMessage';
import { REGEX_FLAGS, COMMON_REGEX, REGEX_SYMBOLS, type CommonRegex } from './constants';

const { message, showMessage } = useMessage();

// 正则表达式相关
const regexPattern = ref('');
const selectedFlags = ref<string[]>([]);
const testText = ref('');
const regexError = ref('');
const matches = ref<Array<{ value: string; index: number; groups?: string[] }>>([]);

// 从常量导入配置
const regexFlags = REGEX_FLAGS;
const commonRegex = COMMON_REGEX;
const regexSymbols = REGEX_SYMBOLS;

// 完整的正则表达式
const fullRegexPattern = computed(() => {
  if (!regexPattern.value) return '';
  return `/${regexPattern.value}/${selectedFlags.value.join('')}`;
});

// 处理正则表达式变化
const handleRegexChange = () => {
  regexError.value = '';
  matches.value = [];

  if (!regexPattern.value || !testText.value) {
    return;
  }

  try {
    const flags = selectedFlags.value.join('');
    const regex = new RegExp(regexPattern.value, flags);
    
    if (flags.includes('g')) {
      // 全局匹配
      let match;
      while ((match = regex.exec(testText.value)) !== null) {
        matches.value.push({
          value: match[0],
          index: match.index,
          groups: match.slice(1).filter(g => g !== undefined),
        });
      }
    } else {
      // 单次匹配
      const match = regex.exec(testText.value);
      if (match) {
        matches.value.push({
          value: match[0],
          index: match.index,
          groups: match.slice(1).filter(g => g !== undefined),
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
    showMessage('请输入正则表达式', 'error');
    return;
  }
  if (!testText.value) {
    showMessage('请输入测试文本', 'error');
    return;
  }

  handleRegexChange();
  
  if (regexError.value) {
    showMessage('正则表达式有误', 'error');
  } else if (matches.value.length > 0) {
    showMessage(`找到 ${matches.value.length} 个匹配项`, 'success');
  } else {
    showMessage('未找到匹配项', 'info');
  }
};

// 使用常用正则表达式
const useCommonRegex = (item: CommonRegex) => {
  regexPattern.value = item.pattern;
  if (item.example) {
    testText.value = item.example;
  }
  // 默认不选中全局匹配，让用户自己选择
  selectedFlags.value = [];
  handleRegexChange();
  showMessage(`已应用：${item.name}`, 'success');
};

// 复制匹配结果
const copyMatches = () => {
  if (matches.value.length === 0) {
    showMessage('没有匹配结果可复制', 'error');
    return;
  }

  const result = matches.value.map((match, index) => {
    let text = `匹配 ${index + 1}: ${match.value}`;
    if (match.groups && match.groups.length > 0) {
      text += '\n捕获组: ' + match.groups.map((g, i) => `$${i + 1}: ${g}`).join(', ');
    }
    return text;
  }).join('\n\n');

  copyText(result);
};

// 复制文本
const copyText = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    showMessage('已复制到剪贴板', 'success');
  }).catch(() => {
    showMessage('复制失败', 'error');
  });
};

// 清空所有
const clearAll = () => {
  regexPattern.value = '';
  selectedFlags.value = [];
  testText.value = '';
  regexError.value = '';
  matches.value = [];
  showMessage('已清空', 'success');
};
</script>

<style scoped>
.tool-btn {
  @apply px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center font-medium text-gray-700;
}

.tool-btn-icon {
  @apply p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center text-gray-700;
}
</style>
