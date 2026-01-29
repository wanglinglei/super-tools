<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- 顶部工具栏 -->
    <div class="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
      <!-- 左侧按钮组 -->
      <div class="flex gap-2">
        <button class="tool-btn" @click="refreshCurrentTime">
          <SvgIcon name="format" size="16px" class-name="mr-1.5" />
          刷新当前时间
        </button>
        <button class="tool-btn" @click="copyTimestamp">
          <SvgIcon name="copy" size="16px" class-name="mr-1.5" />
          复制当前时间戳
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
      <div class="max-w-6xl mx-auto space-y-3">
        <!-- 当前时间 -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-bold text-gray-800">⏰ 当前时间</h2>
            <span class="text-xs text-gray-500">自动更新</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
              <div class="text-xs text-gray-600 mb-1">秒</div>
              <div class="flex items-center justify-between">
                <div class="text-xl font-bold text-blue-600 font-mono">{{ currentTimestampSec }}</div>
                <button
                  class="p-1.5 hover:bg-blue-200 rounded transition-colors"
                  @click="copyText(currentTimestampSec.toString())"
                  title="复制"
                >
                  <SvgIcon name="copy" size="16px" />
                </button>
              </div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
              <div class="text-xs text-gray-600 mb-1">毫秒</div>
              <div class="flex items-center justify-between">
                <div class="text-xl font-bold text-purple-600 font-mono">{{ currentTimestampMs }}</div>
                <button
                  class="p-1.5 hover:bg-purple-200 rounded transition-colors"
                  @click="copyText(currentTimestampMs.toString())"
                  title="复制"
                >
                  <SvgIcon name="copy" size="16px" />
                </button>
              </div>
            </div>
            <div class="flex items-center justify-center bg-gray-50 rounded-lg p-3">
              <div class="text-base text-gray-700 font-medium">{{ currentDatetime }}</div>
            </div>
          </div>
        </div>

        <!-- 转换工具区 - 左右布局 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <!-- 时间戳转日期时间 -->
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 class="text-base font-bold text-gray-800 mb-3">📅 时间戳 → 日期</h2>
            <div class="space-y-3">
              <div class="flex gap-2">
                <input
                  v-model="timestampInput"
                  type="text"
                  placeholder="输入时间戳"
                  class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @input="convertTimestamp"
                />
                <select
                  v-model="timestampUnit"
                  class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @change="convertTimestamp"
                >
                  <option value="auto">自动</option>
                  <option value="sec">秒</option>
                  <option value="ms">毫秒</option>
                </select>
              </div>
              <div v-if="convertedDatetime" class="bg-gray-50 rounded-lg p-3">
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="text-xs text-gray-600 mb-1">转换结果</div>
                    <div class="text-base font-bold text-gray-800 truncate">{{ convertedDatetime }}</div>
                    <div class="text-xs text-gray-500 mt-0.5 truncate">{{ convertedDatetimeISO }}</div>
                  </div>
                  <button
                    class="ml-2 p-1.5 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                    @click="copyText(convertedDatetime)"
                    title="复制"
                  >
                    <SvgIcon name="copy" size="16px" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 日期时间转时间戳 -->
          <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h2 class="text-base font-bold text-gray-800 mb-3">🔢 日期 → 时间戳</h2>
            <div class="space-y-3">
              <input
                v-model="datetimeInput"
                type="datetime-local"
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @change="convertDatetime"
              />
              <div v-if="convertedTimestamp" class="grid grid-cols-2 gap-2">
                <div class="bg-blue-50 rounded-lg p-3">
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="text-xs text-gray-600 mb-1">秒</div>
                      <div class="text-base font-bold text-blue-600 font-mono truncate">{{ convertedTimestampSec }}</div>
                    </div>
                    <button
                      class="ml-1 p-1.5 hover:bg-blue-200 rounded transition-colors flex-shrink-0"
                      @click="copyText(convertedTimestampSec.toString())"
                      title="复制"
                    >
                      <SvgIcon name="copy" size="14px" />
                    </button>
                  </div>
                </div>
                <div class="bg-purple-50 rounded-lg p-3">
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="text-xs text-gray-600 mb-1">毫秒</div>
                      <div class="text-base font-bold text-purple-600 font-mono truncate">{{ convertedTimestampMs }}</div>
                    </div>
                    <button
                      class="ml-1 p-1.5 hover:bg-purple-200 rounded transition-colors flex-shrink-0"
                      @click="copyText(convertedTimestampMs.toString())"
                      title="复制"
                    >
                      <SvgIcon name="copy" size="14px" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 常用时间戳快捷按钮 -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 class="text-base font-bold text-gray-800 mb-3">⚡ 快捷选择</h2>
          <div class="grid grid-cols-4 md:grid-cols-8 gap-2">
            <button
              v-for="preset in presets"
              :key="preset.label"
              class="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
              @click="applyPreset(preset)"
            >
              {{ preset.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import SvgIcon from '@/components/svgIcon/SvgIcon.vue';
import MessageToast from '@/components/Message/MessageToast.vue';
import { useMessage } from '@/composables/useMessage';
import { copyToClipboard } from '@/utils';

// 当前时间
const currentTime = ref(Date.now());
const currentTimestampSec = computed(() => Math.floor(currentTime.value / 1000));
const currentTimestampMs = computed(() => currentTime.value);
const currentDatetime = computed(() => {
  return new Date(currentTime.value).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
});

// 时间戳转日期时间
const timestampInput = ref('');
const timestampUnit = ref('auto');
const convertedDatetime = ref('');
const convertedDatetimeISO = ref('');

// 日期时间转时间戳
const datetimeInput = ref('');
const convertedTimestamp = ref(0);
const convertedTimestampSec = computed(() => Math.floor(convertedTimestamp.value / 1000));
const convertedTimestampMs = computed(() => convertedTimestamp.value);

// 消息提示
const { message, showMessage } = useMessage();

let timeUpdateTimer: ReturnType<typeof setInterval> | null = null;

// 快捷预设
const presets = [
  { label: '今天 00:00', value: () => new Date(new Date().setHours(0, 0, 0, 0)) },
  { label: '今天 23:59', value: () => new Date(new Date().setHours(23, 59, 59, 999)) },
  { label: '昨天此时', value: () => new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { label: '明天此时', value: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
  { label: '一周前', value: () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  { label: '一周后', value: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  { label: '一个月前', value: () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  { label: '一个月后', value: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
];

// 刷新当前时间
const refreshCurrentTime = () => {
  currentTime.value = Date.now();
  showMessage('已刷新当前时间');
};

// 复制当前时间戳
const copyTimestamp = async () => {
  await copyText(currentTimestampSec.value.toString());
};

// 复制文本
const copyText = async (text: string) => {
  const success = await copyToClipboard(text);
  if (success) {
    showMessage('已复制到剪贴板');
  } else {
    showMessage('复制失败', 'error');
  }
};

// 时间戳转日期时间
const convertTimestamp = () => {
  const input = timestampInput.value.trim();
  if (!input) {
    convertedDatetime.value = '';
    convertedDatetimeISO.value = '';
    return;
  }

  try {
    let timestamp = parseInt(input);
    
    // 自动识别单位
    if (timestampUnit.value === 'auto') {
      // 如果是 10 位数字，认为是秒；13 位数字认为是毫秒
      if (timestamp.toString().length === 10) {
        timestamp = timestamp * 1000;
      }
    } else if (timestampUnit.value === 'sec') {
      timestamp = timestamp * 1000;
    }

    const date = new Date(timestamp);
    
    if (isNaN(date.getTime())) {
      showMessage('无效的时间戳', 'error');
      convertedDatetime.value = '';
      convertedDatetimeISO.value = '';
      return;
    }

    convertedDatetime.value = date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    
    convertedDatetimeISO.value = date.toISOString();
  } catch {
    showMessage('转换失败', 'error');
    convertedDatetime.value = '';
    convertedDatetimeISO.value = '';
  }
};

// 日期时间转时间戳
const convertDatetime = () => {
  if (!datetimeInput.value) {
    convertedTimestamp.value = 0;
    return;
  }

  try {
    const date = new Date(datetimeInput.value);
    
    if (isNaN(date.getTime())) {
      showMessage('无效的日期时间', 'error');
      convertedTimestamp.value = 0;
      return;
    }

    convertedTimestamp.value = date.getTime();
  } catch {
    showMessage('转换失败', 'error');
    convertedTimestamp.value = 0;
  }
};

// 应用预设
const applyPreset = (preset: any) => {
  const date = preset.value();
  datetimeInput.value = formatDatetimeLocal(date);
  convertDatetime();
  showMessage(`已应用：${preset.label}`);
};

// 格式化为 datetime-local 格式
const formatDatetimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// 清空所有
const clearAll = () => {
  timestampInput.value = '';
  datetimeInput.value = '';
  convertedDatetime.value = '';
  convertedDatetimeISO.value = '';
  convertedTimestamp.value = 0;
  showMessage('已清空所有输入');
};

onMounted(() => {
  // 每秒更新当前时间
  timeUpdateTimer = setInterval(() => {
    currentTime.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (timeUpdateTimer) {
    clearInterval(timeUpdateTimer);
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
</style>
