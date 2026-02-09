<template>
  <div class="space-y-4">
    <!-- 颜色选择器和透明度 -->
    <div class="card-p">
      <h2 class="text-subtitle mb-3">🎨 颜色选择</h2>

      <div class="space-y-4">
        <!-- 颜色选择器 -->
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium text-gray-700 w-24"
            >选择颜色:</label
          >
          <input
            :value="color"
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
            <label class="text-sm font-medium text-gray-700"
              >全局透明度 (Alpha):</label
            >
            <span class="text-sm text-blue-600 font-medium">{{ alpha }}</span>
          </div>
          <input
            :value="alpha"
            type="range"
            min="0"
            max="1"
            step="0.01"
            class="w-full"
            @input="handleAlphaInput"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>0 (透明)</span>
            <span>1 (不透明)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 取色器 -->
    <div class="card-p">
      <h2 class="text-subtitle mb-3">💉 取色器</h2>

      <div class="space-y-4">
        <!-- 操作按钮 -->
        <div class="flex items-center gap-3 flex-wrap">
          <button
            v-if="isEyeDropperSupported"
            class="btn"
            @click="pickFromScreen"
          >
            🎯 从屏幕取色
          </button>
          <button class="btn" @click="triggerImageUpload">
            🖼️ {{ pickedImage ? "更换图片" : "从图片取色" }}
          </button>
          <input
            ref="imageInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageUpload"
          />
          <button v-if="pickedImage" class="btn-sm" @click="clearPickerImage">
            清除图片
          </button>
        </div>

        <!-- 浏览器支持提示 -->
        <p v-if="!isEyeDropperSupported" class="text-xs text-gray-400">
          💡 屏幕取色功能需要 Chrome 95+ / Edge 95+ 浏览器支持
        </p>

        <!-- 图片拖放区域（无图片时） -->
        <div
          v-if="!pickedImage"
          class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors"
          :class="
            isDragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          "
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleImageDrop"
          @click="triggerImageUpload"
        >
          <p class="text-sm text-gray-500">🖼️ 拖拽图片到此处，或点击选择图片</p>
          <p class="text-xs text-gray-400 mt-1">
            支持 JPG、PNG、GIF、WebP 格式
          </p>
        </div>

        <!-- 图片取色区域（有图片时） -->
        <div v-if="pickedImage">
          <div
            class="border border-gray-200 rounded-lg overflow-hidden cursor-crosshair"
            @mousemove="handleImageMouseMove"
            @mouseleave="hoverColor = ''"
            @click="pickColorFromImage"
          >
            <canvas ref="imageCanvasRef" class="w-full block"></canvas>
          </div>
          <!-- 悬停颜色提示 -->
          <div v-if="hoverColor" class="flex items-center gap-2 mt-2">
            <div
              class="w-4 h-4 rounded border border-gray-300"
              :style="{ backgroundColor: hoverColor }"
            ></div>
            <span class="text-xs font-mono text-gray-500">{{
              hoverColor
            }}</span>
            <span class="text-xs text-gray-400">· 点击取色</span>
          </div>
          <!-- 已选颜色 -->
          <div v-if="pickedImageColor" class="flex items-center gap-3 mt-3">
            <div
              class="w-10 h-10 rounded-lg border border-gray-300 shadow-sm flex-shrink-0"
              :style="{ backgroundColor: pickedImageColor }"
            ></div>
            <span class="text-sm font-mono font-medium text-gray-800">
              {{ pickedImageColor }}
            </span>
            <button
              class="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 cursor-pointer transition-colors"
              @click="applyPickedColor(pickedImageColor)"
            >
              应用到转换器
            </button>
            <button
              class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 cursor-pointer transition-colors"
              @click="copyText(pickedImageColor)"
            >
              📋 复制
            </button>
          </div>
        </div>

        <!-- 取色历史 -->
        <div v-if="colorHistory.length > 0">
          <div class="flex-between mb-2">
            <p class="text-sm font-medium text-gray-700">取色历史:</p>
            <button
              class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 cursor-pointer transition-colors"
              @click="clearHistory"
            >
              清除
            </button>
          </div>
          <div class="flex gap-2 flex-wrap">
            <div
              v-for="(c, idx) in colorHistory"
              :key="idx"
              class="color-history-item"
              :style="{ backgroundColor: c }"
              :title="c"
              @click="applyPickedColor(c)"
            ></div>
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
    <div class="status-info">
      <span class="font-bold">💡 使用提示：</span>
      支持屏幕/图片取色、RGB/HEX/HSL/HSV 格式互转，取色后自动同步。
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  reactive,
  inject,
  onMounted,
  nextTick,
  watch,
} from "vue";
import ColorFormatCard from "./ColorFormatCard.vue";
import { copyToClipboard } from "@/utils";
import {
  COLOR_FORMATS,
  DEFAULT_COLOR,
  type ColorFormatType,
} from "../constants";
import type { OutputFormat } from "./ColorFormatCard.vue";
import type { MessageType } from "@/composables/useMessage";
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
} from "../transform";

const props = defineProps<{
  color: string;
  alpha: number;
}>();

const emit = defineEmits<{
  "update:color": [value: string];
  "update:alpha": [value: number];
}>();

const showMessage =
  inject<(text: string, type?: MessageType) => void>("showMessage")!;

// 各格式输入（使用响应式对象统一管理）
const colorInputs = reactive<Record<ColorFormatType, string>>({
  hex: DEFAULT_COLOR.hex,
  rgb: DEFAULT_COLOR.rgb,
  hsl: DEFAULT_COLOR.hsl,
  hsv: DEFAULT_COLOR.hsv,
});

// 监听外部颜色变化，同步到 inputs
watch(
  () => props.color,
  (newColor) => {
    // 只有当 newColor 与当前 hex input 不一致时才同步，避免循环更新
    // 但这里简化处理，每次 update color 都重新计算所有 formats 比较安全
    const rgb = hexToRgb(newColor);
    if (rgb) {
      // 更新 inputs 但不触发 emit，因为是外部传来的
      syncInputsFromRgb(rgb);
    }
  },
  { immediate: true }
);

// 当前颜色（带透明度）
const currentColorWithAlpha = computed(() => {
  const rgb = hexToRgb(props.color);
  if (rgb) {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${props.alpha})`;
  }
  return props.color;
});

// ==================== 颜色转换逻辑 ====================

function getPreviewColor(formatType: ColorFormatType): string {
  if (formatType === "hsv") {
    return hsvToRgbString(colorInputs[formatType]);
  }
  return colorInputs[formatType];
}

function convertToAllFormats(rgb: { r: number; g: number; b: number }) {
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  return {
    hex,
    rgb:
      props.alpha < 1
        ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${props.alpha})`
        : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl:
      props.alpha < 1
        ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${props.alpha})`
        : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
  };
}

function getOutputsArray(formatType: ColorFormatType): OutputFormat[] {
  let rgb: { r: number; g: number; b: number } | null = null;
  switch (formatType) {
    case "hex":
      rgb = hexToRgb(colorInputs.hex);
      break;
    case "rgb":
      rgb = parseRgb(colorInputs.rgb);
      break;
    case "hsl":
      const hsl = parseHsl(colorInputs.hsl);
      if (hsl) rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      break;
    case "hsv":
      const hsv = parseHsv(colorInputs.hsv);
      if (hsv) rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      break;
  }

  if (!rgb) return [];
  const allFormats = convertToAllFormats(rgb);
  const config = COLOR_FORMATS.find((c) => c.type === formatType);
  if (!config) return [];

  return config.outputFormats.map((format) => ({
    format,
    value: allFormats[format.toLowerCase() as ColorFormatType] || "",
  }));
}

// 仅更新 inputs，不 emit
function syncInputsFromRgb(rgb: { r: number; g: number; b: number }) {
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  // 如果当前 hex 输入已经是正确的，就不覆盖，避免光标跳动等问题（虽然这里是全量覆盖）
  if (colorInputs.hex.toLowerCase() !== hex.toLowerCase())
    colorInputs.hex = hex;

  // 对于其他格式，简单覆盖
  colorInputs.rgb = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  colorInputs.hsl = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  colorInputs.hsv = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
}

function handleColorPicker(event: Event) {
  const val = (event.target as HTMLInputElement).value;
  emit("update:color", val);
  // watch 会处理 syncInputsFromRgb
}

function handleAlphaInput(event: Event) {
  const val = Number((event.target as HTMLInputElement).value);
  emit("update:alpha", val);
}

function handleFormatInput(formatType: ColorFormatType) {
  let rgb: { r: number; g: number; b: number } | null = null;
  switch (formatType) {
    case "hex":
      rgb = hexToRgb(colorInputs.hex);
      break;
    case "rgb":
      rgb = parseRgb(colorInputs.rgb);
      break;
    case "hsl":
      const hsl = parseHsl(colorInputs.hsl);
      if (hsl) rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      break;
    case "hsv":
      const hsv = parseHsv(colorInputs.hsv);
      if (hsv) rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      break;
  }

  if (rgb) {
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    emit("update:color", hex);
    // 同时更新其他 inputs
    syncInputsFromRgb(rgb);
  }
}

async function copyText(text: string) {
  const success = await copyToClipboard(text);
  if (success) {
    showMessage("已复制到剪贴板");
  } else {
    showMessage("复制失败", "error");
  }
}

// ==================== 取色器功能 ====================

const isEyeDropperSupported = ref(false);
const imageInputRef = ref<HTMLInputElement | null>(null);
const imageCanvasRef = ref<HTMLCanvasElement | null>(null);
const pickedImage = ref(false);
const pickedImageColor = ref("");
const hoverColor = ref("");
const isDragging = ref(false);
const colorHistory = ref<string[]>([]);

onMounted(() => {
  isEyeDropperSupported.value = "EyeDropper" in window;
});

async function pickFromScreen() {
  try {
    const eyeDropper = new (window as any).EyeDropper();
    const result = await eyeDropper.open();
    const hex = result.sRGBHex as string;
    applyPickedColor(hex);
    addToHistory(hex);
    showMessage(`已取色: ${hex}`);
  } catch (e: any) {
    if (e?.name !== "AbortError") {
      showMessage("取色失败", "error");
    }
  }
}

function triggerImageUpload() {
  imageInputRef.value?.click();
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file && file.type.startsWith("image/")) {
    loadImageFile(file);
  }
}

function handleImageDrop(event: DragEvent) {
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (file && file.type.startsWith("image/")) {
    loadImageFile(file);
  } else {
    showMessage("请拖入图片文件", "warning");
  }
}

function loadImageFile(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      pickedImage.value = true;
      pickedImageColor.value = "";
      hoverColor.value = "";
      nextTick(() => {
        drawImageToCanvas(img);
      });
    };
    img.src = (e.target?.result as string) || "";
  };
  reader.readAsDataURL(file);
}

function drawImageToCanvas(img: HTMLImageElement) {
  const canvas = imageCanvasRef.value;
  if (!canvas) return;

  const container = canvas.parentElement;
  const maxWidth = container?.clientWidth || 600;
  const maxHeight = 400;
  const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height);

  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
}

function getCanvasPixelColor(event: MouseEvent): string | null {
  const canvas = imageCanvasRef.value;
  if (!canvas) return null;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = Math.floor((event.clientX - rect.left) * scaleX);
  const y = Math.floor((event.clientY - rect.top) * scaleY);

  if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return null;

  const pixel = ctx.getImageData(x, y, 1, 1).data;
  return rgbToHex(pixel[0]!, pixel[1]!, pixel[2]!);
}

function handleImageMouseMove(event: MouseEvent) {
  const color = getCanvasPixelColor(event);
  hoverColor.value = color || "";
}

function pickColorFromImage(event: MouseEvent) {
  const color = getCanvasPixelColor(event);
  if (color) {
    pickedImageColor.value = color;
    addToHistory(color);
    applyPickedColor(color);
  }
}

function applyPickedColor(hex: string) {
  emit("update:color", hex);
}

function addToHistory(hex: string) {
  const index = colorHistory.value.indexOf(hex);
  if (index !== -1) {
    colorHistory.value.splice(index, 1);
  }
  colorHistory.value.unshift(hex);
  if (colorHistory.value.length > 20) {
    colorHistory.value.pop();
  }
}

function clearPickerImage() {
  pickedImage.value = false;
  pickedImageColor.value = "";
  hoverColor.value = "";
  if (imageInputRef.value) {
    imageInputRef.value.value = "";
  }
}

function clearHistory() {
  colorHistory.value = [];
  showMessage("历史已清除");
}

function reset() {
  colorInputs.hex = DEFAULT_COLOR.hex;
  colorInputs.rgb = DEFAULT_COLOR.rgb;
  colorInputs.hsl = DEFAULT_COLOR.hsl;
  colorInputs.hsv = DEFAULT_COLOR.hsv;
  clearPickerImage();
  colorHistory.value = [];
}

defineExpose({
  reset,
});
</script>

<style scoped>
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

.color-history-item {
  @apply w-8 h-8 rounded-lg border border-gray-200 cursor-pointer transition-all;
  @apply hover:scale-110 hover:border-blue-400 hover:shadow-md;
}
</style>
