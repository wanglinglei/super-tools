<template>
  <div class="space-y-3">
    <!-- 输入输出区 - 左右布局 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <!-- 输入区 -->
      <div class="card-p">
        <div class="flex-between mb-3">
          <h2 class="text-title">📝 输入</h2>
          <span class="text-hint">{{ inputText.length }} 字符</span>
        </div>
        <textarea
          v-model="inputText"
          placeholder="输入需要编码或解码的文本..."
          class="textarea-base font-mono"
          rows="12"
        ></textarea>
      </div>

      <!-- 输出区 -->
      <div class="card-p">
        <div class="flex-between mb-3">
          <h2 class="text-title">✅ 输出</h2>
          <span class="text-hint">{{ outputText.length }} 字符</span>
        </div>
        <textarea
          v-model="outputText"
          readonly
          placeholder="结果将显示在这里..."
          class="textarea-base font-mono bg-gray-50"
          rows="12"
        ></textarea>
      </div>
    </div>

    <!-- 编码选项 -->
    <div class="card-p">
      <h2 class="text-title mb-3">⚙️ 编码选项</h2>
      <div class="flex gap-4 flex-wrap">
        <label
          v-for="option in TEXT_ENCODE_OPTIONS"
          :key="option.value"
          class="inline-flex items-center cursor-pointer"
        >
          <input
            v-model="textEncoding"
            type="radio"
            :value="option.value"
            class="mr-2 text-blue-600 focus:ring-blue-500"
          />
          <span class="text-sm text-gray-700">
            <span class="font-medium">{{ option.label }}</span>
            <span class="text-hint ml-1">- {{ option.description }}</span>
          </span>
        </label>
      </div>
    </div>

    <!-- 常用示例 -->
    <div class="card-p">
      <h2 class="text-title mb-3">📚 常用示例</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="(example, index) in BASE64_EXAMPLES"
          :key="index"
          class="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
          @click="useExample(example)"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-800 mb-1">
                {{ example.name }}
              </div>
              <div class="text-xs text-gray-600 break-all mb-1 line-clamp-1">
                <span class="text-label">原文:</span>
                {{ example.original }}
              </div>
              <div class="text-xs text-gray-500 break-all line-clamp-1">
                <span class="text-label">编码:</span>
                {{ example.encoded }}
              </div>
            </div>
            <button
              class="p-1.5 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
              @click.stop="copyText(example.encoded)"
              title="复制编码"
            >
              <SvgIcon name="copy" size="14px" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import SvgIcon from "@/components/svgIcon/SvgIcon.vue";
import { copyToClipboard } from "@/utils";
import {
  TEXT_ENCODE_OPTIONS,
  BASE64_EXAMPLES,
  type Base64Example,
  type TextEncodeOption,
} from "../constants";
import type { MessageType } from "@/composables/useMessage";

const showMessage =
  inject<(text: string, type?: MessageType) => void>("showMessage")!;

// 文本模式状态
const inputText = ref("");
const outputText = ref("");
const textEncoding = ref<TextEncodeOption>("utf8");

/**
 * 文本编码为 Base64
 */
const encodeText = (text: string): string => {
  if (textEncoding.value === "utf8") {
    // UTF-8 编码
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  } else {
    // ASCII 编码
    return btoa(text);
  }
};

/**
 * Base64 解码为文本
 */
const decodeText = (base64: string): string => {
  if (textEncoding.value === "utf8") {
    // UTF-8 解码
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(bytes);
  } else {
    // ASCII 解码
    return atob(base64);
  }
};

/**
 * 处理编码
 */
const handleEncode = () => {
  if (!inputText.value.trim()) {
    showMessage("请输入要编码的文本", "error");
    return;
  }
  try {
    outputText.value = encodeText(inputText.value);
    showMessage("编码成功", "success");
  } catch (error) {
    showMessage("编码失败: " + (error as Error).message, "error");
  }
};

/**
 * 处理解码
 */
const handleDecode = () => {
  if (!inputText.value.trim()) {
    showMessage("请输入要解码的 Base64 文本", "error");
    return;
  }
  try {
    // 去除可能的空格和换行
    const cleanBase64 = inputText.value.replace(/\s/g, "");
    outputText.value = decodeText(cleanBase64);
    showMessage("解码成功", "success");
  } catch (error) {
    showMessage("解码失败: 无效的 Base64 字符串", "error");
  }
};

/**
 * 使用示例
 */
const useExample = (example: Base64Example) => {
  inputText.value = example.original;
  outputText.value = example.encoded;
  showMessage(`已应用示例：${example.name}`, "success");
};

/**
 * 复制输出结果
 */
const copyOutput = async () => {
  if (!outputText.value) {
    showMessage("没有可复制的结果", "error");
    return;
  }
  await copyText(outputText.value);
};

/**
 * 复制文本
 */
const copyText = async (text: string) => {
  const success = await copyToClipboard(text);
  if (success) {
    showMessage("已复制到剪贴板", "success");
  } else {
    showMessage("复制失败", "error");
  }
};

/**
 * 清空所有
 */
const clearAll = () => {
  inputText.value = "";
  outputText.value = "";
  showMessage("已清空", "success");
};

defineExpose({
  handleEncode,
  handleDecode,
  copyOutput,
  clearAll,
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
