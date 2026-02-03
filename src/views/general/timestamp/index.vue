<template>
  <ToolLayout ref="layoutRef" title="时间戳转换" icon="⏰">
    <!-- 左侧工具栏 -->
    <template #header-left>
      <ToolButton
        icon="format"
        text="刷新当前时间"
        @click="refreshCurrentTime"
      />
      <ToolButton icon="copy" text="复制当前时间戳" @click="copyTimestamp" />
    </template>

    <!-- 右侧工具栏 -->
    <template #header-right>
      <ToolButton type="icon" icon="trash" title="清空所有" @click="clearAll" />
    </template>

    <!-- 主内容区 -->
    <div class="max-w-6xl mx-auto space-y-3">
      <!-- 当前时间 -->
      <div class="card-p">
        <div class="flex-between mb-3">
          <h2 class="text-title">⏰ 当前时间</h2>
          <span class="text-hint">自动更新</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="gradient-blue rounded-lg p-3">
            <div class="text-xs text-gray-600 mb-1">秒</div>
            <div class="flex items-center justify-between">
              <div class="text-xl font-bold text-blue-600 font-mono">
                {{ currentTimestampSec }}
              </div>
              <button
                class="p-1.5 hover:bg-blue-200 rounded transition-colors"
                @click="copyText(currentTimestampSec.toString())"
                title="复制"
              >
                <SvgIcon name="copy" size="16px" />
              </button>
            </div>
          </div>
          <div class="gradient-purple rounded-lg p-3">
            <div class="text-xs text-gray-600 mb-1">毫秒</div>
            <div class="flex items-center justify-between">
              <div class="text-xl font-bold text-purple-600 font-mono">
                {{ currentTimestampMs }}
              </div>
              <button
                class="p-1.5 hover:bg-purple-200 rounded transition-colors"
                @click="copyText(currentTimestampMs.toString())"
                title="复制"
              >
                <SvgIcon name="copy" size="16px" />
              </button>
            </div>
          </div>
          <div
            class="flex items-center justify-center bg-gray-50 rounded-lg p-3"
          >
            <div class="text-base text-gray-700 font-medium">
              {{ currentDatetime }}
            </div>
          </div>
        </div>
      </div>

      <!-- 转换工具区 - 左右布局 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <!-- 时间戳转日期时间 -->
        <div class="card-p">
          <h2 class="text-title mb-3">📅 时间戳 → 日期</h2>
          <div class="space-y-3">
            <div class="flex gap-2">
              <input
                v-model="timestampInput"
                type="text"
                placeholder="输入时间戳"
                class="flex-1 input-base"
                @input="convertTimestamp"
              />
              <select
                v-model="timestampUnit"
                class="input-base w-auto"
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
                  <div class="text-base font-bold text-gray-800 truncate">
                    {{ convertedDatetime }}
                  </div>
                  <div class="text-xs text-gray-500 mt-0.5 truncate">
                    {{ convertedDatetimeISO }}
                  </div>
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
        <div class="card-p">
          <h2 class="text-title mb-3">🔢 日期 → 时间戳</h2>
          <div class="space-y-3">
            <input
              v-model="datetimeInput"
              type="datetime-local"
              class="input-base"
              @change="convertDatetime"
            />
            <div v-if="convertedTimestamp" class="grid grid-cols-2 gap-2">
              <div class="bg-blue-50 rounded-lg p-3">
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="text-xs text-gray-600 mb-1">秒</div>
                    <div
                      class="text-base font-bold text-blue-600 font-mono truncate"
                    >
                      {{ convertedTimestampSec }}
                    </div>
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
                    <div
                      class="text-base font-bold text-purple-600 font-mono truncate"
                    >
                      {{ convertedTimestampMs }}
                    </div>
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
      <div class="card-p">
        <h2 class="text-title mb-3">⚡ 快捷选择</h2>
        <div class="grid grid-cols-4 md:grid-cols-8 gap-2">
          <button
            v-for="preset in presets"
            :key="preset.label"
            class="btn-sm border border-gray-200"
            @click="applyPreset(preset)"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, inject } from "vue";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import SvgIcon from "@/components/svgIcon/SvgIcon.vue";
import { copyToClipboard } from "@/utils";
import type { MessageType } from "@/composables/useMessage";

// 布局组件引用
const layoutRef = ref<InstanceType<typeof ToolLayout> | null>(null);

// 从布局组件注入 showMessage
const injectedShowMessage =
  inject<(text: string, type?: MessageType, duration?: number) => void>(
    "showMessage"
  );

// showMessage 方法
const showMessage = (text: string, type: MessageType = "success") => {
  if (injectedShowMessage) {
    injectedShowMessage(text, type);
  } else if (layoutRef.value) {
    layoutRef.value.showMessage(text, type);
  }
};

// 当前时间
const currentTime = ref(Date.now());
const currentTimestampSec = computed(() =>
  Math.floor(currentTime.value / 1000)
);
const currentTimestampMs = computed(() => currentTime.value);
const currentDatetime = computed(() => {
  return new Date(currentTime.value).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
});

// 时间戳转日期时间
const timestampInput = ref("");
const timestampUnit = ref("auto");
const convertedDatetime = ref("");
const convertedDatetimeISO = ref("");

// 日期时间转时间戳
const datetimeInput = ref("");
const convertedTimestamp = ref(0);
const convertedTimestampSec = computed(() =>
  Math.floor(convertedTimestamp.value / 1000)
);
const convertedTimestampMs = computed(() => convertedTimestamp.value);

let timeUpdateTimer: ReturnType<typeof setInterval> | null = null;

// 快捷预设
const presets = [
  {
    label: "今天 00:00",
    value: () => new Date(new Date().setHours(0, 0, 0, 0)),
  },
  {
    label: "今天 23:59",
    value: () => new Date(new Date().setHours(23, 59, 59, 999)),
  },
  {
    label: "昨天此时",
    value: () => new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    label: "明天此时",
    value: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    label: "一周前",
    value: () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    label: "一周后",
    value: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    label: "一个月前",
    value: () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    label: "一个月后",
    value: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
];

// 刷新当前时间
const refreshCurrentTime = () => {
  currentTime.value = Date.now();
  showMessage("已刷新当前时间");
};

// 复制当前时间戳
const copyTimestamp = async () => {
  await copyText(currentTimestampSec.value.toString());
};

// 复制文本
const copyText = async (text: string) => {
  const success = await copyToClipboard(text);
  if (success) {
    showMessage("已复制到剪贴板");
  } else {
    showMessage("复制失败", "error");
  }
};

// 时间戳转日期时间
const convertTimestamp = () => {
  const input = timestampInput.value.trim();
  if (!input) {
    convertedDatetime.value = "";
    convertedDatetimeISO.value = "";
    return;
  }

  try {
    let timestamp = parseInt(input);

    // 自动识别单位
    if (timestampUnit.value === "auto") {
      // 如果是 10 位数字，认为是秒；13 位数字认为是毫秒
      if (timestamp.toString().length === 10) {
        timestamp = timestamp * 1000;
      }
    } else if (timestampUnit.value === "sec") {
      timestamp = timestamp * 1000;
    }

    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      showMessage("无效的时间戳", "error");
      convertedDatetime.value = "";
      convertedDatetimeISO.value = "";
      return;
    }

    convertedDatetime.value = date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    convertedDatetimeISO.value = date.toISOString();
  } catch {
    showMessage("转换失败", "error");
    convertedDatetime.value = "";
    convertedDatetimeISO.value = "";
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
      showMessage("无效的日期时间", "error");
      convertedTimestamp.value = 0;
      return;
    }

    convertedTimestamp.value = date.getTime();
  } catch {
    showMessage("转换失败", "error");
    convertedTimestamp.value = 0;
  }
};

// 应用预设
const applyPreset = (preset: { label: string; value: () => Date }) => {
  const date = preset.value();
  datetimeInput.value = formatDatetimeLocal(date);
  convertDatetime();
  showMessage(`已应用：${preset.label}`);
};

// 格式化为 datetime-local 格式
const formatDatetimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// 清空所有
const clearAll = () => {
  timestampInput.value = "";
  datetimeInput.value = "";
  convertedDatetime.value = "";
  convertedDatetimeISO.value = "";
  convertedTimestamp.value = 0;
  showMessage("已清空所有输入");
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
