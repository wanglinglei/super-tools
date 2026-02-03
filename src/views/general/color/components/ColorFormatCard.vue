<template>
  <div class="card-p">
    <h3 class="text-subtitle mb-3">{{ title }}</h3>

    <div class="space-y-3">
      <!-- 输入区 -->
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700 w-16">{{
          format
        }}</label>
        <input
          :value="modelValue"
          type="text"
          :placeholder="placeholder"
          class="flex-1 input-base"
          @input="handleInput"
        />
        <div
          class="w-12 h-10 rounded border border-gray-300"
          :style="{ backgroundColor: previewColor }"
        ></div>
      </div>

      <!-- 输出区 -->
      <div class="space-y-2">
        <p class="text-hint font-medium">输出:</p>

        <div
          v-for="output in outputs"
          :key="output.format"
          class="flex items-center gap-2"
        >
          <label class="text-xs font-medium text-gray-600 w-12">{{
            output.format
          }}</label>
          <input
            :value="output.value"
            readonly
            class="flex-1 px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded"
          />
          <button
            class="copy-btn"
            @click="$emit('copy', output.value)"
            title="复制"
          >
            <SvgIcon name="copy" size="14px" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from "@/components/svgIcon/SvgIcon.vue";

/**
 * 颜色格式转换卡片组件
 *
 * @component ColorFormatCard
 */

/**
 * 输出格式定义
 */
export interface OutputFormat {
  format: string; // 格式名称（如 RGB、HSL、HSV）
  value: string; // 格式化后的颜色值
}

interface Props {
  /** 卡片标题 */
  title: string;
  /** 输入格式名称（如 HEX、RGB） */
  format: string;
  /** 输入框的值 */
  modelValue: string;
  /** 输入框占位符 */
  placeholder: string;
  /** 预览颜色（用于右侧颜色块） */
  previewColor: string;
  /** 输出格式列表 */
  outputs: OutputFormat[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  /** 输入值改变事件 */
  "update:modelValue": [value: string];
  /** 复制事件 */
  copy: [value: string];
}>();

/**
 * 处理输入变化
 */
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<style scoped>
.copy-btn {
  @apply w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-600 rounded;
  @apply hover:bg-gray-200 hover:text-gray-800 transition-colors cursor-pointer;
  @apply active:bg-gray-300;
}
</style>
