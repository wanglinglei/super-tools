<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- 顶部工具栏 -->
    <div class="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
      <!-- 左侧按钮组 -->
      <div class="flex gap-2">
        <button class="tool-btn" @click="handleEncode">
          <SvgIcon name="check" size="16px" class-name="mr-1.5" />
          URL 编码
        </button>
        <button class="tool-btn" @click="handleDecode">
          <SvgIcon name="format" size="16px" class-name="mr-1.5" />
          URL 解码
        </button>
        <button class="tool-btn" @click="copyOutput">
          <SvgIcon name="copy" size="16px" class-name="mr-1.5" />
          复制结果
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
        <!-- 输入输出区 - 左右布局 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <!-- 输入区 -->
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-base font-bold text-gray-800">📝 输入</h2>
              <span class="text-xs text-gray-500">{{ inputText.length }} 字符</span>
            </div>
            <div class="space-y-3">
              <textarea
                v-model="inputText"
                placeholder="输入需要编码或解码的文本..."
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
                rows="12"
              ></textarea>
            </div>
          </div>

          <!-- 输出区 -->
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-base font-bold text-gray-800">✅ 输出</h2>
              <span class="text-xs text-gray-500">{{ outputText.length }} 字符</span>
            </div>
            <div class="space-y-3">
              <textarea
                v-model="outputText"
                readonly
                placeholder="结果将显示在这里..."
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono"
                rows="12"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 编码选项 -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 class="text-base font-bold text-gray-800 mb-3">⚙️ 编码选项</h2>
          <div class="flex gap-4 flex-wrap">
            <label
              v-for="option in encodeOptions"
              :key="option.value"
              class="inline-flex items-center cursor-pointer"
            >
              <input
                v-model="selectedEncodeType"
                type="radio"
                :value="option.value"
                class="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700">
                <span class="font-medium">{{ option.label }}</span>
                <span class="text-gray-500 ml-1">- {{ option.description }}</span>
              </span>
            </label>
          </div>
        </div>

        <!-- 常用示例 -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 class="text-base font-bold text-gray-800 mb-3">📚 常用示例</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="(example, index) in urlExamples"
              :key="index"
              class="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
              @click="useExample(example)"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-800 mb-1">{{ example.name }}</div>
                  <div class="text-xs text-gray-600 break-all mb-1">
                    <span class="font-medium text-gray-700">原文:</span> {{ example.original }}
                  </div>
                  <div class="text-xs text-gray-500 break-all">
                    <span class="font-medium text-gray-700">编码:</span> {{ example.encoded }}
                  </div>
                </div>
                <button
                  class="p-1.5 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                  @click.stop="copyText(example.original)"
                  title="复制原文"
                >
                  <SvgIcon name="copy" size="14px" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- URL 编码说明 -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 class="text-base font-bold text-gray-800 mb-3">📖 编码说明</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="(item, index) in encodeRules"
              :key="index"
              class="bg-gray-50 rounded-lg p-3"
            >
              <div class="flex items-start gap-2">
                <div class="font-mono text-sm font-bold text-blue-600 flex-shrink-0">{{ item.char }}</div>
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-gray-700 mb-1">{{ item.description }}</div>
                  <div class="text-xs text-gray-500 font-mono">
                    编码: {{ item.encoded }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 保留字符说明 -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 class="text-base font-bold text-gray-800 mb-3">🔐 保留字符</h2>
          <div class="space-y-2">
            <div class="text-sm text-gray-700">
              以下字符在 URL 中有特殊含义，通常需要编码：
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="char in reservedChars"
                :key="char.char"
                class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-mono"
                :title="char.description"
              >
                {{ char.char }} → {{ char.encoded }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SvgIcon from '@/components/svgIcon/SvgIcon.vue';
import MessageToast from '@/components/Message/MessageToast.vue';
import { useMessage } from '@/composables/useMessage';
import { copyToClipboard } from '@/utils';
import { ENCODE_OPTIONS, URL_EXAMPLES, ENCODE_RULES, RESERVED_CHARS, type UrlExample } from './constants';

const { message, showMessage } = useMessage();

// 输入输出文本
const inputText = ref('');
const outputText = ref('');
const selectedEncodeType = ref('encodeURIComponent');

// 从常量导入配置
const encodeOptions = ENCODE_OPTIONS;
const urlExamples = URL_EXAMPLES;
const encodeRules = ENCODE_RULES;
const reservedChars = RESERVED_CHARS;

// URL 编码
const handleEncode = () => {
  if (!inputText.value.trim()) {
    showMessage('请输入要编码的文本', 'error');
    return;
  }

  try {
    let result = '';
    switch (selectedEncodeType.value) {
      case 'encodeURIComponent':
        result = encodeURIComponent(inputText.value);
        break;
      case 'encodeURI':
        result = encodeURI(inputText.value);
        break;
      case 'escape':
        result = escape(inputText.value);
        break;
      default:
        result = encodeURIComponent(inputText.value);
    }
    outputText.value = result;
    showMessage('编码成功', 'success');
  } catch (error) {
    showMessage('编码失败: ' + (error as Error).message, 'error');
  }
};

// URL 解码
const handleDecode = () => {
  if (!inputText.value.trim()) {
    showMessage('请输入要解码的文本', 'error');
    return;
  }

  try {
    let result = '';
    switch (selectedEncodeType.value) {
      case 'encodeURIComponent':
        result = decodeURIComponent(inputText.value);
        break;
      case 'encodeURI':
        result = decodeURI(inputText.value);
        break;
      case 'escape':
        result = unescape(inputText.value);
        break;
      default:
        result = decodeURIComponent(inputText.value);
    }
    outputText.value = result;
    showMessage('解码成功', 'success');
  } catch (error) {
    showMessage('解码失败: ' + (error as Error).message, 'error');
  }
};

// 使用示例
const useExample = (example: UrlExample) => {
  inputText.value = example.original;
  outputText.value = example.encoded;
  showMessage(`已应用示例：${example.name}`, 'success');
};

// 复制输出结果
const copyOutput = () => {
  if (!outputText.value) {
    showMessage('没有可复制的结果', 'error');
    return;
  }
  copyText(outputText.value);
};

// 复制文本
const copyText = async (text: string) => {
  const success = await copyToClipboard(text);
  if (success) {
    showMessage('已复制到剪贴板', 'success');
  } else {
    showMessage('复制失败', 'error');
  }
};

// 清空所有
const clearAll = () => {
  inputText.value = '';
  outputText.value = '';
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
