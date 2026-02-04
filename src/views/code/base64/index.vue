<template>
  <ToolLayout title="Base64 编解码" icon="🔐">
    <!-- 左侧工具栏 -->
    <template #header-left>
      <ToolButton icon="check" text="编码" @click="handleEncode" />
      <ToolButton icon="format" text="解码" @click="handleDecode" />
      <ToolButton icon="copy" text="复制结果" @click="copyOutput" />
    </template>

    <!-- 右侧工具栏 -->
    <template #header-right>
      <ToolButton
        v-if="activeMode === 'image'"
        icon="upload"
        text="上传图片"
        @click="selectImage"
      />
      <ToolButton type="icon" icon="trash" title="清空所有" @click="clearAll" />
    </template>

    <!-- Tab 切换 -->
    <TabBar v-model="activeMode" :tabs="modeTabs" />

    <!-- 主内容区 -->
    <div class="flex-1 overflow-auto p-4">
      <div class="max-w-7xl mx-auto space-y-3">
        <!-- 文本模式 -->
        <template v-if="activeMode === 'text'">
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
                    <div
                      class="text-xs text-gray-600 break-all mb-1 line-clamp-1"
                    >
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
        </template>

        <!-- 图片模式 -->
        <template v-else-if="activeMode === 'image'">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <!-- 图片上传/预览区 -->
            <div class="card-p">
              <h2 class="text-title mb-3">🖼️ 图片</h2>
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                :class="{ 'border-blue-400 bg-blue-50': isDragging }"
                @click="selectImage"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="handleDrop"
              >
                <template v-if="imagePreview">
                  <img
                    :src="imagePreview"
                    alt="预览图片"
                    class="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
                  />
                  <div class="mt-3 text-hint">
                    {{ imageInfo }}
                  </div>
                </template>
                <template v-else>
                  <div class="text-4xl mb-2">📁</div>
                  <div class="text-sm text-gray-600 mb-1">
                    点击或拖拽图片到此处
                  </div>
                  <div class="text-hint">
                    支持 PNG、JPEG、GIF、WebP、SVG 格式
                  </div>
                </template>
              </div>
              <input
                ref="imageInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageSelect"
              />
            </div>

            <!-- Base64 输出区 -->
            <div class="card-p">
              <div class="flex-between mb-3">
                <h2 class="text-title">📄 Base64 编码</h2>
                <div class="flex gap-2">
                  <button v-if="outputText" class="btn-sm" @click="copyOutput">
                    复制
                  </button>
                  <button v-if="outputText" class="btn-sm" @click="copyDataUri">
                    复制 Data URI
                  </button>
                </div>
              </div>
              <textarea
                v-model="outputText"
                :placeholder="
                  activeMode === 'image'
                    ? '图片的 Base64 编码将显示在这里...'
                    : ''
                "
                class="textarea-base font-mono text-xs bg-gray-50"
                rows="14"
                @input="handleBase64Input"
              ></textarea>
            </div>
          </div>

          <!-- 图片格式说明 -->
          <div class="card-p">
            <h2 class="text-title mb-3">📖 支持的图片格式</h2>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div
                v-for="info in IMAGE_FORMAT_INFO"
                :key="info.format"
                class="bg-gray-50 rounded-lg p-3 text-center"
              >
                <div class="text-sm font-bold text-blue-600 mb-1">
                  {{ info.format }}
                </div>
                <div class="text-xs text-gray-600">{{ info.description }}</div>
              </div>
            </div>
          </div>
        </template>

        <!-- Base64 知识卡片 -->
        <div class="card-p">
          <h2 class="text-title mb-3">💡 关于 Base64</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="(info, index) in BASE64_INFO"
              :key="index"
              class="bg-gray-50 rounded-lg p-3"
            >
              <div class="text-sm font-medium text-gray-800 mb-1">
                {{ info.title }}
              </div>
              <div class="text-xs text-gray-600">{{ info.content }}</div>
            </div>
          </div>
        </div>

        <!-- Base64 字符表 -->
        <div class="card-p">
          <h2 class="text-title mb-3">🔤 Base64 字符表</h2>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="(char, index) in BASE64_CHARS"
              :key="index"
              class="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 rounded text-sm font-mono hover:bg-blue-100 hover:text-blue-700 transition-colors"
              :title="`索引: ${index}`"
            >
              {{ char }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, inject, computed } from "vue";
import ToolLayout from "@/layouts/ToolLayout.vue";
import ToolButton from "@/components/ToolButton/ToolButton.vue";
import TabBar from "@/components/TabBar/TabBar.vue";
import SvgIcon from "@/components/svgIcon/SvgIcon.vue";
import { copyToClipboard } from "@/utils";
import {
  TEXT_ENCODE_OPTIONS,
  BASE64_EXAMPLES,
  BASE64_INFO,
  BASE64_CHARS,
  IMAGE_FORMAT_INFO,
  SUPPORTED_IMAGE_FORMATS,
  type Base64Example,
  type TextEncodeOption,
} from "./constants";
import type { MessageType } from "@/composables/useMessage";

// 从布局组件注入 showMessage
const showMessage =
  inject<(text: string, type?: MessageType) => void>("showMessage")!;

// 模式切换
const activeMode = ref<"text" | "image">("text");
const modeTabs = [
  { key: "text", label: "文本编解码" },
  { key: "image", label: "图片编解码" },
];

// 文本模式状态
const inputText = ref("");
const outputText = ref("");
const textEncoding = ref<TextEncodeOption>("utf8");

// 图片模式状态
const imageInputRef = ref<HTMLInputElement>();
const imagePreview = ref("");
const imageMimeType = ref("");
const imageSize = ref(0);
const isDragging = ref(false);

// 图片信息
const imageInfo = computed(() => {
  if (!imagePreview.value) return "";
  const sizeKB = (imageSize.value / 1024).toFixed(2);
  return `${imageMimeType.value} | ${sizeKB} KB | Base64: ${outputText.value.length} 字符`;
});

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
  if (activeMode.value === "text") {
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
  } else {
    showMessage("请上传图片进行编码", "info");
  }
};

/**
 * 处理解码
 */
const handleDecode = () => {
  if (activeMode.value === "text") {
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
  } else {
    // 图片模式：从 Base64 解码显示图片
    if (!outputText.value.trim()) {
      showMessage("请输入 Base64 编码", "error");
      return;
    }
    try {
      decodeBase64ToImage(outputText.value);
      showMessage("解码成功", "success");
    } catch (error) {
      showMessage("解码失败: 无效的图片 Base64", "error");
    }
  }
};

/**
 * 解码 Base64 为图片
 */
const decodeBase64ToImage = (base64: string) => {
  let dataUri = base64.trim();

  // 如果不是完整的 Data URI，尝试添加前缀
  if (!dataUri.startsWith("data:")) {
    // 尝试检测图片类型
    const header = atob(dataUri.slice(0, 20));
    let mimeType = "image/png"; // 默认

    if (header.startsWith("\x89PNG")) {
      mimeType = "image/png";
    } else if (header.startsWith("\xFF\xD8")) {
      mimeType = "image/jpeg";
    } else if (header.startsWith("GIF")) {
      mimeType = "image/gif";
    } else if (header.startsWith("RIFF") && header.includes("WEBP")) {
      mimeType = "image/webp";
    }

    dataUri = `data:${mimeType};base64,${base64}`;
    imageMimeType.value = mimeType;
  } else {
    // 从 Data URI 提取 MIME 类型
    const match = dataUri.match(/^data:([^;]+);base64,/);
    if (match) {
      imageMimeType.value = match[1];
    }
  }

  imagePreview.value = dataUri;

  // 计算大小
  const base64Data = dataUri.split(",")[1] || base64;
  imageSize.value = Math.floor((base64Data.length * 3) / 4);
};

/**
 * 选择图片
 */
const selectImage = () => {
  imageInputRef.value?.click();
};

/**
 * 处理图片选择
 */
const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    processImage(file);
  }
};

/**
 * 处理拖拽
 */
const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file && file.type.startsWith("image/")) {
    processImage(file);
  } else {
    showMessage("请拖入图片文件", "error");
  }
};

/**
 * 处理图片文件
 */
const processImage = (file: File) => {
  if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
    showMessage("不支持的图片格式", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUri = e.target?.result as string;
    imagePreview.value = dataUri;
    imageMimeType.value = file.type;
    imageSize.value = file.size;

    // 提取纯 Base64（不含 Data URI 前缀）
    const base64 = dataUri.split(",")[1];
    outputText.value = base64;

    showMessage("图片已转换为 Base64", "success");
  };
  reader.onerror = () => {
    showMessage("读取图片失败", "error");
  };
  reader.readAsDataURL(file);
};

/**
 * 处理 Base64 输入（图片模式）
 */
const handleBase64Input = () => {
  // 用户手动输入 Base64 时，清除预览
  if (activeMode.value === "image" && !imagePreview.value) {
    // 可以在这里添加自动解码逻辑
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
 * 复制 Data URI
 */
const copyDataUri = async () => {
  if (!outputText.value || !imageMimeType.value) {
    showMessage("没有可复制的内容", "error");
    return;
  }
  const dataUri = `data:${imageMimeType.value};base64,${outputText.value}`;
  await copyText(dataUri);
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
  imagePreview.value = "";
  imageMimeType.value = "";
  imageSize.value = 0;
  if (imageInputRef.value) {
    imageInputRef.value.value = "";
  }
  showMessage("已清空", "success");
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
