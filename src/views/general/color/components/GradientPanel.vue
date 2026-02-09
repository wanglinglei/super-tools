<template>
  <div class="space-y-4">
    <!-- 渐变色生成器 -->
    <div class="card-p">
      <h2 class="text-subtitle mb-3">🌈 渐变色生成</h2>

      <div class="space-y-4">
        <!-- 渐变类型 -->
        <div class="flex items-center gap-4 flex-wrap">
          <label class="text-sm font-medium text-gray-700">渐变类型:</label>
          <div class="flex gap-3">
            <label
              v-for="type in GRADIENT_TYPES"
              :key="type.value"
              class="inline-flex items-center cursor-pointer"
            >
              <input
                v-model="gradientType"
                type="radio"
                :value="type.value"
                class="mr-1.5 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700">{{ type.label }}</span>
            </label>
          </div>
        </div>

        <!-- 角度控制（线性 / 锥形） -->
        <div v-if="gradientType !== 'radial'" class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">
              {{ gradientType === "linear" ? "渐变角度" : "起始角度" }}:
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model.number="gradientAngle"
                type="number"
                min="0"
                max="360"
                class="w-20 input-base text-center"
              />
              <span class="text-sm text-gray-500">°</span>
            </div>
          </div>
          <input
            v-model.number="gradientAngle"
            type="range"
            min="0"
            max="360"
            class="w-full"
          />
          <!-- 快捷角度 -->
          <div class="flex gap-1 flex-wrap">
            <button
              v-for="a in QUICK_ANGLES"
              :key="a"
              class="px-2 py-0.5 text-xs rounded transition-colors cursor-pointer"
              :class="
                gradientAngle === a
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              "
              @click="gradientAngle = a"
            >
              {{ a }}°
            </button>
          </div>
        </div>

        <!-- 位置控制（径向） -->
        <div v-else class="flex items-center gap-3">
          <label class="text-sm font-medium text-gray-700">渐变位置:</label>
          <select v-model="radialPosition" class="input-base w-auto">
            <option
              v-for="pos in RADIAL_POSITIONS"
              :key="pos.value"
              :value="pos.value"
            >
              {{ pos.label }}
            </option>
          </select>
        </div>

        <!-- 渐变预览 -->
        <div
          class="h-24 rounded-lg border border-gray-200 shadow-inner"
          :style="{ background: gradientValue }"
        ></div>

        <!-- 色标列表 -->
        <div>
          <div class="flex-between mb-2">
            <p class="text-sm font-medium text-gray-700">色标列表:</p>
            <button
              class="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 cursor-pointer transition-colors"
              @click="addStop"
            >
              + 添加色标
            </button>
          </div>
          <div class="space-y-2">
            <div
              v-for="(stop, index) in colorStops"
              :key="index"
              class="flex items-center gap-3"
            >
              <input
                v-model="stop.color"
                type="color"
                class="w-10 h-8 rounded border border-gray-300 cursor-pointer flex-shrink-0"
              />
              <input
                v-model="stop.color"
                type="text"
                class="w-24 input-base text-xs font-mono"
              />
              <input
                v-model.number="stop.position"
                type="range"
                min="0"
                max="100"
                class="flex-1"
              />
              <span
                class="text-xs text-gray-500 w-10 text-right font-mono flex-shrink-0"
              >
                {{ stop.position }}%
              </span>
              <button
                v-if="colorStops.length > 2"
                class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer flex-shrink-0"
                title="删除色标"
                @click="removeStop(index)"
              >
                ×
              </button>
              <div v-else class="w-6 flex-shrink-0"></div>
            </div>
          </div>
        </div>

        <!-- CSS 代码输出 -->
        <div>
          <div class="flex-between mb-1">
            <p class="text-sm font-medium text-gray-700">CSS 代码:</p>
            <button
              class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 cursor-pointer transition-colors"
              @click="copyGradientCSS"
            >
              📋 复制
            </button>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <code class="text-xs font-mono text-gray-800 break-all">
              background: {{ gradientValue }};
            </code>
          </div>
        </div>
      </div>
    </div>

    <!-- 渐变预设 -->
    <div class="card-p">
      <h2 class="text-subtitle mb-3">✨ 渐变预设</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          v-for="preset in GRADIENT_PRESETS"
          :key="preset.name"
          class="cursor-pointer group"
          @click="useGradientPreset(preset)"
        >
          <div
            class="h-16 rounded-lg border border-gray-200 group-hover:border-blue-300 transition-colors shadow-sm"
            :style="{ background: getPresetGradientCSS(preset) }"
          ></div>
          <div class="text-xs text-center text-gray-600 mt-1.5">
            {{ preset.icon }} {{ preset.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 使用说明 -->
    <div class="status-info">
      <span class="font-bold">💡 使用提示：</span>
      支持线性、径向、锥形渐变，自定义色标和角度，点击预设快速加载。
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from "vue";
import { copyToClipboard } from "@/utils";
import {
  GRADIENT_TYPES,
  RADIAL_POSITIONS,
  QUICK_ANGLES,
  GRADIENT_PRESETS,
  DEFAULT_GRADIENT_STOPS,
  getGradientCSS,
  type GradientType,
  type ColorStop,
  type GradientPreset,
} from "../constants";
import type { MessageType } from "@/composables/useMessage";

const props = defineProps<{
  currentColor: string;
}>();

const showMessage =
  inject<(text: string, type?: MessageType) => void>("showMessage")!;

// 渐变状态
const gradientType = ref<GradientType>("linear");
const gradientAngle = ref(135);
const radialPosition = ref("center");
const colorStops = ref<ColorStop[]>(
  DEFAULT_GRADIENT_STOPS.map((s) => ({ ...s }))
);

// 渐变 CSS 值
const gradientValue = computed(() => {
  return getGradientCSS(
    gradientType.value,
    colorStops.value,
    gradientAngle.value,
    radialPosition.value
  );
});

function getPresetGradientCSS(preset: GradientPreset): string {
  return getGradientCSS(preset.type, preset.stops, preset.angle, "center");
}

function addStop() {
  if (colorStops.value.length >= 10) {
    showMessage("最多支持 10 个色标", "warning");
    return;
  }

  // 在最大间隔处插入新色标
  const positions = colorStops.value
    .map((s) => s.position)
    .sort((a, b) => a - b);
  let newPosition = 50;

  if (positions.length >= 2) {
    let maxGap = 0;
    let gapStart = 0;
    for (let i = 0; i < positions.length - 1; i++) {
      const gap = (positions[i + 1] ?? 100) - (positions[i] ?? 0);
      if (gap > maxGap) {
        maxGap = gap;
        gapStart = positions[i] ?? 0;
      }
    }
    newPosition = Math.round(gapStart + maxGap / 2);
  }

  colorStops.value.push({
    color: props.currentColor,
    position: newPosition,
  });
  showMessage("已添加色标（使用当前选中颜色）");
}

function removeStop(index: number) {
  if (colorStops.value.length <= 2) {
    showMessage("至少需要 2 个色标", "warning");
    return;
  }
  colorStops.value.splice(index, 1);
}

function useGradientPreset(preset: GradientPreset) {
  gradientType.value = preset.type;
  gradientAngle.value = preset.angle;
  radialPosition.value = "center";
  colorStops.value = preset.stops.map((s) => ({ ...s }));
  showMessage(`已加载预设: ${preset.name}`);
}

async function copyGradientCSS() {
  const css = `background: ${gradientValue.value};`;
  const success = await copyToClipboard(css);
  if (success) {
    showMessage("已复制到剪贴板");
  } else {
    showMessage("复制失败", "error");
  }
}

function reset() {
  gradientType.value = "linear";
  gradientAngle.value = 135;
  radialPosition.value = "center";
  colorStops.value = DEFAULT_GRADIENT_STOPS.map((s) => ({ ...s }));
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
</style>
