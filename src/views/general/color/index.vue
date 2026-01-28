<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- 顶部工具栏 -->
    <div class="flex justify-between items-center px-6 py-2.5 bg-white border-b border-gray-200">
      <!-- 标题 -->
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎨</span>
        <h1 class="text-lg font-bold text-gray-800">颜色转换工具</h1>
      </div>

      <!-- 操作按钮组 -->
      <div class="flex gap-2">
        <button
          class="tool-btn-secondary"
          title="重置"
          @click="resetColor"
        >
          <SvgIcon name="trash" size="16px" class-name="mr-1.5" />
          重置
        </button>
      </div>
    </div>

    <!-- 消息提示 -->
    <MessageToast :visible="message.show" :text="message.text" :type="message.type" />

    <!-- 主内容区 -->
    <div class="flex-1 overflow-auto p-6">
      <div class="max-w-7xl mx-auto space-y-4">
        <!-- 颜色选择器和透明度 -->
        <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 class="text-sm font-bold text-gray-800 mb-3">🎨 颜色选择</h2>
          
          <div class="space-y-4">
            <!-- 颜色选择器 -->
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-700 w-24">选择颜色:</label>
              <input
                v-model="pickerColor"
                type="color"
                class="w-20 h-10 rounded border border-gray-300 cursor-pointer"
                @input="handleColorPicker"
              />
              <div 
                class="flex-1 h-10 rounded border border-gray-300"
                :style="{ backgroundColor: currentColorWithAlpha }"
              ></div>
            </div>

            <!-- 全局透明度 -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-700">全局透明度 (Alpha):</label>
                <span class="text-sm text-blue-600 font-medium">{{ alpha }}</span>
              </div>
              <input
                v-model.number="alpha"
                type="range"
                min="0"
                max="1"
                step="0.01"
                class="w-full"
                @input="updateAllFormats"
              />
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>0 (透明)</span>
                <span>1 (不透明)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 格式转换卡片 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ColorFormatCard
            v-for="formatConfig in COLOR_FORMATS"
            :key="formatConfig.type"
            v-model="colorInputs[formatConfig.type]"
            :title="formatConfig.title"
            :format="formatConfig.format"
            :placeholder="formatConfig.placeholder"
            :preview-color="getPreviewColor(formatConfig.type)"
            :outputs="getOutputsArray(formatConfig.type)"
            @update:model-value="handleFormatInput(formatConfig.type)"
            @copy="copyText"
          />
        </div>

        <!-- 使用说明 -->
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p class="text-sm text-blue-800">
            <span class="font-bold">💡 使用提示：</span>
            支持颜色值的RGB/RGBA、HEX、HSL/HSLA、HSV/HSVA互转。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import SvgIcon from '@/components/svgIcon/SvgIcon.vue';
import MessageToast from '@/components/Message/MessageToast.vue';
import ColorFormatCard from './components/ColorFormatCard.vue';
import { useMessage } from '@/composables/useMessage';
import { COLOR_FORMATS, DEFAULT_COLOR, DEFAULT_ALPHA, type ColorFormatType } from './constants';
import type { OutputFormat } from './components/ColorFormatCard.vue';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
  parseRgb,
  parseHsl,
  parseHsv,
  hsvToRgbString,
} from './transform';

// 消息提示
const { message, showMessage } = useMessage();

// 颜色选择器
const pickerColor = ref(DEFAULT_COLOR.hex);
const alpha = ref(DEFAULT_ALPHA);

// 各格式输入（使用响应式对象统一管理）
const colorInputs = reactive<Record<ColorFormatType, string>>({
  hex: DEFAULT_COLOR.hex,
  rgb: DEFAULT_COLOR.rgb,
  hsl: DEFAULT_COLOR.hsl,
  hsv: DEFAULT_COLOR.hsv,
});

// 当前颜色（带透明度）
const currentColorWithAlpha = computed(() => {
  const rgb = hexToRgb(pickerColor.value);
  if (rgb) {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.value})`;
  }
  return pickerColor.value;
});

/**
 * 获取指定格式的预览颜色
 */
function getPreviewColor(formatType: ColorFormatType): string {
  if (formatType === 'hsv') {
    return hsvToRgbString(colorInputs[formatType]);
  }
  return colorInputs[formatType];
}

/**
 * 将颜色值转换为所有格式
 * @param rgb RGB 颜色对象
 * @returns 所有格式的颜色字符串
 */
function convertToAllFormats(rgb: { r: number; g: number; b: number }) {
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  return {
    hex,
    rgb: alpha.value < 1 
      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.value})` 
      : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: alpha.value < 1 
      ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha.value})` 
      : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
  };
}

/**
 * 获取指定格式的输出数组（用于显示转换结果）
 */
function getOutputsArray(formatType: ColorFormatType): OutputFormat[] {
  let rgb: { r: number; g: number; b: number } | null = null;

  // 根据输入格式解析为 RGB
  switch (formatType) {
    case 'hex':
      rgb = hexToRgb(colorInputs.hex);
      break;
    case 'rgb':
      rgb = parseRgb(colorInputs.rgb);
      break;
    case 'hsl':
      const hsl = parseHsl(colorInputs.hsl);
      if (hsl) rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      break;
    case 'hsv':
      const hsv = parseHsv(colorInputs.hsv);
      if (hsv) rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      break;
  }

  if (!rgb) return [];

  // 转换为所有格式
  const allFormats = convertToAllFormats(rgb);

  // 根据配置获取输出格式
  const config = COLOR_FORMATS.find(c => c.type === formatType);
  if (!config) return [];

  return config.outputFormats.map(format => ({
    format,
    value: allFormats[format.toLowerCase() as ColorFormatType] || '',
  }));
}

/**
 * 处理颜色选择器变化
 */
function handleColorPicker() {
  const rgb = hexToRgb(pickerColor.value);
  if (rgb) {
    syncAllFormats(rgb);
  }
}

/**
 * 处理特定格式的输入变化
 */
function handleFormatInput(formatType: ColorFormatType) {
  let rgb: { r: number; g: number; b: number } | null = null;

  // 根据输入格式解析为 RGB
  switch (formatType) {
    case 'hex':
      rgb = hexToRgb(colorInputs.hex);
      break;
    case 'rgb':
      rgb = parseRgb(colorInputs.rgb);
      break;
    case 'hsl':
      const hsl = parseHsl(colorInputs.hsl);
      if (hsl) rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      break;
    case 'hsv':
      const hsv = parseHsv(colorInputs.hsv);
      if (hsv) rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      break;
  }

  if (rgb) {
    syncAllFormats(rgb);
  }
}

/**
 * 同步所有格式的输入值
 */
function syncAllFormats(rgb: { r: number; g: number; b: number }) {
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  pickerColor.value = hex;
  colorInputs.hex = hex;
  colorInputs.rgb = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  colorInputs.hsl = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  colorInputs.hsv = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
}

function updateAllFormats() {
  // 透明度改变时触发更新
}

// 复制文本
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    showMessage('已复制到剪贴板');
  } catch {
    showMessage('复制失败', 'error');
  }
}

/**
 * 重置颜色
 */
function resetColor() {
  pickerColor.value = DEFAULT_COLOR.hex;
  alpha.value = DEFAULT_ALPHA;
  colorInputs.hex = DEFAULT_COLOR.hex;
  colorInputs.rgb = DEFAULT_COLOR.rgb;
  colorInputs.hsl = DEFAULT_COLOR.hsl;
  colorInputs.hsv = DEFAULT_COLOR.hsv;
  showMessage('已重置');
}
</script>

<style scoped>
.tool-btn-secondary {
  @apply flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 font-medium;
  @apply hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer;
  @apply active:bg-gray-100;
}

/* 自定义滑块样式 */
input[type="range"] {
  @apply h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-blue-500 rounded-full cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
  @apply w-4 h-4 bg-blue-500 rounded-full cursor-pointer border-0;
}
</style>
